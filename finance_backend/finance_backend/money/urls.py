from django.urls import path
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from strawberry.django.views import GraphQLView
from rest_framework_simplejwt.authentication import JWTAuthentication
from finance_backend.money.schema import schema

app_name = "money"

class AuthenticatedGraphQLView(GraphQLView):
    """로그인한 사용자만 GraphQL API를 사용할 수 있도록 제한"""
    
    def dispatch(self, request, *args, **kwargs):
        # Authorization 헤더에서 JWT 토큰 가져오기
        auth_header = request.headers.get("Authorization")

        if auth_header and auth_header.startswith("Token "):
            token = auth_header.split(" ")[1]
            jwt_authenticator = JWTAuthentication()

            try:
                # JWT 토큰 검증 후 request.user 설정
                validated_user, _ = jwt_authenticator.authenticate(request)
                request.user = validated_user
            except Exception:
                return JsonResponse({"error": "유효하지 않은 토큰입니다."}, status=401)

        if not request.user or request.user.is_anonymous:
            return JsonResponse({"error": "로그인이 필요합니다."}, status=403)

        return super().dispatch(request, *args, **kwargs)


urlpatterns = [
    path("graphql", csrf_exempt(AuthenticatedGraphQLView.as_view(schema=schema))),
]
