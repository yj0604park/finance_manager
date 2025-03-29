import { Transaction } from '../models/Transaction';

/**
 * Transaction 인터페이스를 확장하여 추가 기능 구현
 * 원본 인터페이스를 수정하지 않고 확장
 */
export interface TransactionWithExtendedInfo extends Transaction {
  /** 트랜잭션 총 금액 (수수료 포함) 계산 */
  totalAmount?: number;

  /** 트랜잭션 요약 정보 */
  summary?: string;

  /** 커스텀 확장 속성 */
  customData?: Record<string, unknown>;
}

/**
 * 확장 인터페이스에 대한 유틸리티 함수
 */
export const transactionUtils = {
  /** Transaction을 확장된 인터페이스로 변환 */
  extendTransaction(transaction: Transaction): TransactionWithExtendedInfo {
    return {
      ...transaction,
      totalAmount: Number(transaction.amount),
      summary: `${transaction.date} - ${transaction.amount}`
    };
  },

  /** 트랜잭션 목록을 확장된 인터페이스로 변환 */
  extendTransactions(transactions: Transaction[]): TransactionWithExtendedInfo[] {
    return transactions.map(this.extendTransaction);
  }
};
