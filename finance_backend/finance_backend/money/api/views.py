from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db import transaction as db_transaction
from datetime import timedelta
from rest_framework.decorators import action
import openai
import json
import re
from rest_framework import serializers
from drf_spectacular.utils import (
    extend_schema,
    OpenApiExample,
    OpenApiResponse,
    OpenApiParameter,
)

from finance_backend.money.api.serializers.transactions_serializers import (
    TransactionSerializer,
)
from finance_backend.money.api.serializers.dashboard_serializers import (
    DashboardRecentTransactionSerializer,
)
from finance_backend.money.models.transactions import Transaction
from finance_backend.money.models.accounts import Account


class LinkTransferSerializer(serializers.Serializer):
    transaction1_id = serializers.IntegerField()
    transaction2_id = serializers.IntegerField()


class TransactionParseRawSerializer(serializers.Serializer):
    raw_text = serializers.CharField()


class ParsedTransactionSerializer(serializers.Serializer):
    date = serializers.DateField()
    retailer = serializers.CharField()
    amount = serializers.DecimalField(max_digits=15, decimal_places=2)


class TransactionParseRawResponseSerializer(serializers.Serializer):
    transactions = ParsedTransactionSerializer(many=True)


class TransactionWithBalanceSerializer(TransactionSerializer):
    balance = serializers.DecimalField(max_digits=15, decimal_places=2, read_only=True)


