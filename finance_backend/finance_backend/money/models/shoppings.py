from django.db import models

from finance_backend.money.choices import RetailerType, TransactionCategory
from finance_backend.money.models.base import BaseUserModel


class Retailer(BaseUserModel):
    name = models.CharField(max_length=30)
    retailer_type = models.CharField(
        max_length=20,
        choices=RetailerType.choices,
        default=RetailerType.ETC,
    )
    category = models.CharField(
        max_length=30,
        choices=TransactionCategory.choices,
        default=TransactionCategory.UNKNOWN,
    )

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.retailer_type}: {self.name}"
