/**
 * 페이지네이션 정보 타입
 * 페이지 기반 목록 컴포넌트에서 사용
 */
export interface PaginationInfo {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/**
 * 필터 옵션 타입
 * 목록 필터링에 사용
 */
export interface FilterOptions {
  searchTerm: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 응답 상태 타입
 * API 요청/응답 상태를 관리하는 데 사용
 */
export interface ResponseState<T> {
  data?: T;
  isLoading: boolean;
  error?: string;
}
