from django.db import transaction as db_transaction
from django.db.models import F
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from .models.accounts import Account
from .models.transactions import Transaction


# Transaction 저장 전 처리: 이전 상태 저장
@receiver(pre_save, sender=Transaction)
def store_previous_transaction_state(sender, instance: Transaction, **kwargs):
    """Transaction 저장 전의 amount와 account_id를 임시 저장합니다."""
    if instance.pk:  # 업데이트 경우에만 (pk가 존재)
        try:
            # 데이터베이스에서 현재 상태 가져오기
            original_instance = sender.objects.get(pk=instance.pk)
            instance._original_state = {
                "amount": original_instance.amount,
                "account_id": original_instance.account_id,
            }
        except sender.DoesNotExist:
            # 이론적으로는 발생하지 않아야 함 (업데이트 시에는 객체가 존재해야 함)
            instance._original_state = None
    else:  # 생성 경우
        instance._original_state = None


# Transaction 저장 후 처리: 잔액 업데이트
@receiver(post_save, sender=Transaction)
def update_account_balance_on_transaction_save(
    sender, instance: Transaction, created, **kwargs
):
    """Transaction 생성 또는 업데이트 시 Account의 balance를 업데이트합니다.
    amount 필드에 부호가 포함되어 있다고 가정합니다.
    """
    account = instance.account
    new_amount = instance.amount

    if created:
        # 새로운 거래: 새 금액만 더함
        # db_transaction.on_commit: 현재 트랜잭션이 성공적으로 커밋된 후에 실행되도록 보장
        db_transaction.on_commit(
            lambda: Account.objects.filter(pk=account.pk).update(
                balance=F("balance") + new_amount
            )
        )

    else:  # 업데이트 경우
        original_state = getattr(instance, "_original_state", None)
        if original_state:
            old_amount = original_state["amount"]
            old_account_id = original_state["account_id"]
            new_account_id = account.pk  # 현재 인스턴스의 계좌 ID

            # 이전 상태와 비교하여 잔액 조정
            if old_account_id == new_account_id:
                # 계좌 변경 없음: 차액만 반영
                difference = new_amount - old_amount
                if difference != 0:  # 금액 변경이 있을 때만 업데이트
                    db_transaction.on_commit(
                        lambda: Account.objects.filter(pk=new_account_id).update(
                            balance=F("balance") + difference
                        )
                    )
            else:
                # 계좌 변경됨: 이전 계좌에서 이전 금액 빼고, 새 계좌에 새 금액 더함
                # 이전 계좌 업데이트
                db_transaction.on_commit(
                    lambda: Account.objects.filter(pk=old_account_id).update(
                        balance=F("balance") - old_amount
                    )
                )
                # 새 계좌 업데이트
                db_transaction.on_commit(
                    lambda: Account.objects.filter(pk=new_account_id).update(
                        balance=F("balance") + new_amount
                    )
                )
