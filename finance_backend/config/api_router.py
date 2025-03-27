from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter

from finance_backend.money.api.views import (
    AccountSnapshotViewSet,
    AccountViewSet,
    BankViewSet,
    ExchangeViewSet,
    ItemPriceViewSet,
    ItemTransactionViewSet,
    ItemViewSet,
    RetailerViewSet,
    SalaryViewSet,
    TransactionViewSet,
)
from finance_backend.users.api.views import UserViewSet

router = DefaultRouter() if settings.DEBUG else SimpleRouter()

router.register("users", UserViewSet)
router.register("banks", BankViewSet)
router.register("accounts", AccountViewSet)
router.register("account-snapshots", AccountSnapshotViewSet)
router.register("transactions", TransactionViewSet)
router.register("item-transactions", ItemTransactionViewSet)
router.register("exchanges", ExchangeViewSet)
router.register("salaries", SalaryViewSet)
router.register("items", ItemViewSet)
router.register("item-prices", ItemPriceViewSet)
router.register("retailers", RetailerViewSet)


app_name = "api"
urlpatterns = router.urls
