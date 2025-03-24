from rest_framework import serializers

# This is a test comment to check pre-commit formatting
from finance_backend.money.models.accounts import Account
from finance_backend.money.models.accounts import AccountSnapshot
from finance_backend.money.models.accounts import Bank


class BankSerializer(serializers.ModelSerializer[Bank]):
    class Meta:
        model = Bank
        fields = "__all__"


class AccountSerializer(serializers.ModelSerializer[Account]):
    class Meta:
        model = Account
        fields = "__all__"


class AccountDetailSerializer(serializers.ModelSerializer[Account]):
    class Meta:
        model = Account
        fields = "__all__"
        depth = 1


class AccountCreateSerializer(serializers.ModelSerializer[Account]):
    class Meta:
        model = Account
        fields = "__all__"


class AccountSnapshotSerializer(serializers.ModelSerializer[AccountSnapshot]):
    class Meta:
        model = AccountSnapshot
        fields = "__all__"
