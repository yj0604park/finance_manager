/**
 * 공통 Base 엔티티 인터페이스
 * 모든 모델의 기본이 되는 필드들을 정의
 */
export interface BaseEntity {
  id: number;
}

/**
 * API 응답의 기본 구조
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

/**
 * 페이지네이션 정보
 */
export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * 페이지네이션 응답
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo;
}

/**
 * API 에러 응답
 */
export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

/**
 * 정렬 방향
 */
export type SortDirection = 'asc' | 'desc';

/**
 * 정렬 상태
 */
export interface SortState {
  field: string;
  direction: SortDirection;
}

/**
 * 필터 연산자
 */
export type FilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith';

/**
 * 필터 조건
 */
export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: string | number | boolean | Date;
}

/**
 * 모달 상태
 */
export interface ModalState<T = unknown> {
  open: boolean;
  data?: T | null;
  mode?: 'create' | 'edit' | 'view' | 'delete';
}

/**
 * 알림 타입
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * 알림 상태
 */
export interface NotificationState {
  open: boolean;
  message: string;
  type: NotificationType;
  duration?: number;
}

/**
 * 로딩 상태
 */
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

/**
 * 에러 상태
 */
export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string | number;
}
