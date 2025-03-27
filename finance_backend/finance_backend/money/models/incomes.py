from django.db import models

from finance_backend.money.models.base import (
    BaseCurrencyModel,
    BaseTimeStampModel,
    BaseUserModel,
)
from finance_backend.money.models.transactions import Transaction


class Salary(BaseUserModel, BaseTimeStampModel, BaseCurrencyModel):
    gross_pay = models.DecimalField(max_digits=15, decimal_places=2)
    adjustment = models.DecimalField(max_digits=15, decimal_places=2)
    tax_withheld = models.DecimalField(max_digits=15, decimal_places=2)
    deduction = models.DecimalField(max_digits=15, decimal_places=2)
    net_pay = models.DecimalField(max_digits=15, decimal_places=2)

    gross_pay_detail = models.JSONField()
    adjustment_detail = models.JSONField()
    tax_withheld_detail = models.JSONField()
    deduction_detail = models.JSONField()

    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = "salaries"
        ordering = ["-date"]

    def __str__(self):
        return f"{self.date}"
