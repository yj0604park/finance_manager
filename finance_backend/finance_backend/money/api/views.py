from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db import transaction as db_transaction
from datetime import timedelta

from finance_backend.money.api.serializers.accounts_serializers import (
    AccountSerializer,
    AccountSnapshotSerializer,
    BankSerializer,
)
from finance_backend.money.api.serializers.dashboard_serializers import (
    DashboardRecentTransactionSerializer,
)
from finance_backend.money.api.serializers.exchanges_serializers import (
    ExchangeSerializer,
)
from finance_backend.money.api.serializers.incomes_serializers import SalarySerializer
from finance_backend.money.api.serializers.items_serializers import (
    ItemPriceSerializer,
    ItemSerializer,
)
from finance_backend.money.api.serializers.shopping_serializers import (
    RetailerSerializer,
)
from finance_backend.money.api.serializers.transactions_serializers import (
    ItemTransactionSerializer,
    TransactionSerializer,
)
from finance_backend.money.filters import AccountFilter, ItemFilter, TransactionFilter
from finance_backend.money.pagination import TransactionPagination
from finance_backend.money.models.accounts import Account, AccountSnapshot, Bank
from finance_backend.money.models.exchanges import Exchange
from finance_backend.money.models.incomes import Salary
from finance_backend.money.models.items import Item, ItemPrice
from finance_backend.money.models.shoppings import Retailer
from finance_backend.money.models.transactions import ItemTransaction, Transaction


class BaseUserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]

    def get_queryset(self):
        """기본적으로 사용자의 데이터만 필터링하여 반환"""
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        """사용자가 생성하는 객체에 user를 자동으로 할당"""
        serializer.save(user=self.request.user)


class BankViewSet(BaseUserViewSet):
    queryset = Bank.objects.all()
    serializer_class = BankSerializer
    ordering_fields = ["name", "country", "created_at"]
    ordering = ["name"]


class AccountViewSet(BaseUserViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    filterset_class = AccountFilter
    ordering_fields = ["name", "balance", "created_at"]
    ordering = ["name"]


class AccountSnapshotViewSet(BaseUserViewSet):
    queryset = AccountSnapshot.objects.all()
    serializer_class = AccountSnapshotSerializer
    ordering_fields = ["date", "amount"]
    ordering = ["-date"]


class TransactionViewSet(BaseUserViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    filterset_class = TransactionFilter
    ordering_fields = ["date", "amount", "created_at", "balance"]
    ordering = ["-date", "-id"]
    pagination_class = TransactionPagination


class ItemTransactionViewSet(BaseUserViewSet):
    queryset = ItemTransaction.objects.all()
    serializer_class = ItemTransactionSerializer
    ordering_fields = ["date", "purchase_price", "quantity"]
    ordering = ["-date", "-id"]


class ExchangeViewSet(BaseUserViewSet):
    queryset = Exchange.objects.all()
    serializer_class = ExchangeSerializer
    ordering_fields = ["date", "amount", "rate"]
    ordering = ["-date"]


class SalaryViewSet(BaseUserViewSet):
    queryset = Salary.objects.all()
    serializer_class = SalarySerializer
    ordering_fields = ["date", "amount"]
    ordering = ["-date"]


class ItemViewSet(BaseUserViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    filterset_class = ItemFilter
    ordering_fields = ["name", "item_type", "created_at"]
    ordering = ["name"]


class RetailerViewSet(BaseUserViewSet):
    queryset = Retailer.objects.all()
    serializer_class = RetailerSerializer
    ordering_fields = ["name", "retailer_type"]
    ordering = ["name"]


class ItemPriceViewSet(BaseUserViewSet):
    queryset = ItemPrice.objects.all()
    serializer_class = ItemPriceSerializer
    ordering_fields = ["date", "price"]
    ordering = ["-date"]


# 계좌 이체 거래 연결을 위한 API View
class LinkTransferView(APIView):
    permission_classes = [IsAuthenticated]

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
