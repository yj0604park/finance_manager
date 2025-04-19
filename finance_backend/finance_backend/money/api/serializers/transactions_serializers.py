from rest_framework import serializers

from finance_backend.money.models.transactions import ItemTransaction, Transaction


class TransactionSerializer(serializers.ModelSerializer[Transaction]):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    note = serializers.CharField(required=False, allow_blank=True, default="")
    transaction_type_display = serializers.CharField(
        source="get_transaction_type_display", read_only=True
    )

    class Meta:
        model = Transaction
        fields = "__all__"


class ItemTransactionSerializer(serializers.ModelSerializer[ItemTransaction]):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    note = serializers.CharField(required=False, allow_blank=True, default="")

    class Meta:
        model = ItemTransaction
        fields = "__all__"
