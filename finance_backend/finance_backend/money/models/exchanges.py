from django.db import models

from finance_backend.money.choices import CurrencyType
from finance_backend.money.choices import ExchangeType
from finance_backend.money.models.base import BaseTimeStampModel
from finance_backend.money.models.base import BaseUserModel
from finance_backend.money.models.transactions import Transaction


class Exchange(BaseUserModel, BaseTimeStampModel):
    transaction_from = models.ForeignKey(
        Transaction,
        related_name="exchange_from",
        on_delete=models.CASCADE,
    )
    transaction_to = models.ForeignKey(
        Transaction,
        related_name="exchange_to",
        on_delete=models.CASCADE,
    )
    amount_from = models.DecimalField(max_digits=15, decimal_places=2)
    amount_to = models.DecimalField(max_digits=15, decimal_places=2)
    currency_from = models.CharField(
        max_length=3,
        choices=CurrencyType.choices,
        default=CurrencyType.USD,
    )
    currency_to = models.CharField(
        max_length=3,
        choices=CurrencyType.choices,
        default=CurrencyType.USD,
    )
    exchange_ratio = models.DecimalField(
        max_digits=10,
        decimal_places=4,
        null=True,
        blank=True,
    )
    exchange_broker = models.CharField(
        max_length=10,
        choices=ExchangeType.choices,
        default=ExchangeType.ETC,
    )

    def __str__(self) -> str:
        return f"{self.date}: {self.exchange_ratio}"
