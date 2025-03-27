from rest_framework import viewsets
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
from finance_backend.money.models.accounts import Account, AccountSnapshot, Bank
from finance_backend.money.models.exchanges import Exchange
from finance_backend.money.models.incomes import Salary
from finance_backend.money.models.items import Item, ItemPrice
from finance_backend.money.models.shoppings import Retailer
from finance_backend.money.models.transactions import ItemTransaction, Transaction


class BaseUserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """기본적으로 사용자의 데이터만 필터링하여 반환"""
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        """사용자가 생성하는 객체에 user를 자동으로 할당"""
        serializer.save(user=self.request.user)


class BankViewSet(BaseUserViewSet):
    queryset = Bank.objects.all()
    serializer_class = BankSerializer


class AccountViewSet(BaseUserViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer


class AccountSnapshotViewSet(BaseUserViewSet):
    queryset = AccountSnapshot.objects.all()
    serializer_class = AccountSnapshotSerializer


class TransactionViewSet(BaseUserViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer


class ItemTransactionViewSet(BaseUserViewSet):
    queryset = ItemTransaction.objects.all()
    serializer_class = ItemTransactionSerializer


class ExchangeViewSet(BaseUserViewSet):
    queryset = Exchange.objects.all()
    serializer_class = ExchangeSerializer


class SalaryViewSet(BaseUserViewSet):
    queryset = Salary.objects.all()
    serializer_class = SalarySerializer


class ItemViewSet(BaseUserViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class RetailerViewSet(BaseUserViewSet):
    queryset = Retailer.objects.all()
    serializer_class = RetailerSerializer


class ItemPriceViewSet(BaseUserViewSet):
    queryset = ItemPrice.objects.all()
    serializer_class = ItemPriceSerializer
