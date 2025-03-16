import strawberry
import strawberry.django
from strawberry import auto, relay

from finance_backend.money.models.transactions import Transaction
from finance_backend.money.types.accounts import AccountFilter, AccountNode, AccountOrder
from finance_backend.money.types.retailers import RetailerNode


# region: Transaction
@strawberry.django.filters.filter(Transaction, lookups=True)
class TransactionFilter:
    id: auto
    date: auto
    account: AccountFilter


@strawberry.django.ordering.order(Transaction)
class TransactionOrder:
    id: auto
    date: auto
    account: AccountOrder
    amount: auto
    balance: auto


@strawberry.django.type(Transaction, filters=TransactionFilter, order=TransactionOrder)
class TransactionNode(relay.Node):
    id: relay.GlobalID
    amount: auto
    account: AccountNode
    retailer: RetailerNode | None
    date: auto
    type: auto
    is_internal: auto
    requires_detail: auto
    reviewed: auto
    balance: auto
    type: auto
    note: auto
    related_transaction: "TransactionNode | None"

    @strawberry.field
    def get_sorting_amount(self) -> float:
        return self.balance if self.amount >= 0 else -self.balance


@strawberry.django.input(Transaction)
class TransactionInput:
    amount: auto
    account: AccountNode
    retailer: RetailerNode | None
    date: auto
    type: auto
    is_internal: auto
    note: auto


# endregion
