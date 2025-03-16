from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from strawberry.django.views import GraphQLView

from finance_backend.money.schema import schema

app_name = "money"

urlpatterns = [
  path("graphql", csrf_exempt(GraphQLView.as_view(schema=schema))),
]
