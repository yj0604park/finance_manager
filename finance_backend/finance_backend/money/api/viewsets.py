from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters, serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema, OpenApiParameter

from finance_backend.money.api.serializers.accounts_serializers import (
    AccountSerializer,
    AccountSnapshotSerializer,
    BankSerializer,
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


class TransactionWithBalanceSerializer(TransactionSerializer):
    balance = serializers.DecimalField(max_digits=15, decimal_places=2, read_only=True)


class TransactionViewSet(BaseUserViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    filterset_class = TransactionFilter
    ordering_fields = ["date", "amount", "created_at", "balance"]
    ordering = ["-date", "-id"]
    pagination_class = TransactionPagination

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
            if tx.balance != balance:
                tx.balance = balance
                tx.save(update_fields=["balance"])
            # Create a temporary dict or object to hold data including balance
            tx_data = {**TransactionSerializer(tx).data, "balance": str(balance)}
            result.append(tx_data)
        if account.amount != balance:
            account.amount = balance
            account.save(update_fields=["amount"])
        # Return the result list directly as it already has the correct structure
        return Response(result, status=status.HTTP_200_OK)


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
