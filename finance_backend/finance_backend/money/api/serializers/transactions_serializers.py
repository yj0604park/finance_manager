from rest_framework import serializers

from finance_backend.money.models.transactions import ItemTransaction, Transaction


class TransactionSerializer(serializers.ModelSerializer[Transaction]):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Transaction
        fields = "__all__"


class ItemTransactionSerializer(serializers.ModelSerializer[ItemTransaction]):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = ItemTransaction
        fields = "__all__"
