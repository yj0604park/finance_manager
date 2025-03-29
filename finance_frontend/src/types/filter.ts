// 거래내역 필터링을 위한 인터페이스
export interface TransactionFilters {
  accountId?: number;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  category?: string;
  keyword?: string;
  [key: string]: string | number | undefined; // 추가 필터 속성을 위한 인덱스 시그니처
}

// 필터 함수 타입 정의
export type FilterFunction<T> = (item: T) => boolean;
