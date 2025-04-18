import { Bank } from '../api/models/Bank';
import { Account } from '../api/models/Account';

/**
 * 계좌 목록이 포함된 은행 타입
 * 은행 정보와 해당 은행에 속한 계좌 목록을 함께 표시할 때 사용
 */
export interface BankWithAccounts extends Bank {
  accounts: Account[];
}
