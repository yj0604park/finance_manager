import contextlib

from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class MoneyConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'finance_backend.money'

    def ready(self):
        with contextlib.suppress(ImportError):
            import finance_backend.users.signals  # noqa: F401
