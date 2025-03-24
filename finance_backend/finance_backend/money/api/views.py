from rest_framework.viewsets import ModelViewSet

from finance_backend.money.api.serializers.accounts_serializers import AccountSerializer
from finance_backend.money.api.serializers.accounts_serializers import (
    AccountSnapshotSerializer,
)
from finance_backend.money.api.serializers.accounts_serializers import BankSerializer
from finance_backend.money.api.serializers.transactions_serializers import (
    ItemTransactionSerializer,
)
from finance_backend.money.api.serializers.transactions_serializers import (
    TransactionSerializer,
)
from finance_backend.money.models.accounts import Account
from finance_backend.money.models.accounts import AccountSnapshot
from finance_backend.money.models.accounts import Bank
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
