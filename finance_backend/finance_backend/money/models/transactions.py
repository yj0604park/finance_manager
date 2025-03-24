from django.db import models
from django.urls import reverse
from django_choices_field import TextChoicesField

from finance_backend.money.choices import TransactionCategory
from finance_backend.money.models.accounts import Account
from finance_backend.money.models.base import (
    BaseAmountModel,
    BaseTimeStampModel,
    BaseURLModel,
    BaseUserModel,
)
from finance_backend.money.models.shoppings import Retailer
from finance_backend.money.models.items import Item


class Transaction(BaseUserModel, BaseTimeStampModel, BaseAmountModel, BaseURLModel):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    retailer = models.ForeignKey(
        Retailer, on_delete=models.SET_NULL, blank=True, null=True
    )
    balance = models.DecimalField(
        max_digits=15, decimal_places=2, null=True, blank=True
    )
    note = models.TextField(null=True, blank=True)

    transaction_type = TextChoicesField(
        max_length=30,
        choices_enum=TransactionCategory,
        default=TransactionCategory.UNKNOWN,
    )
    linked_transaction = models.ForeignKey(
        "self", on_delete=models.SET_NULL, blank=True, null=True
    )
    is_reviewed = models.BooleanField(default=False)

    def get_absolute_url(self):
        return reverse("money:transaction_detail", kwargs={"pk": self.pk})

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    def __str__(self):
        return (
            f'{self.pk} {self.date.strftime("%Y-%m-%d")} '
            + f"{self.account.name}: "
            + f"{self.retailer.name if self.retailer else None}"
        )


class ItemTransaction(BaseUserModel, BaseTimeStampModel, BaseAmountModel, BaseURLModel):
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    transaction = models.ForeignKey(
        Transaction, on_delete=models.CASCADE, null=True, blank=True
    )
    purchase_price = models.DecimalField(max_digits=15, decimal_places=2)
    quantity = models.DecimalField(max_digits=15, decimal_places=4)
    tax = models.DecimalField(
        max_digits=15, decimal_places=2, default=0, null=True, blank=True
    )
    fee = models.DecimalField(
        max_digits=15, decimal_places=2, default=0, null=True, blank=True
    )
    subsidy = models.DecimalField(
        max_digits=15, decimal_places=2, default=0, null=True, blank=True
    )

    note = models.TextField(null=True, blank=True, default="")

    def __str__(self):
        return f"{self.date.strftime('%Y-%m-%d')}, Stock {self.stock}, share {self.shares}, price {self.price}"
