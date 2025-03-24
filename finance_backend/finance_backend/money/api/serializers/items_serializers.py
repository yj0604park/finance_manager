from rest_framework import serializers

from finance_backend.money.models.items import Item


class ItemSerializer(serializers.ModelSerializer[Item]):
    class Meta:
        model = Item
        fields = "__all__"
