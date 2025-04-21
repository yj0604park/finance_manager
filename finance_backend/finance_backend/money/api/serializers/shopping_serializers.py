from rest_framework import serializers

from finance_backend.money.models.shoppings import Retailer


class RetailerSerializer(serializers.ModelSerializer[Retailer]):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    retailer_type_display = serializers.CharField(
        source="get_retailer_type_display", read_only=True
    )

    class Meta:
        model = Retailer
        fields = "__all__"


class SimpleRetailerSerializer(serializers.ModelSerializer):
    """간단한 판매처 정보 Serializer (ID, 이름만 포함)"""

    class Meta:
        model = Retailer
        fields = ["id", "name"]
