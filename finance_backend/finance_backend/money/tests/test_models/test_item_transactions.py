from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone

from finance_backend.money.choices import TransactionCategory
from finance_backend.money.models.accounts import Account
from finance_backend.money.models.accounts import Bank
from finance_backend.money.models.items import Item
from finance_backend.money.models.shoppings import Retailer
from finance_backend.money.models.transactions import ItemTransaction
from finance_backend.money.models.transactions import Transaction

User = get_user_model()

# 테스트용 상수
TEST_PASSWORD = "testpass123"  # noqa: S105


class ItemTransactionModelTest(TestCase):
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
        self.transaction = Transaction.objects.create(
            user=self.user,
            account=self.account,
            retailer=self.retailer,
            amount=Decimal("100.00"),
            balance=Decimal("900.00"),
            transaction_type=TransactionCategory.ETC_EXPENSE,
            date=timezone.now(),
        )
        self.item = Item.objects.create(user=self.user, name="Test Item", code="1234")

    def test_create_item_transaction(self):
        item_transaction = ItemTransaction.objects.create(
            user=self.user,
            item=self.item,
            transaction=self.transaction,
            amount=Decimal("100.00"),
            purchase_price=Decimal("50.00"),
            quantity=Decimal("2.0000"),
            tax=Decimal("10.00"),
            fee=Decimal("5.00"),
            subsidy=Decimal("0.00"),
            date=timezone.now(),
        )

        assert item_transaction.user == self.user
        assert item_transaction.item == self.item
        assert item_transaction.transaction == self.transaction
        assert item_transaction.amount == Decimal("100.00")
        assert item_transaction.purchase_price == Decimal("50.00")
        assert item_transaction.quantity == Decimal("2.0000")
        assert item_transaction.tax == Decimal("10.00")
        assert item_transaction.fee == Decimal("5.00")
        assert item_transaction.subsidy == Decimal("0.00")

    def test_item_transaction_without_transaction(self):
        item_transaction = ItemTransaction.objects.create(
            user=self.user,
            item=self.item,
            amount=Decimal("100.00"),
            purchase_price=Decimal("50.00"),
            quantity=Decimal("2.0000"),
            date=timezone.now(),
        )

        assert item_transaction.transaction is None
        assert item_transaction.tax == Decimal("0")
        assert item_transaction.fee == Decimal("0")
        assert item_transaction.subsidy == Decimal("0")
