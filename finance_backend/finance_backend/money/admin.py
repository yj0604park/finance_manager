from django import forms
from django.contrib import admin

from finance_backend.money.choices import DetailItemCategory, TransactionCategory
from finance_backend.money.models.accounts import Account, AmountSnapshot, Bank
from finance_backend.money.models.exchanges import Exchange
from finance_backend.money.models.incomes import W2, Salary
from finance_backend.money.models.shoppings import AmazonOrder, DetailItem, Retailer
from finance_backend.money.models.stocks import Stock, StockPrice, StockTransaction
from finance_backend.money.models.transactions import Transaction, TransactionDetail, TransactionFile


@admin.register(Bank)
class BankAdmin(admin.ModelAdmin):
    list_display = ["name", "id"]


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ["name", "id", "bank", "currency", "is_active", "first_added"]
    list_filter = ["is_active", "bank", "first_added"]


@admin.register(AmountSnapshot)
class AmountSnapshotAdmin(admin.ModelAdmin):
    date_hierarchy = "date"


class TransactionAdminForm(forms.Form):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        sorted_choices = Retailer.objects.all().order_by("name").values("name")
        self.fields["retailer"].choices = sorted_choices


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = [
        "pk",
        "date",
        "account_name",
        "amount",
        "retailer",
        "type",
        "reviewed",
    ]
    raw_id_fields = ("related_transaction", "account")
    list_filter = ["account", "type"]

    def account_name(self, obj):
        return obj.account.name

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("account", "retailer")


@admin.register(Retailer)
class RetailerAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "type", "category"]
    list_filter = ["type", "category"]


@admin.register(DetailItem)
class DetailItemAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "category"]
    list_filter = ["category"]

    def formfield_for_choice_field(self, db_field, request, **kwargs):
        if db_field.name == "category":
            # Get the existing choices.
            choices = DetailItemCategory.choices

            # Sort the choices in lexicographic order.
            kwargs["choices"] = sorted(choices, key=lambda x: x[1])

        return super().formfield_for_choice_field(db_field, request, **kwargs)


@admin.register(TransactionDetail)
class TransactionDetailAdmin(admin.ModelAdmin):
    raw_id_fields = ("transaction",)

    list_display = ("id", "item", "amount", "count")


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


@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ("id", "ticker", "name", "currency")


@admin.register(StockPrice)
class StockPriceAdmin(admin.ModelAdmin):
    list_display = ("id", "stock", "date", "price")


@admin.register(StockTransaction)
class StockTransactionAdmin(admin.ModelAdmin):
    raw_id_fields = ("related_transaction",)


@admin.register(AmazonOrder)
class AmazonOrderAdmin(admin.ModelAdmin):
    list_display = ["id", "item", "date", "is_returned", "transaction"]
    raw_id_fields = ("transaction", "return_transaction")
    date_hierarchy = "date"

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .select_related(
                "transaction",
                "return_transaction",
                "transaction__account",
                "transaction__retailer",
                "return_transaction__account",
            )
        )


@admin.register(Exchange)
class ExchangeAdmin(admin.ModelAdmin):
    list_display = ["__str__", "id", "date", "ratio_per_krw", "exchange_type"]
    list_filter = ["exchange_type"]
    raw_id_fields = ("from_transaction", "to_transaction")
    date_hierarchy = "date"


@admin.register(TransactionFile)
class TransactionFileAdmin(admin.ModelAdmin):
    list_display = ["id", "file", "date"]
    date_hierarchy = "date"


@admin.register(W2)
class W2Admin(admin.ModelAdmin):
    list_display = ["id", "year", "date"]
    date_hierarchy = "date"
    list_filter = ["year"]
    search_fields = ["year"]
