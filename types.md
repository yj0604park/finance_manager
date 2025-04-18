# 프론트엔드 타입 시스템 구조

## 1. API 모델 타입 (기존)

API 요청/응답에 사용되는 기본 모델 타입들입니다. `src/api/models/` 디렉토리에 정의되어 있습니다.

- `Bank`
- `Account`
- `Transaction`
- `CountryEnum`
- `AccountTypeEnum`
- `CurrencyToEnum`
- `TransactionTypeEnum`
- 기타 API 응답 관련 타입들

## 2. 내부 확장 타입 (생성 필요)

API 모델을 확장하여 내부 데이터 구조나 UI 요구사항에 맞춘 확장 타입들입니다.
`src/types/` 디렉토리에 정의합니다.

### 2.1 은행 관련 타입 (`src/types/bank.ts`)

```typescript
import { Bank } from '../api/models/Bank';
import { Account } from '../api/models/Account';

// 계좌 목록이 포함된 은행 타입
export interface BankWithAccounts extends Bank {
  accounts: Account[];
}
```

### 2.2 계좌 관련 타입 (`src/types/account.ts`)

```typescript
import { Account } from '../api/models/Account';
import { Transaction } from '../api/models/Transaction';

// 최근 거래 내역이 포함된 계좌 타입 (필요시 구현)
export interface AccountWithTransactions extends Account {
  recentTransactions: Transaction[];
}
```

### 2.3 거래 관련 타입 (`src/types/transaction.ts`)

```typescript
import { Transaction } from '../api/models/Transaction';

// 계좌와 은행 정보가 포함된 거래 타입 (필요시 구현)
export interface TransactionWithDetails extends Transaction {
  accountName: string;
  bankName: string;
}
```

## 3. 컴포넌트 Props 타입

각 컴포넌트 파일 내에 정의되는 Props 타입들입니다. 컴포넌트와 함께 정의합니다.

## 4. 유틸리티 타입 (`src/types/utils.ts`)

여러 컴포넌트에서 공통으로 사용할 수 있는 유틸리티 타입들입니다.

```typescript
// 페이징 정보 타입
export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// 필터 옵션 타입
export interface FilterOptions {
  searchTerm: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 응답 상태 타입
export interface ResponseState<T> {
  data?: T;
  isLoading: boolean;
  error?: string;
}
```

## 5. 타입 사용 가이드라인

1. **API 모델 타입은 직접 수정하지 않기**
   - API 모델은 자동 생성된 코드이므로 수정하지 않습니다.
   - 확장이 필요한 경우 `src/types/` 디렉토리에 확장 타입을 정의합니다.

2. **중복 타입 정의 피하기**
   - 동일한 타입이 여러 파일에 정의되지 않도록 중앙에서 관리합니다.
   - 재사용되는 타입은 별도의 파일로 분리합니다.

3. **타입 단언(`as`) 최소화하기**
   - 타입 단언은 타입 안전성을 해치므로 최소화합니다.
   - 필요한 경우 타입 가드나 사용자 정의 타입 가드를 사용합니다.

## 6. 당장 필요한 구현 목록

1. **`types` 디렉토리 생성**
2. **`src/types/bank.ts`** - `BankWithAccounts` 타입 정의
3. **`src/types/utils.ts`** - 기본 유틸리티 타입 정의 (필요시)
