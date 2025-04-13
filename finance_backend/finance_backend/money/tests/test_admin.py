from datetime import date
from decimal import Decimal

from django.contrib.admin import AdminSite
from django.test import TestCase
from django.utils import timezone

from finance_backend.money.admin import (
    AccountAdmin,
    AccountSnapshotAdmin,
    BankAdmin,
    ExchangeAdmin,
    ItemAdmin,
    ItemPriceAdmin,
    ItemTransactionAdmin,
    RetailerAdmin,
    TransactionAdmin,
)
from finance_backend.money.choices import CurrencyType
from finance_backend.money.models.accounts import Account, AccountSnapshot, Bank
from finance_backend.money.models.exchanges import Exchange
from finance_backend.money.models.incomes import Salary
from finance_backend.money.models.items import Item, ItemPrice
from finance_backend.money.models.shoppings import Retailer
from finance_backend.money.models.transactions import ItemTransaction, Transaction
from finance_backend.users.tests.factories import UserFactory


class AdminTest(TestCase):
    def setUp(self):
        self.site = AdminSite()
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
        self.retailer = Retailer.objects.create(
            user=self.user,
            name="Test Retailer",
            retailer_type="store",
            category="food",
        )
        self.transaction = Transaction.objects.create(
            user=self.user,
            account=self.account,
            retailer=self.retailer,
            amount=100,
            date=date(2024, 1, 1),
        )
        self.item = Item.objects.create(
            user=self.user,
            name="Test Item",
            code="TEST001",
        )
        self.item_transaction = ItemTransaction.objects.create(
            user=self.user,
            item=self.item,
            transaction=self.transaction,
            purchase_price=Decimal("10.00"),
            quantity=Decimal("10.00"),
            date=date(2024, 1, 1),
        )
        self.item_price = ItemPrice.objects.create(
            user=self.user,
            item=self.item,
            price=Decimal("100.00"),
            date=date(2024, 1, 1),
        )
        self.salary = Salary.objects.create(
            user=self.user,
            transaction=self.transaction,
            gross_pay=Decimal("1000.00"),
            tax_withheld=Decimal("-100.00"),
            deduction=Decimal("-100.00"),
            adjustment=Decimal("10.00"),
            net_pay=Decimal("810.00"),
            gross_pay_detail={"test": "test"},
            adjustment_detail={"test": "test"},
            tax_withheld_detail={"test": "test"},
            deduction_detail={"test": "test"},
            date=date(2024, 1, 1),
        )
        self.exchange = Exchange.objects.create(
            user=self.user,
            date=date(2024, 1, 1),
            exchange_ratio=1.5,
            exchange_broker="broker",
            amount_from=Decimal("1000.00"),
            amount_to=Decimal("1500.00"),
            transaction_from=self.transaction,
            transaction_to=self.transaction,
        )
        self.snapshot = AccountSnapshot.objects.create(
            user=self.user,
            account=self.account,
            bank=self.bank,
            item=self.item,
            amount=Decimal("1000.00"),
            date=date(2024, 1, 1),
            time=timezone.now().time(),
        )

    def test_bank_admin(self):
        admin = BankAdmin(Bank, self.site)
        assert admin.list_display == ["user", "name", "id"]
        assert admin.list_filter == ["user"]
        assert str(self.bank) == "Test Bank (KOREA)"
        assert self.bank.amount == Decimal("0.00")

    def test_account_admin(self):
        admin = AccountAdmin(Account, self.site)
        assert admin.list_display == [
            "user",
            "name",
            "id",
            "bank",
            "currency",
            "is_active",
            "first_added",
        ]
        assert admin.list_filter == ["user", "is_active", "bank", "first_added"]
        assert str(self.account) == "Test Account (Test Bank)"
        assert self.account.amount == Decimal("0.00")

    def test_retailer_admin(self):
        admin = RetailerAdmin(Retailer, self.site)
        assert admin.list_display == ["user", "id", "name", "retailer_type", "category"]
        assert admin.list_filter == ["user", "retailer_type", "category"]
        assert str(self.retailer) == "store: Test Retailer"

    def test_transaction_admin(self):
        admin = TransactionAdmin(Transaction, self.site)
        assert admin.list_display == [
            "pk",
            "date",
            "account_name",
            "amount",
            "retailer",
            "transaction_type",
            "is_reviewed",
        ]
        assert admin.list_filter == ["account", "transaction_type", "is_reviewed"]
        assert admin.raw_id_fields == ("linked_transaction", "account")

        # Test account_name method
        assert admin.account_name(self.transaction) == "Test Account"

        # Test get_queryset method
        queryset = admin.get_queryset(None)
        assert "account" in queryset.query.select_related
        assert "retailer" in queryset.query.select_related

    def test_account_snapshot_admin(self):
        admin = AccountSnapshotAdmin(AccountSnapshot, self.site)
        assert admin.date_hierarchy == "date"
        assert str(self.snapshot) == "2024-01-01 - Test Account (Test Bank)"
        assert self.snapshot.amount == Decimal("1000.00")

    def test_item_admin(self):
        admin = ItemAdmin(Item, self.site)
        assert admin.list_display == ("id", "code", "name")
        assert str(self.item) == "Test Item: TEST001"

    def test_item_transaction_admin(self):
        admin = ItemTransactionAdmin(ItemTransaction, self.site)
        assert admin.raw_id_fields == ("transaction",)
        assert (
            str(self.item_transaction)
            == "2024-01-01 - Test Item (TEST001) - 10.00 units @ 10.00"
        )
        assert self.item_transaction.purchase_price == Decimal("10.00")

    def test_item_price_admin(self):
        admin = ItemPriceAdmin(ItemPrice, self.site)
        assert admin.list_display == ("id", "item", "date", "price")
        assert str(self.item_price) == "Test Item: 2024-01-01 - 100.00"
        assert self.item_price.price == Decimal("100.00")

    def test_exchange_admin(self):
        admin = ExchangeAdmin(Exchange, self.site)
        assert admin.list_display == [
            "__str__",
            "id",
            "date",
            "exchange_ratio",
            "exchange_broker",
        ]
        assert admin.list_filter == ["exchange_broker"]
        assert admin.raw_id_fields == ("transaction_from", "transaction_to")
        assert admin.date_hierarchy == "date"
        exchange = Exchange.objects.create(
            transaction_from=self.transaction,
            transaction_to=self.transaction,
            amount_from=Decimal("1000.00"),
            amount_to=Decimal("1500.00"),
            currency_from=CurrencyType.USD,
            currency_to=CurrencyType.USD,
            exchange_ratio=1.0,
            exchange_broker="broker",
            user=self.user,
            date=date(2024, 1, 1),
            time=timezone.now().time(),
        )
        assert str(exchange) == "2024-01-01: 1.0"
        assert exchange.amount_from == Decimal("1000.00")
        assert exchange.amount_to == Decimal("1500.00")
        assert exchange.currency_from == CurrencyType.USD
        assert exchange.currency_to == CurrencyType.USD
        assert exchange.exchange_ratio == Decimal("1.0")
        assert exchange.exchange_broker == "broker"
        assert exchange.user == self.user
