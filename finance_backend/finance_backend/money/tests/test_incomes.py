from datetime import date
from decimal import Decimal

from django.test import TestCase
from django.utils import timezone

from finance_backend.money.models.accounts import Account
from finance_backend.money.models.accounts import Bank
from finance_backend.money.models.incomes import Salary
from finance_backend.money.models.shoppings import Retailer
from finance_backend.money.models.transactions import Transaction
from finance_backend.users.tests.factories import UserFactory


class IncomesTest(TestCase):
    def setUp(self):
        self.user = UserFactory()
        self.bank = Bank.objects.create(
            user=self.user,
            name="Test Bank",
            amount=Decimal("0.00"),
        )
        self.account = Account.objects.create(
            user=self.user,
            bank=self.bank,
            name="Test Account",
            amount=Decimal("0.00"),
        )
        self.retailer = Retailer.objects.create(user=self.user, name="Test Retailer")
        self.transaction = Transaction.objects.create(
            user=self.user,
            account=self.account,
            retailer=self.retailer,
            amount=Decimal("810.00"),
            date=date(2024, 1, 1),
        )
        self.salary = Salary.objects.create(
            user=self.user,
            transaction=self.transaction,
            date=date(2024, 1, 1),
            time=timezone.now().time(),
            gross_pay=Decimal("1000.00"),
            tax_withheld=Decimal("-100.00"),
            deduction=Decimal("-100.00"),
            adjustment=Decimal("10.00"),
            net_pay=Decimal("810.00"),
            gross_pay_detail={"test": "test"},
            adjustment_detail={"test": "test"},
            tax_withheld_detail={"test": "test"},
            deduction_detail={"test": "test"},
        )

    def test_salary_model(self):
        assert self.salary.user == self.user
        assert self.salary.transaction == self.transaction
        assert self.salary.date.strftime("%Y-%m-%d") == "2024-01-01"
        assert self.salary.gross_pay == Decimal("1000.00")
        assert self.salary.tax_withheld == Decimal("-100.00")
        assert self.salary.deduction == Decimal("-100.00")
        assert self.salary.adjustment == Decimal("10.00")
        assert self.salary.net_pay == Decimal("810.00")

    def test_salary_str(self):
        expected = f"{self.salary.date.strftime('%Y-%m-%d')}"
        assert str(self.salary) == expected

    def test_salary_calculation(self):
        assert self.salary.net_pay == Decimal("810.00")
        assert self.salary.gross_pay == Decimal("1000.00")
        assert self.salary.transaction.amount == Decimal("810.00")
