from datetime import date
from decimal import Decimal

from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from finance_backend.money.choices import CurrencyType
from finance_backend.money.models.accounts import Account, AccountSnapshot, Bank
from finance_backend.money.models.exchanges import Exchange
from finance_backend.money.models.incomes import Salary
from finance_backend.money.models.items import Item, ItemPrice
from finance_backend.money.models.shoppings import Retailer
from finance_backend.money.models.transactions import ItemTransaction, Transaction
from finance_backend.users.tests.factories import UserFactory


class APIViewsTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)
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
            purchase_price=Decimal("100.00"),
            quantity=Decimal("1.00"),
            date=date(2024, 1, 1),
        )
        self.item_price = ItemPrice.objects.create(
            user=self.user,
            item=self.item,
            price=100,
            date=date(2024, 1, 1),
        )
        self.salary = Salary.objects.create(
            user=self.user,
            transaction=self.transaction,
            date=date(2024, 1, 1),
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
        self.exchange = Exchange.objects.create(
            transaction_from=self.transaction,
            transaction_to=self.transaction,
            amount_from=Decimal("1000.00"),
            amount_to=Decimal("1500.00"),
            currency_from=CurrencyType.USD,
            currency_to=CurrencyType.USD,
            user=self.user,
            date=date(2024, 1, 1),
            time=timezone.now().time(),
            exchange_ratio=1.5,
            exchange_broker="broker",
        )
        self.snapshot = AccountSnapshot.objects.create(
            user=self.user,
            account=self.account,
            bank=self.bank,
            item=self.item,
            amount=Decimal("1000.00"),
            date=date(2024, 1, 1),
        )

    def test_bank_viewset(self):
        response = self.client.get("/api/banks/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["name"] == "Test Bank"

    def test_account_viewset(self):
        response = self.client.get("/api/accounts/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["name"] == "Test Account"

    def test_account_snapshot_viewset(self):
        response = self.client.get("/api/account-snapshots/")
        assert response.status_code == status.HTTP_200_OK

    def test_transaction_viewset(self):
        response = self.client.get("/api/transactions/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["amount"] == "100.00"

    def test_item_transaction_viewset(self):
        response = self.client.get("/api/item-transactions/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["purchase_price"] == "100.00"

    def test_exchange_viewset(self):
        response = self.client.get("/api/exchanges/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["exchange_ratio"] == "1.5000"

    def test_salary_viewset(self):
        response = self.client.get("/api/salaries/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["gross_pay"] == "1000.00"

    def test_item_viewset(self):
        response = self.client.get("/api/items/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["name"] == "Test Item"

    def test_retailer_viewset(self):
        response = self.client.get("/api/retailers/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["name"] == "Test Retailer"

    def test_item_price_viewset(self):
        response = self.client.get("/api/item-prices/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["price"] == "100.00"

    def test_base_user_viewset_filtering(self):
        other_user = UserFactory()
        Bank.objects.create(user=other_user, name="Other Bank", amount=Decimal("0.00"))
        response = self.client.get("/api/banks/")
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["name"] == "Test Bank"

    def test_base_user_viewset_create(self):
        data = {
            "name": "New Bank",
            "country": "USA",
            "amount": "0.00",
        }
        response = self.client.post("/api/banks/", data, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["name"] == "New Bank"
        assert response.data["country"] == "USA"
        assert response.data["amount"] == "0.00"
