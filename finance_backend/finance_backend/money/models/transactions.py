from django.db import models

from finance_backend.money.choices import TransactionCategory
from finance_backend.money.models.accounts import Account
from finance_backend.money.models.base import (
    BaseAmountModel,
    BaseTimeStampModel,
    BaseUserModel,
)
from finance_backend.money.models.items import Item
from finance_backend.money.models.shoppings import Retailer


class Transaction(BaseUserModel, BaseTimeStampModel, BaseAmountModel):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    retailer = models.ForeignKey(
        Retailer,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    balance = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0,
    )
    note = models.TextField(default="")

    transaction_type = models.CharField(
        max_length=30,
        choices=TransactionCategory.choices,
        default=TransactionCategory.UNKNOWN,
    )
    linked_transaction = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    is_reviewed = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    def __str__(self):
        return (
            f"{self.date.strftime('%Y-%m-%d')} - {self.account.name}: "
            f"{self.retailer.name if self.retailer else None}"
        )


class ItemTransaction(BaseUserModel, BaseTimeStampModel):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    transaction = models.ForeignKey(
        Transaction,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    purchase_price = models.DecimalField(max_digits=15, decimal_places=2)
    quantity = models.DecimalField(max_digits=15, decimal_places=4)
    tax = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0,
        null=True,
        blank=True,
    )
    fee = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0,
        null=True,
        blank=True,
    )
    subsidy = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0,
        null=True,
        blank=True,
    )

    note = models.TextField(default="")

    def __str__(self):
        return (
            f"{self.date.strftime('%Y-%m-%d')} - "
            f"{self.item.name} ({self.item.code}) - "
            f"{self.quantity} units @ {self.purchase_price}"
        )
