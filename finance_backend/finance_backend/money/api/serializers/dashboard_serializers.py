from rest_framework import serializers
from finance_backend.money.models.transactions import Transaction
from .accounts_serializers import SimpleAccountSerializer  # 계좌 정보용 (간단 버전)
from .shopping_serializers import SimpleRetailerSerializer  # 판매처 정보용 (간단 버전)


class DashboardRecentTransactionSerializer(serializers.ModelSerializer):
    """대시보드 최근 거래 내역용 Serializer (판매처, 계좌 정보 포함)"""

    # Nested Serializer를 사용하여 관련 객체의 상세 정보 포함
    account = SimpleAccountSerializer(read_only=True)
    retailer = SimpleRetailerSerializer(read_only=True)
    # 필요하다면 transaction_type_display도 추가
    transaction_type_display = serializers.CharField(
        source="get_transaction_type_display", read_only=True
    )

    class Meta:
        model = Transaction
        fields = [
            "id",
            "date",
            "amount",
            "transaction_type",
            "transaction_type_display",
            "note",
            "account",  # 계좌 상세 정보 포함
            "retailer",  # 판매처 상세 정보 포함
        ]
        # read_only_fields = fields # 모든 필드를 읽기 전용으로 할 경우
