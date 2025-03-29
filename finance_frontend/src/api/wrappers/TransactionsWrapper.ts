import { TransactionsService, Transaction, PatchedTransaction } from '../index';
import { TransactionWithExtendedInfo, transactionUtils } from './extendedTypes';

/**
 * 생성된 TransactionsService를 래핑하는 클래스
 * 자동 생성된 코드를 직접 수정하지 않고 확장 기능 추가
 */
export class TransactionsWrapper {
  /**
   * 모든 트랜잭션 가져오기
   */
  static async getAll(): Promise<Transaction[]> {
    return await TransactionsService.transactionsList();
  }

  /**
   * 특정 트랜잭션 가져오기
   */
  static async getById(id: number): Promise<Transaction> {
    return await TransactionsService.transactionsRetrieve(id);
  }

  /**
   * 새 트랜잭션 생성
   */
  static async create(transaction: Transaction): Promise<Transaction> {
    return await TransactionsService.transactionsCreate(transaction);
  }

  /**
   * 트랜잭션 업데이트
   */
  static async update(id: number, transaction: Transaction): Promise<Transaction> {
    return await TransactionsService.transactionsUpdate(id, transaction);
  }

  /**
   * 트랜잭션 부분 업데이트
   */
  static async partialUpdate(id: number, transaction: PatchedTransaction): Promise<Transaction> {
    return await TransactionsService.transactionsPartialUpdate(id, transaction);
  }

  /**
   * 트랜잭션 삭제
   */
  static async delete(id: number): Promise<void> {
    return await TransactionsService.transactionsDestroy(id);
  }

  /**
   * 사용자별 트랜잭션 필터링 (커스텀 추가 기능)
   */
  static async getByUserId(userId: number): Promise<Transaction[]> {
    const allTransactions = await this.getAll();
    return allTransactions.filter(transaction => transaction.user === userId);
  }

  /**
   * 확장된 트랜잭션 정보로 모든 트랜잭션 가져오기
   */
  static async getAllExtended(): Promise<TransactionWithExtendedInfo[]> {
    const transactions = await this.getAll();
    return transactionUtils.extendTransactions(transactions);
  }

  /**
   * 확장된 트랜잭션 정보로 특정 트랜잭션 가져오기
   */
  static async getByIdExtended(id: number): Promise<TransactionWithExtendedInfo> {
    const transaction = await this.getById(id);
    return transactionUtils.extendTransaction(transaction);
  }
}
