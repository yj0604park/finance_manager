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
        self.account1 = Account.objects.create(
            user=self.user,
            bank=self.bank,
            name="Test Account 1",
            currency=CurrencyType.USD,
            amount=Decimal("1000.00"),
        )
        self.tx1 = Transaction.objects.create(
            user=self.user,
            account=self.account1,
            amount=Decimal("100.00"),
            date=date(2024, 1, 1),
        )
        self.tx2 = Transaction.objects.create(
            user=self.user,
            account=self.account1,
            amount=Decimal("-50.00"),
            date=date(2024, 1, 2),
        )
        self.tx3 = Transaction.objects.create(
            user=self.user,
            account=self.account1,
            amount=Decimal("200.00"),
            date=date(2024, 1, 3),
        )
        self.retailer = Retailer.objects.create(
            user=self.user,
            name="Test Retailer",
            retailer_type="store",
            category="food",
        )
        self.transaction = Transaction.objects.create(
            user=self.user,
            account=self.account1,
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
            account=self.account1,
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
        assert response.data["results"][0]["name"] == "Test Account 1"

    def test_account_snapshot_viewset(self):
        response = self.client.get("/api/account-snapshots/")
        assert response.status_code == status.HTTP_200_OK

    def test_transaction_viewset(self):
        response = self.client.get("/api/transactions/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Expect 4 transactions created in setUp for self.account1
        self.assertEqual(len(response.data["results"]), 4)
        # Assuming default ordering is -date, -id
        self.assertEqual(response.data["results"][0]["amount"], "200.00")  # tx3
        self.assertEqual(response.data["results"][1]["amount"], "-50.00")  # tx2
        # Order between tx1 and transaction might depend on creation order/id
        # We check if the remaining amounts are present
        amounts = {res["amount"] for res in response.data["results"][2:]}
        self.assertEqual(amounts, {"100.00"})

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

    def test_get_transactions_with_balance(self):
        """Test retrieving transactions with calculated balance for a specific account."""
        url = f"/api/transactions/account/{self.account1.pk}/with-balance/"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Expect 4 transactions created in setUp
        self.assertEqual(len(response.data), 4)

        # Check order (date ascending, amount ascending, id ascending)
        # Assuming tx1 has lower id than transaction
        self.assertEqual(response.data[0]["amount"], "100.00")  # tx1
        self.assertEqual(response.data[1]["amount"], "100.00")  # transaction
        self.assertEqual(response.data[2]["amount"], "-50.00")  # tx2
        self.assertEqual(response.data[3]["amount"], "200.00")  # tx3

        # Check balance calculation based on 4 transactions
        self.assertEqual(response.data[0]["balance"], "100.00")  # 0 + 100 (tx1)
        self.assertEqual(
            response.data[1]["balance"], "200.00"
        )  # 100 + 100 (transaction)
        self.assertEqual(response.data[2]["balance"], "150.00")  # 200 - 50 (tx2)
        self.assertEqual(response.data[3]["balance"], "350.00")  # 150 + 200 (tx3)

    def test_get_transactions_with_balance_unauthorized(self):
        """Test unauthorized access to the endpoint."""
        self.client.logout()
        url = f"/api/transactions/account/{self.account1.pk}/with-balance/"
        response = self.client.get(url)
        # Expect 403 Forbidden for unauthenticated users due to IsAuthenticated permission
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_transactions_with_balance_wrong_account(self):
        """Test accessing transactions of an account not owned by the user."""
        other_user = UserFactory()
        other_account = Account.objects.create(
            user=other_user,
            bank=self.bank,
            name="Other Account",
            currency=CurrencyType.USD,
            amount=Decimal("0.00"),
        )
        url = f"/api/transactions/account/{other_account.pk}/with-balance/"
        response = self.client.get(url)
        # get_object_or_404 in the view should return 404
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_transactions_with_balance_no_transactions(self):
        """Test the endpoint when the account has no transactions."""
        account_no_tx = Account.objects.create(
            user=self.user,
            bank=self.bank,
            name="Account No TX",
            currency=CurrencyType.USD,
            amount=Decimal("0.00"),
        )
        url = f"/api/transactions/account/{account_no_tx.pk}/with-balance/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)
