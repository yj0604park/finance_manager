from datetime import date
from decimal import Decimal

from django.test import TestCase
from rest_framework.request import Request
from rest_framework.test import APIRequestFactory

from finance_backend.money.api.serializers.accounts_serializers import (
    AccountCreateSerializer,
)
from finance_backend.money.api.serializers.accounts_serializers import (
    AccountDetailSerializer,
)
from finance_backend.money.api.serializers.accounts_serializers import AccountSerializer
from finance_backend.money.api.serializers.accounts_serializers import (
    AccountSnapshotSerializer,
)
from finance_backend.money.api.serializers.accounts_serializers import BankSerializer
from finance_backend.money.choices import AccountType
from finance_backend.money.choices import CurrencyType
from finance_backend.money.models.accounts import Account
from finance_backend.money.models.accounts import AccountSnapshot
from finance_backend.money.models.accounts import Bank
from finance_backend.money.models.items import Item
from finance_backend.users.tests.factories import UserFactory


class AccountsSerializersTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
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
            date=date(2024, 1, 1),
        )

    def test_bank_serializer(self):
        request = Request(self.factory.get("/"))
        request.user = self.user
        serializer = BankSerializer(self.bank, context={"request": request})
        data = serializer.data
        assert data["name"] == "Test Bank"
        assert data["country"] == "KOREA"
        assert data["amount"] == "0.00"

    def test_account_serializer(self):
        request = Request(self.factory.get("/"))
        request.user = self.user
        serializer = AccountSerializer(self.account, context={"request": request})
        data = serializer.data
        assert data["name"] == "Test Account"
        assert data["nickname"] == ""
        assert data["currency"] == CurrencyType.USD
        assert data["amount"] == "0.00"
        assert data["account_type"] == "CHECKING_ACCOUNT"
        assert data["bank"] == self.bank.id

    def test_account_detail_serializer(self):
        serializer = AccountDetailSerializer(self.account)
        data = serializer.data
        assert data["name"] == "Test Account"
        assert data["nickname"] == ""
        assert data["currency"] == CurrencyType.USD
        assert data["amount"] == "0.00"
        assert data["account_type"] == "CHECKING_ACCOUNT"
        assert data["bank"]["id"] == self.bank.id
        assert data["bank"]["name"] == self.bank.name
        assert data["bank"]["amount"] == str(self.bank.amount)

    def test_account_create_serializer(self):
        data = {
            "user": self.user.id,
            "bank": self.bank.id,
            "name": "New Account",
            "currency": CurrencyType.USD,
            "amount": "0.00",
            "account_type": "CHECKING_ACCOUNT",
        }
        serializer = AccountCreateSerializer(data=data)
        assert serializer.is_valid()
        account = serializer.save()
        assert account.name == "New Account"
        assert account.bank == self.bank
        assert account.currency == CurrencyType.USD
        assert account.amount == Decimal("0.00")
        assert account.account_type == AccountType.CHECKING_ACCOUNT

    def test_account_snapshot_serializer(self):
        serializer = AccountSnapshotSerializer(self.snapshot)
        data = serializer.data
        assert data["amount"] == "1000.00"
        assert data["date"] == "2024-01-01"
        assert data["account"] == self.account.id
        assert data["bank"] == self.bank.id
        assert data["item"] == self.item.id

    def test_account_serializer_with_empty_nickname(self):
        request = Request(self.factory.get("/"))
        request.user = self.user
        data = {
            "user": self.user.id,
            "bank": self.bank.id,
            "name": "Test Account",
            "currency": CurrencyType.USD,
            "amount": "0.00",
            "account_type": "CHECKING_ACCOUNT",
            "nickname": "",  # 빈 문자열
        }
        serializer = AccountSerializer(data=data, context={"request": request})
        assert serializer.is_valid(), serializer.errors
        account = serializer.save()
        assert account.nickname == ""

    def test_account_serializer_with_null_nickname(self):
        request = Request(self.factory.get("/"))
        request.user = self.user
        data = {
            "user": self.user.id,
            "bank": self.bank.id,
            "name": "Test Account",
            "currency": CurrencyType.USD,
            "amount": "0.00",
            "account_type": "CHECKING_ACCOUNT",
            "nickname": None,  # null 값
        }
        serializer = AccountSerializer(data=data, context={"request": request})
        assert serializer.is_valid(), serializer.errors
        account = serializer.save()
        assert account.nickname == ""

    def test_account_serializer_without_nickname(self):
        request = Request(self.factory.get("/"))
        request.user = self.user
        data = {
            "user": self.user.id,
            "bank": self.bank.id,
            "name": "Test Account",
            "currency": CurrencyType.USD,
            "amount": "0.00",
            "account_type": "CHECKING_ACCOUNT",
            # nickname 필드 없음
        }
        serializer = AccountSerializer(data=data, context={"request": request})
        assert serializer.is_valid(), serializer.errors
        account = serializer.save()
        assert account.nickname == ""