# 계좌 이체 거래 연결을 위한 API View
@extend_schema(
    summary="계좌 이체 거래 연결",
    description="두 개의 거래 ID를 받아 조건(금액 반대, 통화 동일, 날짜 근접)을 만족하면 서로 연결합니다.",
    request=LinkTransferSerializer,
    responses={
        200: OpenApiResponse(
            description="성공적으로 연결됨",
            examples=[
                OpenApiExample(
                    "성공",
                    value={
                        "message": "거래 123와(과) 456가 성공적으로 연결되었습니다."
                    },
                )
            ],
        ),
        400: OpenApiResponse(
            description="입력값 오류 또는 연결 조건 불일치",
            examples=[
                OpenApiExample(
                    "오류",
                    value={
                        "error": "두 거래의 금액이 서로 반대 부호의 같은 금액이어야 합니다."
                    },
                )
            ],
        ),
        404: OpenApiResponse(description="거래를 찾을 수 없음"),
        500: OpenApiResponse(description="서버 내부 오류"),
    },
)
class LinkTransferView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LinkTransferSerializer

    def post(self, request, *args, **kwargs):
        transaction1_id = request.data.get("transaction1_id")
        transaction2_id = request.data.get("transaction2_id")

        # --- 입력 값 검증 ---
        if not transaction1_id or not transaction2_id:
            return Response(
                {
                    "error": "두 개의 transaction ID (transaction1_id, transaction2_id)를 제공해야 합니다."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if transaction1_id == transaction2_id:
            return Response(
                {"error": "동일한 거래를 연결할 수 없습니다."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # --- 거래 객체 가져오기 (요청 사용자 소유인지 확인) ---
            t1 = get_object_or_404(
                Transaction.objects.select_related("account"),
                pk=transaction1_id,
                user=request.user,
            )
            t2 = get_object_or_404(
                Transaction.objects.select_related("account"),
                pk=transaction2_id,
                user=request.user,
            )
        except (TypeError, ValueError):
            return Response(
                {"error": "유효하지 않은 transaction ID 형식입니다."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Transaction.DoesNotExist:
            # get_object_or_404가 Http404를 발생시키지만, 명시적으로 처리
            return Response(
                {
                    "error": "하나 또는 두 개의 거래를 찾을 수 없거나 접근 권한이 없습니다."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # --- 연결 조건 검증 ---
        # 1. 이미 연결되어 있는지 확인
        if t1.linked_transaction or t2.linked_transaction:
            return Response(
                {
                    "error": "하나 또는 두 개의 거래가 이미 다른 거래와 연결되어 있습니다."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 2. 통화 확인 (계좌 기준)
        if t1.account.currency != t2.account.currency:
            return Response(
                {"error": "두 거래의 계좌 통화가 동일해야 합니다."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 3. 금액 확인 (부호 반대, 크기 동일)
        if t1.amount != -t2.amount:
            return Response(
                {"error": "두 거래의 금액이 서로 반대 부호의 같은 금액이어야 합니다."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 4. 날짜 확인 (2일 이내)
        date_difference = abs(t1.date - t2.date)
        if date_difference > timedelta(days=2):
            return Response(
                {
                    "error": f"두 거래의 날짜 차이가 2일 이내여야 합니다 (현재: {date_difference.days}일)."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # --- 조건 만족 시 연결 ---
        try:
            with db_transaction.atomic():  # 원자적 연산 보장
                t1.linked_transaction = t2
                t2.linked_transaction = t1
                t1.save(update_fields=["linked_transaction"])
                t2.save(update_fields=["linked_transaction"])
        except Exception:
            # 데이터베이스 저장 중 오류 발생 시
            # 필요시 로깅 추가: logger.error(f"계좌 이체 연결 중 오류 발생: {e}")
            return Response(
                {"error": "거래 연결 중 오류가 발생했습니다."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # --- 성공 응답 ---
        # 성공 시 연결된 두 거래 정보를 다시 serialize하여 반환할 수도 있음
        # serializer = TransactionSerializer(instance=[t1, t2], many=True)
        # return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(
            {"message": f"거래 {t1.id}와(과) {t2.id}가 성공적으로 연결되었습니다."},
            status=status.HTTP_200_OK,
        )


# --- 대시보드 최근 거래 내역 API View 추가 ---
class DashboardRecentTransactionsView(generics.ListAPIView):
    """
    대시보드에 표시할 최근 거래 내역 N개를 반환합니다.
    판매처 및 계좌 정보를 포함합니다.
    """

    serializer_class = DashboardRecentTransactionSerializer
    permission_classes = [IsAuthenticated]
    # 페이지네이션은 적용하지 않음 (최근 N개만 반환하므로)
    pagination_class = None

    def get_queryset(self):
        """
        요청 사용자의 최근 거래 10개를 날짜 내림차순으로 가져옵니다.
        성능을 위해 select_related를 사용합니다.
        """
        user = self.request.user
        return (
            Transaction.objects.filter(user=user)
            .select_related("account", "retailer")
            .order_by("-date", "-id")[:10]
        )  # 최근 10개


class TransactionViewSet(APIView):
    @extend_schema(
        summary="계좌별 거래 내역 (잔액 포함)",
        description="특정 계좌의 모든 거래 내역을 날짜 오름차순으로 조회하며, 각 거래 시점의 누적 잔액(balance)을 포함합니다.",
        parameters=[
            OpenApiParameter(
                name="account_id",
                location=OpenApiParameter.PATH,
                description="계좌 ID",
                required=True,
                type=int,
            )
        ],
        responses={200: TransactionWithBalanceSerializer(many=True)},
    )
    @action(
        detail=False,
        methods=["get"],
        url_path="account/(?P<account_id>[^/.]+)/with-balance",
    )
    def account_transactions_with_balance(self, request, account_id=None):
        account = get_object_or_404(Account, pk=account_id, user=request.user)
        transactions = Transaction.objects.filter(account=account).order_by(
            "date", "amount", "id"
        )
        result = []
        balance = 0
        for tx in transactions:
            balance += tx.amount
            tx_data = TransactionSerializer(tx).data
            tx_data["balance"] = str(balance)
            result.append(tx_data)
        # Use the specific serializer for the response schema
        serializer = TransactionWithBalanceSerializer(result, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@extend_schema(
    request=TransactionParseRawSerializer,
    responses={
        200: OpenApiResponse(
            response=TransactionParseRawResponseSerializer,
            description="파싱된 거래 내역 리스트",
            examples=[
                OpenApiExample(
                    "성공 예시",
                    value={
                        "transactions": [
                            {
                                "date": "2023-05-04",
                                "retailer": "WHOLE FOODS MARKET",
                                "amount": "50.63",
                            },
                            {
                                "date": "2023-05-03",
                                "retailer": "IKEA - IKEA SEATTLE",
                                "amount": "5.46",
                            },
                            {
                                "date": "2023-05-03",
                                "retailer": "IKEA - IKEA SEATTLE",
                                "amount": "5.50",
                            },
                            {
                                "date": "2023-05-03",
                                "retailer": "IKEA NORTH AMERICA SERVICES",
                                "amount": "472.71",
                            },
                            {
                                "date": "2023-05-02",
                                "retailer": "CEPAE - L'EXPERIENCEBELLEVUE WA",
                                "amount": "48.29",
                            },
                            {
                                "date": "2023-05-01",
                                "retailer": "83106 - WEST MAIN PHBELLEVUE WA",
                                "amount": "6.00",
                            },
                            {
                                "date": "2023-04-30",
                                "retailer": "MOBILE PAYMENT - THANK YOU",
                                "amount": "-228.80",
                            },
                            {
                                "date": "2023-04-29",
                                "retailer": "SEA AIRPORT PARKING SEATTLE WA",
                                "amount": "24.00",
                            },
                            {
                                "date": "2023-04-28",
                                "retailer": "METROPOLITAN MKT 162SAMMAMISH WA",
                                "amount": "79.85",
                            },
                        ]
                    },
                )
            ],
        ),
        400: OpenApiResponse(description="입력값 오류 (raw_text 누락)"),
        500: OpenApiResponse(description="파싱 실패 또는 서버 오류"),
    },
    summary="Raw 텍스트에서 거래 내역 파싱",
    description="주어진 raw 텍스트에서 날짜, 판매처, 금액을 추출하여 JSON 배열로 반환합니다.",
)
class TransactionParseRawView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionParseRawSerializer

    def post(self, request):
        raw_text = request.data.get("raw_text")
        if not raw_text:
            return Response({"error": "raw_text is required"}, status=400)

        prompt = f"""
아래의 거래 내역에서 각 거래별로 날짜(date), 판매처(retailer), 금액(amount)을 추출해서 JSON 배열로 만들어줘.\n금액은 부호까지 정확히 다만 통화 기호는 제거해줘줘, 날짜는 YYYY-MM-DD로 변환해줘.\n\n거래 내역:\n{raw_text}
"""
        client = openai.OpenAI()  # 환경변수 OPENAI_API_KEY 사용
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "너는 똑똑한 금융 데이터 파서야."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=1000,
            temperature=0,
        )
        content = response.choices[0].message.content
        match = re.search(r"\[.*\]", content, re.DOTALL)
        if not match:
            return Response({"error": "파싱 실패"}, status=500)
        try:
            transactions = json.loads(match.group(0))
        except Exception:
            return Response({"error": "JSON 파싱 실패"}, status=500)
        return Response({"transactions": transactions}, status=200)
