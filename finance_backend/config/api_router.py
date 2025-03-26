from django.conf import settings
from rest_framework.routers import DefaultRouter
from rest_framework.routers import SimpleRouter

from finance_backend.money.api.views import AccountSnapshotViewSet
from finance_backend.money.api.views import AccountViewSet
from finance_backend.money.api.views import BankViewSet
from finance_backend.money.api.views import ExchangeViewSet
from finance_backend.money.api.views import ItemPriceViewSet
from finance_backend.money.api.views import ItemTransactionViewSet
from finance_backend.money.api.views import ItemViewSet
from finance_backend.money.api.views import RetailerViewSet
from finance_backend.money.api.views import SalaryViewSet
from finance_backend.money.api.views import TransactionViewSet
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
