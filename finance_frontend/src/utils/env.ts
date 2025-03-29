/**
 * 환경 관련 유틸리티 함수
 */

// TypeScript에 vitest 전역 변수가 있음을 알림
declare global {
  // vitest가 이미 node_modules/vitest/globals.d.ts에 선언되어 있음
}

/**
 * 현재 테스트 환경인지 확인
 */
export const isTest = (): boolean => {
  return process.env.NODE_ENV === 'test';
};
