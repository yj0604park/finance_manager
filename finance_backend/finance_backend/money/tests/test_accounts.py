from datetime import UTC
from datetime import datetime
from decimal import Decimal

from django.test import TestCase

from finance_backend.money.choices import AccountType
from finance_backend.money.choices import CurrencyType
from finance_backend.money.models.accounts import Account
from finance_backend.money.models.accounts import AccountSnapshot
from finance_backend.money.models.accounts import Bank
from finance_backend.money.models.items import Item
from finance_backend.users.tests.factories import UserFactory


class AccountsTest(TestCase):
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
        self.item = Item.objects.create(
            user=self.user,
            name="Test Item",
            code="TEST001",
            currency=CurrencyType.USD,
        )
        self.snapshot = AccountSnapshot.objects.create(
            user=self.user,
            account=self.account,
            bank=self.bank,
            item=self.item,
            amount=Decimal("1000.00"),
            date=datetime.now(tz=UTC).date(),
        )

    def test_bank_model(self):
        assert self.bank.user == self.user
        assert self.bank.name == "Test Bank"
        assert self.bank.country == "KOREA"
        assert self.bank.amount == Decimal("0.00")

    def test_bank_str(self):
        assert str(self.bank) == "Test Bank (KOREA)"

    def test_bank_ordering(self):
        bank2 = Bank.objects.create(
            user=self.user,
            name="Another Bank",
            country="USA",
            amount=Decimal("0.00"),
        )
        banks = list(Bank.objects.all())
        assert banks == [bank2, self.bank]

    def test_account_model(self):
        assert self.account.user == self.user
        assert self.account.bank == self.bank
        assert self.account.name == "Test Account"
        assert self.account.nickname == ""
        assert self.account.currency == CurrencyType.USD
        assert self.account.amount == Decimal("0.00")
        assert self.account.account_type == AccountType.CHECKING_ACCOUNT
        assert not self.account.last_update
        assert not self.account.first_added
        assert self.account.is_active

    def test_account_str(self):
        assert str(self.account) == "Test Account (Test Bank)"

    def test_account_ordering(self):
        account2 = Account.objects.create(
            user=self.user,
            bank=self.bank,
            name="Another Account",
            currency=CurrencyType.USD,
            amount=Decimal("0.00"),
        )
        accounts = list(Account.objects.all())
        assert accounts == [self.account, account2]

    def test_account_default_values(self):
        account = Account.objects.create(
            user=self.user,
            bank=self.bank,
            name="Default Account",
            currency=CurrencyType.USD,
            amount=Decimal("0.00"),
        )
        assert account.nickname == ""
        assert account.account_type == AccountType.CHECKING_ACCOUNT
        assert not account.last_update
        assert not account.first_added
        assert account.is_active

    def test_account_snapshot_model(self):
        assert self.snapshot.user == self.user
        assert self.snapshot.account == self.account
        assert self.snapshot.bank == self.bank
        assert self.snapshot.item == self.item
        assert self.snapshot.amount == Decimal("1000.00")
        assert self.snapshot.date == datetime.now(tz=UTC).date()

    def test_account_snapshot_str(self):
        expected_str = (
            f"{self.snapshot.date.strftime('%Y-%m-%d')} - "
            f"{self.account.name} ({self.bank.name})"
        )
        assert str(self.snapshot) == expected_str

    def test_account_snapshot_without_relations(self):
        snapshot = AccountSnapshot.objects.create(
            user=self.user,
            amount=Decimal("1000.00"),
            date=datetime.now(tz=UTC).date(),
        )
        assert snapshot.account is None
        assert snapshot.bank is None
        assert snapshot.item is None
        assert snapshot.amount == Decimal("1000.00")
        assert snapshot.date == datetime.now(tz=UTC).date()
