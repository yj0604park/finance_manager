from rest_framework import serializers

from finance_backend.money.models.items import Item, ItemPrice


class ItemSerializer(serializers.ModelSerializer[Item]):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Item
        fields = "__all__"


class ItemPriceSerializer(serializers.ModelSerializer[ItemPrice]):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = ItemPrice
        fields = "__all__"
