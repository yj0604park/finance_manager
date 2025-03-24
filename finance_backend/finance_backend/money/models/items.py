from django.db import models
from django_choices_field import TextChoicesField

from finance_backend.money.choices import ItemType
from finance_backend.money.models.base import BaseCurrencyModel
from finance_backend.money.models.base import BaseTimeStampModel
from finance_backend.money.models.base import BaseURLModel
from finance_backend.money.models.base import BaseUserModel


class Item(BaseUserModel, BaseURLModel, BaseCurrencyModel):
    name = models.CharField(max_length=20)
    code = models.CharField(max_length=20, default="")
    item_type = TextChoicesField(
        max_length=20,
        choices_enum=ItemType,
        default=ItemType.ITEM,
    )

    class Meta:
        ordering = ["code"]

    def __str__(self):
        return f"{self.name}: {self.code}" if self.code else self.name


class ItemPrice(BaseUserModel, BaseTimeStampModel, BaseCurrencyModel):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=15, decimal_places=2)
