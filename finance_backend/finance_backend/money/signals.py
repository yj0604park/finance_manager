from django.db import transaction as db_transaction
from django.db.models import F, Q
from django.db.models.signals import post_save, pre_save, post_delete
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
                amount=F("amount") + new_amount
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
                            amount=F("amount") + difference
                        )
                    )
            else:
                # 계좌 변경됨: 이전 계좌에서 이전 금액 빼고, 새 계좌에 새 금액 더함
                # 이전 계좌 업데이트
                db_transaction.on_commit(
                    lambda: Account.objects.filter(pk=old_account_id).update(
                        amount=F("amount") - old_amount
                    )
                )
                # 새 계좌 업데이트
                db_transaction.on_commit(
                    lambda: Account.objects.filter(pk=new_account_id).update(
                        amount=F("amount") + new_amount
                    )
                )


def recalculate_account_transaction_balances(account_id, from_transaction=None):
    """
    특정 계좌의 거래 중 from_transaction(포함) 이후의 거래만 balance를 누적 계산해 저장합니다.
    from_transaction이 None이면 전체를 갱신합니다.
    """
    from .models.transactions import Transaction  # 순환참조 방지

    qs = Transaction.objects.filter(account_id=account_id).order_by(
        "date", "amount", "id"
    )
    prev_balance = 0
    started = from_transaction is None
    for tx in qs:
        if not started:
            if tx.pk == from_transaction.pk:
                started = True
                # from_transaction 이전까지의 balance 누적
                prev_balance = tx.balance - tx.amount
        if started:
            prev_balance += tx.amount
            if tx.balance != prev_balance:
                tx.balance = prev_balance
                tx.save(update_fields=["balance"])


def get_from_transaction(instance, deleted=False):
    """
    변경된 거래(생성/수정/삭제) 이후의 거래부터 balance를 갱신하기 위해 기준 거래를 찾음.
    삭제의 경우, 삭제된 거래의 pk가 없으므로 date/amount/id로 가장 가까운 거래를 찾음.
    """
    from .models.transactions import Transaction

    if not deleted:
        return instance
    # 삭제의 경우: 해당 거래와 동일/이후 거래 중 가장 첫 번째 거래
    qs = (
        Transaction.objects.filter(account_id=instance.account_id)
        .filter(
            Q(date__gt=instance.date)
            | Q(date=instance.date, amount__gt=instance.amount)
            | Q(date=instance.date, amount=instance.amount, id__gt=instance.id)
        )
        .order_by("date", "amount", "id")
    )
    return qs.first() if qs.exists() else None


@receiver(post_save, sender=Transaction)
def update_transaction_balances_on_save(sender, instance, **kwargs):
    db_transaction.on_commit(
        lambda: recalculate_account_transaction_balances(
            instance.account_id, from_transaction=instance
        )
    )


@receiver(post_delete, sender=Transaction)
def update_transaction_balances_on_delete(sender, instance, **kwargs):
    from_tx = get_from_transaction(instance, deleted=True)
    db_transaction.on_commit(
        lambda: recalculate_account_transaction_balances(
            instance.account_id, from_transaction=from_tx
        )
    )
