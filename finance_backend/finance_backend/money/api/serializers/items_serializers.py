from rest_framework import serializers

from finance_backend.money.models.items import Item
from finance_backend.money.models.items import ItemPrice


class ItemSerializer(serializers.ModelSerializer[Item]):
    class Meta:
        model = Item
        fields = "__all__"


class ItemPriceSerializer(serializers.ModelSerializer[ItemPrice]):
    class Meta:
        model = ItemPrice
        fields = "__all__"
