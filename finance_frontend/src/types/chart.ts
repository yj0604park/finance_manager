// 차트 관련 타입 정의
export interface ChartDataItem {
  name: string;
  [key: string]: string | number; // 추가 프로퍼티를 위한 인덱스 시그니처
}

// 수입과 지출 데이터를 위한 인터페이스
export interface IncomeExpenseData extends ChartDataItem {
  income: number;
  expense: number;
}
