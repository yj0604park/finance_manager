from decimal import Decimal

from django.test import TestCase
from django.utils import timezone

from finance_backend.money.models.accounts import Account
from finance_backend.money.models.accounts import Bank
from finance_backend.money.models.transactions import Transaction
from finance_backend.users.tests.factories import UserFactory


class BaseModelsTest(TestCase):
    def setUp(self):
        self.user = UserFactory()
        self.test_date = timezone.now().date()
        self.test_time = timezone.now().time()
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

    def test_base_user_model(self):
        model = Transaction.objects.create(
            user=self.user,
            account=self.account,
            date=self.test_date,
            time=self.test_time,
            amount=Decimal("100.00"),
        )
        assert model.user == self.user

    def test_base_time_stamp_model(self):
        model = Transaction.objects.create(
            user=self.user,
            account=self.account,
            date=self.test_date,
            time=self.test_time,
            amount=Decimal("100.00"),
        )
        assert model.date == self.test_date
        assert model.time == self.test_time
        assert model.created_at is not None
        assert model.updated_at is not None

    def test_base_amount_model(self):
        model = Transaction.objects.create(
            user=self.user,
            account=self.account,
            date=self.test_date,
            time=self.test_time,
            amount=Decimal("100.00"),
        )
        assert model.amount == Decimal("100.00")

    def test_base_amount_model_default(self):
        model = Transaction.objects.create(
            user=self.user,
            account=self.account,
            date=self.test_date,
            time=self.test_time,
            amount=Decimal("0.00"),
        )
        assert model.amount == Decimal("0.00")

    def test_base_time_stamp_model_default(self):
        model = Transaction.objects.create(
            user=self.user,
            account=self.account,
            date=self.test_date,
            time=self.test_time,
            amount=Decimal("100.00"),
        )
        assert model.created_at is not None
        assert model.updated_at is not None

    def test_base_user_model_default(self):
        model = Transaction.objects.create(
            account=self.account,
            date=self.test_date,
            time=self.test_time,
            amount=Decimal("100.00"),
            user=self.user,
        )
        assert model.user is not None
