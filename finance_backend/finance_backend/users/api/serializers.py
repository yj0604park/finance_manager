from rest_framework import serializers

from finance_backend.users.models import User


class UserSerializer(serializers.ModelSerializer[User]):
    class Meta:
        model = User
        fields = ["name", "url"]

        extra_kwargs = {
            "url": {"view_name": "api:user-detail", "lookup_field": "pk"},
        }


class CustomUserDetailsSerializer(serializers.ModelSerializer):
    """
    dj-rest-auth의 기본 UserDetailsSerializer를 대체합니다.
    커스텀 User 모델의 필드 ('pk', 'email', 'name')에 맞게 조정합니다.
    """

    class Meta:
        model = User
        fields = ("pk", "email", "name")
        read_only_fields = ("pk", "email")
