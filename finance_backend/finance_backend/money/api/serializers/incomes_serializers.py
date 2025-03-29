from rest_framework import serializers

from finance_backend.money.models.incomes import Salary


class SalarySerializer(serializers.ModelSerializer[Salary]):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Salary
        fields = "__all__"
