from rest_framework import serializers

from finance_backend.money.models.shoppings import Retailer


class RetailerSerializer(serializers.ModelSerializer[Retailer]):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Retailer
        fields = "__all__"
