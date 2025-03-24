from django.contrib import admin

from finance_backend.money.choices import TransactionCategory
from finance_backend.money.models.accounts import Account
from finance_backend.money.models.accounts import AccountSnapshot
from finance_backend.money.models.accounts import Bank
from finance_backend.money.models.exchanges import Exchange
from finance_backend.money.models.incomes import Salary
from finance_backend.money.models.items import Item
from finance_backend.money.models.items import ItemPrice
from finance_backend.money.models.shoppings import Retailer
from finance_backend.money.models.transactions import ItemTransaction
from finance_backend.money.models.transactions import Transaction


@admin.register(Bank)
class BankAdmin(admin.ModelAdmin):
    list_display = ["name", "id", "user"]
    list_filter = ["user"]


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ["name", "id", "bank", "currency", "is_active", "first_added"]
    list_filter = ["is_active", "bank", "first_added"]


@admin.register(Retailer)
class RetailerAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "retailer_type", "category"]
    list_filter = ["retailer_type", "category"]


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = [
        "pk",
        "date",
        "account_name",
        "amount",
        "retailer",
        "transaction_type",
        "is_reviewed",
    ]
    raw_id_fields = ("linked_transaction", "account")
    list_filter = ["account", "transaction_type", "is_reviewed"]

    def account_name(self, obj):
        return obj.account.name

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("account", "retailer")


@admin.register(AccountSnapshot)
class AccountSnapshotAdmin(admin.ModelAdmin):
    date_hierarchy = "date"


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ("id", "code", "name", "currency")


@admin.register(ItemTransaction)
class ItemTransactionAdmin(admin.ModelAdmin):
    raw_id_fields = ("transaction",)


@admin.register(ItemPrice)
class ItemPriceAdmin(admin.ModelAdmin):
    list_display = ("id", "item", "date", "price")


@admin.register(Salary)
class SalaryAdmin(admin.ModelAdmin):
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "transaction":
            kwargs["queryset"] = (
                Transaction.objects.filter(type=TransactionCategory.INCOME)
                .prefetch_related("account", "retailer")
                .order_by("date")
            )
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


@admin.register(Exchange)
class ExchangeAdmin(admin.ModelAdmin):
    list_display = ["__str__", "id", "date", "exchange_ratio", "exchange_brokder"]
    list_filter = ["exchange_brokder"]
    raw_id_fields = ("transaction_from", "transaction_to")
    date_hierarchy = "date"
