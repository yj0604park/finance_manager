from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone

from finance_backend.money.choices import TransactionCategory
from finance_backend.money.models.accounts import Account
from finance_backend.money.models.accounts import Bank
from finance_backend.money.models.shoppings import Retailer
from finance_backend.money.models.transactions import Transaction

User = get_user_model()

# 테스트용 상수
TEST_PASSWORD = "testpass123"  # noqa: S105


class TransactionModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@example.com",
            password=TEST_PASSWORD,
        )
        self.bank = Bank.objects.create(
            user=self.user,
            name="Test Bank",
            amount=Decimal("1000.00"),
        )
        self.account = Account.objects.create(
            user=self.user,
            bank=self.bank,
            name="Test Account",
            amount=Decimal("1000.00"),
        )
        self.retailer = Retailer.objects.create(user=self.user, name="Test Retailer")

    def test_create_transaction(self):
        transaction = Transaction.objects.create(
            user=self.user,
            account=self.account,
            retailer=self.retailer,
            amount=Decimal("100.00"),
            balance=Decimal("900.00"),
            transaction_type=TransactionCategory.ETC_EXPENSE,
            date=timezone.now(),
        )

        assert transaction.user == self.user
        assert transaction.account == self.account
        assert transaction.retailer == self.retailer
        assert transaction.amount == Decimal("100.00")
        assert transaction.balance == Decimal("900.00")
        assert transaction.transaction_type == TransactionCategory.ETC_EXPENSE
        assert not transaction.is_reviewed

    def test_transaction_str_representation(self):
        transaction = Transaction.objects.create(
            user=self.user,
            account=self.account,
            retailer=self.retailer,
            amount=Decimal("100.00"),
            balance=Decimal("900.00"),
            transaction_type=TransactionCategory.ETC_EXPENSE,
            date=timezone.now(),
        )

        expected_str = (
            f"{transaction.date.strftime('%Y-%m-%d')} - "
            f"{self.account.name}: {self.retailer.name}"
        )
        assert str(transaction) == expected_str

    def test_transaction_without_retailer(self):
        transaction = Transaction.objects.create(
            user=self.user,
            account=self.account,
            amount=Decimal("100.00"),
            balance=Decimal("900.00"),
            transaction_type=TransactionCategory.ETC_EXPENSE,
            date=timezone.now(),
        )

        assert transaction.retailer is None
        expected_str = (
            f"{transaction.date.strftime('%Y-%m-%d')} - {self.account.name}: None"
        )
        assert str(transaction) == expected_str
