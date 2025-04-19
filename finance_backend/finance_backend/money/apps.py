from django.apps import AppConfig


class MoneyConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "finance_backend.money"

    def ready(self):
        # Implicitly connect signal handlers decorated with @receiver.
        # noinspection PyUnresolvedReferences
        from . import signals  # noqa: F401
