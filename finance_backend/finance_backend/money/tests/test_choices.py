from django.test import TestCase

from finance_backend.money.choices import (
    AccountType,
    Country,
    CurrencyType,
    DetailItemCategory,
    ExchangeType,
    ItemType,
    RetailerType,
    TransactionCategory,
)


class ChoicesTest(TestCase):
    def test_account_type_choices(self):
        assert AccountType.CHECKING_ACCOUNT == "CHECKING_ACCOUNT"
        assert AccountType.SAVINGS_ACCOUNT == "SAVINGS_ACCOUNT"
        assert AccountType.INSTALLMENT_SAVING == "INSTALLMENT_SAVING"
        assert AccountType.TIME_DEPOSIT == "TIME_DEPOSIT"
        assert AccountType.CREDIT_CARD == "CREDIT_CARD"
        assert AccountType.STOCK == "STOCK"
        assert AccountType.LOAN == "LOAN"

    def test_country_choices(self):
        assert Country.KOREA == "KOREA"
        assert Country.USA == "USA"

    def test_currency_type_choices(self):
        assert CurrencyType.KRW == "KRW"
        assert CurrencyType.USD == "USD"

    def test_detail_item_category_choices(self):
        assert DetailItemCategory.FOOD == "FOOD"

    def test_exchange_type_choices(self):
        assert ExchangeType.BANK == "BANK"
        assert ExchangeType.CREDITCARD == "CREDITCARD"
        assert ExchangeType.WIREBARLEY == "WIREBARLEY"
        assert ExchangeType.ETC == "ETC"

    def test_item_type_choices(self):
        assert ItemType.STOCK == "STOCK"
        assert ItemType.ITEM == "ITEM"

    def test_retailer_type_choices(self):
        assert RetailerType.RESTAURANT == "RESTAURANT"

    def test_transaction_category_choices(self):
        assert TransactionCategory.ETC_INCOME == "ETC_INCOME"
        assert TransactionCategory.SALARY == "SALARY"
        assert TransactionCategory.BONUS == "BONUS"
        assert TransactionCategory.INTEREST_INCOME == "INTEREST_INCOME"
        assert TransactionCategory.STOCK == "STOCK_INCOME"
        assert TransactionCategory.RENT == "RENT_INCOME"
        assert TransactionCategory.DIVIDEND == "DIVIDEND"
        assert TransactionCategory.DEPOSIT == "DEPOSIT"
        assert TransactionCategory.TRANSFER == "TRANSFER"
