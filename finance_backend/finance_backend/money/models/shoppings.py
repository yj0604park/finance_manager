from django.db import models
from django_choices_field import TextChoicesField

from finance_backend.money.choices import RetailerType
from finance_backend.money.choices import TransactionCategory
from finance_backend.money.models.base import BaseUserModel


class Retailer(BaseUserModel):
    name = models.CharField(max_length=30)
    retailer_type = TextChoicesField(
        max_length=20,
        choices_enum=RetailerType,
        default=RetailerType.ETC,
    )
    category = TextChoicesField(
        max_length=30,
        choices_enum=TransactionCategory,
        default=TransactionCategory.UNKNOWN,
    )

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.retailer_type}: {self.name}"
