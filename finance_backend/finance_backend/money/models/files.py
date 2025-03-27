from django.db import models

from finance_backend.money.models.accounts import Account
from finance_backend.money.models.base import BaseTimeStampModel, BaseUserModel


class TransactionFile(BaseUserModel, BaseTimeStampModel):
    file = models.FileField(upload_to="transaction_files/")
    account = models.ForeignKey(
        Account,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    note = models.TextField(null=True, blank=True)
    is_processed = models.BooleanField(default=False)
    date_processed = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.date}: {self.file.name}"
