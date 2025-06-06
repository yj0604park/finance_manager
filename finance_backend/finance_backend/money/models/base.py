from django.db import models

from finance_backend.money.choices import CurrencyType


class BaseUserModel(models.Model):
    user = models.ForeignKey("users.User", on_delete=models.CASCADE)

    class Meta:
        abstract = True


class BaseTimeStampModel(models.Model):
    date = models.DateField()
    time = models.TimeField(default="12:00:00")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class BaseAmountModel(models.Model):
    amount = models.DecimalField(max_digits=15, decimal_places=2)

    class Meta:
        abstract = True


class BaseCurrencyModel(models.Model):
    currency = models.CharField(
        max_length=3,
        choices=CurrencyType.choices,
        default=CurrencyType.USD,
    )

    class Meta:
        abstract = True
