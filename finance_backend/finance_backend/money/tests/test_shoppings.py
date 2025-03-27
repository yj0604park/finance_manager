from django.test import TestCase

from finance_backend.money.choices import RetailerType, TransactionCategory
from finance_backend.money.models.shoppings import Retailer
from finance_backend.users.tests.factories import UserFactory


class ShoppingsTest(TestCase):
    def setUp(self):
        self.user = UserFactory()
        self.retailer = Retailer.objects.create(
            user=self.user,
            name="Test Store",
            retailer_type=RetailerType.STORE,
            category=TransactionCategory.GROCERY,
        )

    def test_retailer_model(self):
        assert self.retailer.user == self.user
        assert self.retailer.name == "Test Store"
        assert self.retailer.retailer_type == RetailerType.STORE
        assert self.retailer.category == TransactionCategory.GROCERY

    def test_retailer_str(self):
        assert str(self.retailer) == f"{RetailerType.STORE}: Test Store"

    def test_retailer_ordering(self):
        Retailer.objects.create(
            user=self.user,
            name="A Store",
            retailer_type=RetailerType.STORE,
            category=TransactionCategory.GROCERY,
        )
        Retailer.objects.create(
            user=self.user,
            name="B Store",
            retailer_type=RetailerType.STORE,
            category=TransactionCategory.GROCERY,
        )
        retailers = Retailer.objects.all()
        assert retailers[0].name == "A Store"
        assert retailers[1].name == "B Store"
        assert retailers[2].name == "Test Store"

    def test_retailer_default_values(self):
        retailer = Retailer.objects.create(user=self.user, name="Default Store")
        assert retailer.retailer_type == RetailerType.ETC
        assert retailer.category == TransactionCategory.UNKNOWN
