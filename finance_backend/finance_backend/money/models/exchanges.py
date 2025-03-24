from django.db import models
from django_choices_field import TextChoicesField

from finance_backend.money.choices import CurrencyType, ExchangeType
from finance_backend.money.models.base import BaseTimeStampModel, BaseUserModel
from finance_backend.money.models.transactions import Transaction


class Exchange(BaseUserModel, BaseTimeStampModel):
    transaction_from = models.ForeignKey(
        Transaction, related_name="exchange_from", on_delete=models.CASCADE
    )
    transaction_to = models.ForeignKey(
        Transaction, related_name="exchange_to", on_delete=models.CASCADE
    )
    amount_from = models.DecimalField(max_digits=15, decimal_places=2)
    amount_to = models.DecimalField(max_digits=15, decimal_places=2)
    currency_from = TextChoicesField(max_length=3, choices_enum=CurrencyType)
    currency_to = TextChoicesField(max_length=3, choices_enum=CurrencyType)
    exchange_ratio = models.DecimalField(
        max_digits=10, decimal_places=4, null=True, blank=True
    )
    exchange_brokder = TextChoicesField(
        max_length=10, choices_enum=ExchangeType, default=ExchangeType.ETC
    )

    def __str__(self) -> str:
        return f"{self.date}: {self.ratio_per_krw}"
