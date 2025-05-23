from datetime import date
from decimal import Decimal

from django.test import TestCase

from finance_backend.money.models.items import Item, ItemPrice
from finance_backend.users.tests.factories import UserFactory


class ItemsTest(TestCase):
    def setUp(self):
        self.user = UserFactory()
        self.item = Item.objects.create(
            user=self.user,
            name="Test Item",
            code="TEST001",
        )
        self.item_price = ItemPrice.objects.create(
            user=self.user,
            item=self.item,
            price=Decimal("10.00"),
            date=date(2024, 1, 1),
        )

    def test_item_model(self):
        assert self.item.user == self.user
        assert self.item.name == "Test Item"
        assert self.item.code == "TEST001"

    def test_item_str(self):
        assert str(self.item) == "Test Item: TEST001"

    def test_item_without_code(self):
        item = Item.objects.create(
            user=self.user,
            name="Test Item",
            code="TEST001",
        )
        assert str(item) == "Test Item: TEST001"

    def test_item_ordering(self):
        item2 = Item.objects.create(
            user=self.user,
            name="Another Item",
            code="TEST002",
        )
        items = list(Item.objects.all())
        assert items == [self.item, item2]

    def test_item_price_model(self):
        assert self.item_price.user == self.user
        assert self.item_price.item == self.item
        assert self.item_price.price == Decimal("10.00")
        assert self.item_price.date.strftime("%Y-%m-%d") == "2024-01-01"

    def test_item_price_relation(self):
        assert self.item.itemprice_set.count() == 1
        assert self.item.itemprice_set.first() == self.item_price
