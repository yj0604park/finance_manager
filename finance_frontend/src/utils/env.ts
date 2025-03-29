/**
 * 환경 관련 유틸리티 함수
 */

// TypeScript에 vitest 전역 변수가 있음을 알림
declare global {
  var vitest: any;
}

/**
 * 현재 테스트 환경인지 확인
 */
export const isTest = (): boolean => {
  return process.env.NODE_ENV === 'test';
};
