from rest_framework import serializers

# This is a test comment to check pre-commit formatting
from finance_backend.money.models.accounts import Account, AccountSnapshot, Bank


class BankSerializer(serializers.ModelSerializer[Bank]):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    amount = serializers.DecimalField(max_digits=15, decimal_places=2, default=0)

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        validated_data["amount"] = 0
        return super().create(validated_data)

    class Meta:
        model = Bank
        fields = "__all__"


class AccountSerializer(serializers.ModelSerializer[Account]):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    nickname = serializers.CharField(
        max_length=100, default="", allow_blank=True, allow_null=True
    )

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        validated_data["amount"] = 0
        if validated_data.get("nickname") is None:
            validated_data["nickname"] = ""
        validated_data["first_added"] = False
        validated_data["is_active"] = True
        return super().create(validated_data)

    class Meta:
        model = Account
        fields = "__all__"
        read_only_fields = [
            "amount",
            "first_added",
            "last_update",
            "last_transaction",
            "first_transaction",
        ]
        extra_kwargs = {
            "bank": {"required": True},
            "account_type": {"required": True},
        }


class AccountDetailSerializer(serializers.ModelSerializer[Account]):
    class Meta:
        model = Account
        fields = "__all__"
        depth = 1


class AccountSnapshotSerializer(serializers.ModelSerializer[AccountSnapshot]):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = AccountSnapshot
        fields = "__all__"
