import strawberry
import strawberry.django
from strawberry import auto, relay

from finance_backend.finance_backend.money.models import items
from finance_backend.money.types.accounts import AccountNode
from finance_backend.money.types.transactions import TransactionNode


# region: Stock
@strawberry.django.filters.filter(items.Stock, lookups=True)
class StockFilter:
    id: auto
    name: auto


@strawberry.django.type(items.Stock, filters=StockFilter)
class Stock:
    id: auto
    name: auto
    ticker: auto
    currency: auto


@strawberry.django.input(items.Stock)
class StockInput:
    ticker: auto
    name: auto
    currency: auto


@strawberry.django.type(items.Stock)
class StockNode(relay.Node):
    id: relay.GlobalID
    ticker: auto
    name: auto
    currency: auto


# endregion


# region: StockTransaction
@strawberry.django.input(items.StockTransaction)
class StockTransactionInput:
    date: auto
    account: AccountNode
    stock: StockNode
    related_transaction: TransactionNode

    price: auto
    amount: auto
    shares: auto
    note: auto


@strawberry.django.type(items.StockTransaction)
class StockTransactionNode(relay.Node):
    id: relay.GlobalID
    account: AccountNode
    stock: StockNode
    related_transaction: TransactionNode

    price: auto
    amount: auto
    shares: auto
    note: auto


# endregion
