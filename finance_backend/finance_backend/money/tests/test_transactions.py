from datetime import date
from decimal import Decimal

from django.test import TestCase
from django.utils import timezone

from finance_backend.money.choices import CurrencyType
from finance_backend.money.choices import TransactionCategory
from finance_backend.money.models.accounts import Account
from finance_backend.money.models.accounts import Bank
from finance_backend.money.models.items import Item
from finance_backend.money.models.shoppings import Retailer
from finance_backend.money.models.transactions import ItemTransaction
from finance_backend.money.models.transactions import Transaction
from finance_backend.users.tests.factories import UserFactory


class TransactionsTest(TestCase):
    def setUp(self):
        self.user = UserFactory()
        self.bank = Bank.objects.create(
            user=self.user,
            name="Test Bank",
            country="KOREA",
            amount=Decimal("0.00"),
        )
        self.account = Account.objects.create(
            user=self.user,
            bank=self.bank,
            name="Test Account",
            currency=CurrencyType.USD,
            amount=Decimal("0.00"),
        )
        self.retailer = Retailer.objects.create(user=self.user, name="Test Store")
        self.item = Item.objects.create(
            user=self.user,
            name="Test Item",
            code="TEST001",
            currency=CurrencyType.USD,
        )
        self.transaction = Transaction.objects.create(
            user=self.user,
            account=self.account,
            retailer=self.retailer,
            date=date(2024, 1, 1),
            time=timezone.now().time(),
            amount=Decimal("100.00"),
            balance=Decimal("1000.00"),
            note="Test note",
            transaction_type=TransactionCategory.GROCERY,
        )
        self.item_transaction = ItemTransaction.objects.create(
            user=self.user,
            item=self.item,
            transaction=self.transaction,
            date=date(2024, 1, 1),
            time=timezone.now().time(),
            purchase_price=Decimal("10.00"),
            quantity=Decimal("10.00"),
            tax=Decimal("10.00"),
            fee=Decimal("5.00"),
            subsidy=Decimal("0.00"),
            note="Test item note",
        )

    def test_transaction_model(self):
        assert self.transaction.user == self.user
        assert self.transaction.account == self.account
        assert self.transaction.retailer == self.retailer
        assert self.transaction.amount == Decimal("100.00")
        assert self.transaction.balance == Decimal("1000.00")
        assert self.transaction.note == "Test note"
        assert self.transaction.transaction_type == TransactionCategory.GROCERY
        assert self.transaction.linked_transaction is None
        assert not self.transaction.is_reviewed
        assert self.transaction.date.strftime("%Y-%m-%d") == "2024-01-01"

    def test_transaction_str(self):
        expected = (
            f"{self.transaction.date.strftime('%Y-%m-%d')} - "
            f"{self.transaction.account.name}: {self.transaction.retailer.name}"
        )
        assert str(self.transaction) == expected

    def test_transaction_without_retailer(self):
        transaction = Transaction.objects.create(
            user=self.user,
            account=self.account,
            date=date(2024, 1, 1),
            time=timezone.now().time(),
            amount=Decimal("100.00"),
        )
        expected = (
            f"{transaction.date.strftime('%Y-%m-%d')} - "
            f"{transaction.account.name}: None"
        )
        assert str(transaction) == expected

    def test_transaction_linked_transaction(self):
        linked_transaction = Transaction.objects.create(
            user=self.user,
            account=self.account,
            date=date(2024, 1, 1),
            time=timezone.now().time(),
            amount=Decimal("100.00"),
        )
        self.transaction.linked_transaction = linked_transaction
        self.transaction.save()
        assert self.transaction.linked_transaction == linked_transaction

    def test_item_transaction_model(self):
        assert self.item_transaction.user == self.user
        assert self.item_transaction.item == self.item
        assert self.item_transaction.transaction == self.transaction
        assert self.item_transaction.purchase_price == Decimal("10.00")
        assert self.item_transaction.quantity == Decimal("10.00")
        assert self.item_transaction.tax == Decimal("10.00")
        assert self.item_transaction.fee == Decimal("5.00")
        assert self.item_transaction.subsidy == Decimal("0.00")
        assert self.item_transaction.note == "Test item note"
        assert self.item_transaction.date.strftime("%Y-%m-%d") == "2024-01-01"

    def test_item_transaction_str(self):
        expected = (
            f"{self.item_transaction.date.strftime('%Y-%m-%d')} - "
            f"{self.item_transaction.item.name} ({self.item_transaction.item.code}) - "
            f"{self.item_transaction.quantity} units @ "
            f"{self.item_transaction.purchase_price}"
        )
        assert str(self.item_transaction) == expected

    def test_item_transaction_without_transaction(self):
        item_transaction = ItemTransaction.objects.create(
            user=self.user,
            item=self.item,
            date=date(2024, 1, 1),
            time=timezone.now().time(),
            purchase_price=Decimal("10.00"),
            quantity=Decimal("10.00"),
        )
        assert item_transaction.transaction is None
        assert item_transaction.tax == Decimal("0.00")
        assert item_transaction.fee == Decimal("0.00")
        assert item_transaction.subsidy == Decimal("0.00")
        assert item_transaction.note == ""
