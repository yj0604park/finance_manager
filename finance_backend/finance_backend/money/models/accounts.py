from django.db import models

from finance_backend.money.choices import AccountType, Country
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
    country = models.CharField(
        max_length=20,
        choices=Country.choices,
        default=Country.KOREA,
    )

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.country})"


class Account(BaseUserModel, BaseAmountModel, BaseCurrencyModel):
    """
    Model for a bank account.
    """

    bank = models.ForeignKey(Bank, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, db_collation="C")
    nickname = models.CharField(max_length=100, blank=True, default="")
    account_type = models.CharField(
        max_length=20,
        choices=AccountType.choices,
        default=AccountType.CHECKING_ACCOUNT,
    )

    last_update = models.DateTimeField(null=True, blank=True)
    last_transaction = models.DateField(null=True, blank=True)
    first_transaction = models.DateField(null=True, blank=True)
    first_added = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.bank.name})"


class AccountSnapshot(BaseUserModel, BaseTimeStampModel, BaseAmountModel):
    account = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    bank = models.ForeignKey(Bank, on_delete=models.CASCADE, null=True, blank=True)
    item = models.ForeignKey(Item, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return (
            f"{self.date.strftime('%Y-%m-%d')} - "
            f"{self.account.name} ({self.account.bank.name})"
        )
