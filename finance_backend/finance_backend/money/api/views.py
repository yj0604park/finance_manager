from rest_framework.viewsets import ModelViewSet

from finance_backend.money.api.serializers.accounts_serializers import AccountSerializer
from finance_backend.money.api.serializers.accounts_serializers import (
    AccountSnapshotSerializer,
)
from finance_backend.money.api.serializers.accounts_serializers import BankSerializer
from finance_backend.money.api.serializers.exchanges_serializers import (
    ExchangeSerializer,
)
from finance_backend.money.api.serializers.incomes_serializers import SalarySerializer
from finance_backend.money.api.serializers.items_serializers import ItemPriceSerializer
from finance_backend.money.api.serializers.items_serializers import ItemSerializer
from finance_backend.money.api.serializers.shopping_serializers import (
    RetailerSerializer,
)
from finance_backend.money.api.serializers.transactions_serializers import (
    ItemTransactionSerializer,
)
from finance_backend.money.api.serializers.transactions_serializers import (
    TransactionSerializer,
)
from finance_backend.money.models.accounts import Account
from finance_backend.money.models.accounts import AccountSnapshot
from finance_backend.money.models.accounts import Bank
from finance_backend.money.models.exchanges import Exchange
from finance_backend.money.models.incomes import Salary
from finance_backend.money.models.items import Item
from finance_backend.money.models.items import ItemPrice
from finance_backend.money.models.shoppings import Retailer
from finance_backend.money.models.transactions import ItemTransaction
from finance_backend.money.models.transactions import Transaction


class BankViewSet(ModelViewSet):
    queryset = Bank.objects.all()
    serializer_class = BankSerializer


class AccountViewSet(ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer


class AccountSnapshotViewSet(ModelViewSet):
    queryset = AccountSnapshot.objects.all()
    serializer_class = AccountSnapshotSerializer


class TransactionViewSet(ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer


class ItemTransactionViewSet(ModelViewSet):
    queryset = ItemTransaction.objects.all()
    serializer_class = ItemTransactionSerializer


class ExchangeViewSet(ModelViewSet):
    queryset = Exchange.objects.all()
    serializer_class = ExchangeSerializer


class SalaryViewSet(ModelViewSet):
    queryset = Salary.objects.all()
    serializer_class = SalarySerializer


class ItemViewSet(ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class RetailerViewSet(ModelViewSet):
    queryset = Retailer.objects.all()
    serializer_class = RetailerSerializer


class ItemPriceViewSet(ModelViewSet):
    queryset = ItemPrice.objects.all()
    serializer_class = ItemPriceSerializer
