import { QueryClient } from '@tanstack/react-query';

/**
 * 전역 QueryClient 인스턴스
 *
 * React Query 관련 기본 옵션 설정
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 리페치 비활성화
      retry: 1, // 실패 시 1번만 재시도
      staleTime: 5 * 60 * 1000, // 5분 동안 데이터를 신선한 상태로 유지
    },
  },
});
