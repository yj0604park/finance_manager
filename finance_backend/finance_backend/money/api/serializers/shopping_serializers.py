from rest_framework import serializers

from finance_backend.money.models.shoppings import Retailer


class RetailerSerializer(serializers.ModelSerializer[Retailer]):
    class Meta:
        model = Retailer
        fields = "__all__"
