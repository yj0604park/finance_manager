from datetime import UTC, date, datetime
from decimal import Decimal

from django.test import TestCase
from django.utils import timezone as django_timezone

from finance_backend.money.choices import CurrencyType, ExchangeType
from finance_backend.money.models.accounts import Account, Bank
from finance_backend.money.models.exchanges import Exchange
from finance_backend.money.models.shoppings import Retailer
from finance_backend.money.models.transactions import Transaction
from finance_backend.users.tests.factories import UserFactory


class ExchangesTest(TestCase):
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
        self.retailer = Retailer.objects.create(user=self.user, name="Test Retailer")
        self.AMOUNT_FROM = Decimal("100.00")
        self.AMOUNT_TO = Decimal("13000.00")
        self.transaction_from = Transaction.objects.create(
            user=self.user,
            account=self.account,
            retailer=self.retailer,
            amount=self.AMOUNT_FROM,
            date=datetime.now(tz=UTC).date(),
        )
        self.transaction_to = Transaction.objects.create(
            user=self.user,
            account=self.account,
            retailer=self.retailer,
            amount=self.AMOUNT_TO,
            date=datetime.now(tz=UTC).date(),
        )
        self.exchange = Exchange.objects.create(
            user=self.user,
            transaction_from=self.transaction_from,
            transaction_to=self.transaction_to,
            amount_from=self.AMOUNT_FROM,
            amount_to=self.AMOUNT_TO,
            currency_from=CurrencyType.USD,
            currency_to=CurrencyType.KRW,
            exchange_broker=ExchangeType.BANK,
            date=date(2024, 1, 1),
            time=django_timezone.now().time(),
            exchange_ratio=Decimal("0.00075"),
        )

    def test_exchange_model(self):
        assert self.exchange.user == self.user
        assert self.exchange.transaction_from == self.transaction_from
        assert self.exchange.transaction_to == self.transaction_to
        assert self.exchange.amount_from == self.AMOUNT_FROM
        assert self.exchange.amount_to == self.AMOUNT_TO
        assert self.exchange.currency_from == CurrencyType.USD
        assert self.exchange.currency_to == CurrencyType.KRW
        assert self.exchange.exchange_broker == ExchangeType.BANK
        assert self.exchange.date.strftime("%Y-%m-%d") == "2024-01-01"
        assert self.exchange.exchange_ratio == Decimal("0.00075")

    def test_exchange_str(self):
        expected_str = (
            f"{self.exchange.date.strftime('%Y-%m-%d')}: {self.exchange.exchange_ratio}"
        )
        assert str(self.exchange) == expected_str

    def test_exchange_relations(self):
        assert self.transaction_from.exchange_from.first() == self.exchange
        assert self.transaction_to.exchange_to.first() == self.exchange
        assert self.exchange.currency_from == CurrencyType.USD
        assert self.exchange.amount_from == self.AMOUNT_FROM
        assert self.exchange.user == self.user

    def test_exchange_without_ratio(self):
        exchange = Exchange.objects.create(
            user=self.user,
            transaction_from=self.transaction_from,
            transaction_to=self.transaction_to,
            amount_from=self.AMOUNT_FROM,
            amount_to=self.AMOUNT_TO,
            currency_from=CurrencyType.USD,
            currency_to=CurrencyType.KRW,
            exchange_broker=ExchangeType.BANK,
            date=date(2024, 1, 1),
            time=django_timezone.now().time(),
        )
        assert exchange.exchange_ratio is None
        assert (
            str(exchange)
            == f"{exchange.date.strftime('%Y-%m-%d')}: {exchange.exchange_ratio}"
        )
