from collections import defaultdict
from decimal import Decimal

from django.db import models
from django_choices_field import TextChoicesField

from finance_backend.money.choices import AccountType, Country, CurrencyType
from finance_backend.money.models.base import (
    BaseAmountModel,
    BaseCurrencyModel,
    BaseTimeStampModel,
    BaseUserModel,
)
from finance_backend.money.models.items import Item


class Bank(BaseUserModel, BaseAmountModel):
    """
    Model for a bank.
    """

    name = models.CharField(max_length=200)
    country = TextChoicesField(
        max_length=20, choices_enum=Country, default=Country.KOREA
    )

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Account(BaseUserModel, BaseAmountModel, BaseCurrencyModel):
    """
    Model for a bank account.
    """

    bank = models.ForeignKey(Bank, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, db_collation="C")
    nickname = models.CharField(max_length=100, blank=True, null=True)
    account_type = TextChoicesField(
        max_length=20, choices_enum=AccountType, default=AccountType.CHECKING_ACCOUNT
    )

    last_update = models.DateTimeField(null=True, blank=True)
    last_transaction = models.DateField(null=True, blank=True)
    first_transaction = models.DateField(null=True, blank=True)
    first_added = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    def account_type(self):
        return self.type


class AccountSnapshot(BaseUserModel, BaseTimeStampModel):
    account = models.ForeignKey(
        Account, on_delete=models.CASCADE, null=True, blank=True
    )
    bank = models.ForeignKey(Bank, on_delete=models.CASCADE, null=True, blank=True)
    item = models.ForeignKey(Item, on_delete=models.CASCADE, null=True, blank=True)
    currency = TextChoicesField(
        max_length=3,
        choices_enum=CurrencyType,
        default=CurrencyType.USD,
        null=True,
        blank=True,
    )

    def __str__(self) -> str:
        return f"{self.date}: {self.currency}"
