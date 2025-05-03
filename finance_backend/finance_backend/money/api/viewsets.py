from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated

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
