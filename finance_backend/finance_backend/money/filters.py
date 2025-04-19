import django_filters
from .models.accounts import Account
from .models.transactions import Transaction
from .models.items import Item


class AccountFilter(django_filters.FilterSet):
    bank = django_filters.NumberFilter(field_name="bank__id", lookup_expr="exact")

    class Meta:
        model = Account
        fields = ["bank"]


class TransactionFilter(django_filters.FilterSet):
    account = django_filters.NumberFilter(field_name="account__id", lookup_expr="exact")
    date_after = django_filters.DateFilter(field_name="date", lookup_expr="gte")
    date_before = django_filters.DateFilter(field_name="date", lookup_expr="lte")
    amount_min = django_filters.NumberFilter(field_name="amount", lookup_expr="gte")
    amount_max = django_filters.NumberFilter(field_name="amount", lookup_expr="lte")
    # transaction_type은 CharField 기반 Enum이므로 CharFilter 사용
    transaction_type = django_filters.CharFilter(
        field_name="transaction_type", lookup_expr="exact"
    )
    # 연도 및 월 필터 추가
    year = django_filters.NumberFilter(field_name="date", lookup_expr="year")
    month = django_filters.NumberFilter(field_name="date", lookup_expr="month")

    class Meta:
        model = Transaction
        # fields 목록에 year, month 추가
        fields = [
            "account",
            "date_after",
            "date_before",
            "transaction_type",
            "amount_min",
            "amount_max",
            "year",
            "month",
        ]


class ItemFilter(django_filters.FilterSet):
    item_type = django_filters.CharFilter(field_name="item_type", lookup_expr="exact")

    class Meta:
        model = Item
        fields = ["item_type"]
