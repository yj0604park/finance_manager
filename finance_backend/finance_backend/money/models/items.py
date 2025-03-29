from django.db import models

from finance_backend.money.choices import ItemType
from finance_backend.money.models.base import (
    BaseCurrencyModel,
    BaseTimeStampModel,
    BaseUserModel,
)


class Item(BaseUserModel):
    name = models.CharField(max_length=20)
    code = models.CharField(max_length=20, default="")
    item_type = models.CharField(
        max_length=20,
        choices=ItemType.choices,
        default=ItemType.ITEM,
    )

    class Meta:
        ordering = ["code"]

    def __str__(self):
        return f"{self.name}: {self.code}" if self.code else self.name


class ItemPrice(BaseUserModel, BaseTimeStampModel, BaseCurrencyModel):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=15, decimal_places=2)
    source = models.CharField(max_length=20, default="")
    note = models.TextField(default="")

    def __str__(self):
        return f"{self.item.name}: {self.date.strftime('%Y-%m-%d')} - {self.price}"
