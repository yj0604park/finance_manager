import { Salary } from '../api/models/Salary';
import { CurrencyToEnum } from '../api/models/CurrencyToEnum';

// 테스트 데이터
export const mockSalaries: (Salary & { _company?: string; _department?: string; _position?: string })[] = [
  {
    id: 1,
    date: '2023-05-15',
    currency: CurrencyToEnum.KRW,
    gross_pay: '3000000',
    tax_withheld: '300000',
    deduction: '200000',
    adjustment: '0',
    net_pay: '2500000',
    gross_pay_detail: {},
    adjustment_detail: {},
    tax_withheld_detail: {},
    deduction_detail: {},
    transaction: 0,
    created_at: '2023-05-15T09:00:00Z',
    updated_at: '2023-05-15T09:00:00Z',
  },
  {
    id: 2,
    date: '2023-06-15',
    currency: CurrencyToEnum.KRW,
    gross_pay: '3100000',
    tax_withheld: '310000',
    deduction: '190000',
    adjustment: '0',
    net_pay: '2600000',
    gross_pay_detail: {},
    adjustment_detail: {},
    tax_withheld_detail: {},
    deduction_detail: {},
    transaction: 0,
    created_at: '2023-06-15T09:00:00Z',
    updated_at: '2023-06-15T09:00:00Z',
  }
];
