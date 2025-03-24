from django.conf import settings
from rest_framework.routers import DefaultRouter
from rest_framework.routers import SimpleRouter

from finance_backend.money.api.views import AccountSnapshotViewSet
from finance_backend.money.api.views import AccountViewSet
from finance_backend.money.api.views import BankViewSet
from finance_backend.users.api.views import UserViewSet

router = DefaultRouter() if settings.DEBUG else SimpleRouter()

router.register("users", UserViewSet)
router.register("banks", BankViewSet)
router.register("accounts", AccountViewSet)
router.register("account-snapshots", AccountSnapshotViewSet)


app_name = "api"
urlpatterns = router.urls
