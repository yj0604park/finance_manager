from rest_framework import serializers

from finance_backend.money.models.exchanges import Exchange


class ExchangeSerializer(serializers.ModelSerializer[Exchange]):
    class Meta:
        model = Exchange
        fields = "__all__"
