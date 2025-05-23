# 백엔드 Todo 목록

## 1. API 엔드포인트 구현

### 은행 관리
- [x] 은행 목록 조회 API
- [x] 은행 상세 정보 조회 API
- [x] 은행 생성 API
- [x] 은행 수정 API
- [x] 은행 삭제 API
- [ ] 은행별 통계 API

### 계좌 관리
- [x] 계좌 목록 조회 API (bank 필터링 추가)
- [x] 계좌 상세 정보 조회 API
- [x] 계좌 생성 API
- [x] 계좌 수정 API
- [x] 계좌 삭제 API
- [x] 계좌 간 이체 연결 API (`link-transfer`)
- [ ] 계좌별 거래 내역 조회 API
- [ ] 월말 잔액 스냅샷 조회 API

### 거래 관리
- [x] 거래 내역 조회 API (account, date, type, amount, year, month 필터링 추가)
- [x] 거래 생성 API (계좌 잔액 자동 업데이트)
- [x] 거래 수정 API (계좌 잔액 자동 업데이트)
- [x] 거래 삭제 API (계좌 잔액 자동 업데이트 추가 필요)
- [x] 거래 필터링/검색 API
- [ ] 거래 내역 내보내기 API (CSV, PDF, Excel)
- [ ] 반복 거래 설정/관리 API
- [ ] 거래 내역 대량 수정/삭제 API
- [ ] 사용자 정의 카테고리/태그 관리 API

### 아이템 관리 (주식 포함)
- [x] 아이템 목록 조회 API (item_type 필터링 추가)
- [x] 아이템 상세 정보 조회 API
- [x] 아이템 생성 API
- [x] 아이템 수정 API
- [x] 아이템 삭제 API
- [ ] 주식 거래 내역 추가/조회/수정/삭제 API (ItemTransaction 확장 또는 신규)
- [ ] 주식 가격 추가/조회 API (ItemPrice 확장 또는 신규)

### 환율 관리
- [ ] 외부 API 통해 환율 정보 가져오기 API 또는 Task
- [ ] 환율 정보 저장 API
- [ ] 환율 정보 조회 API

### 수입/지출 관리 (특정 항목)
- [ ] 월급 내역 추가/조회/수정/삭제 API
- [ ] 월세 내역 추가/조회/수정/삭제 API (기존 Transaction 활용 가능성 높음)

### 예산 관리
- [ ] 예산 설정 API (카테고리별, 기간별)
- [ ] 예산 대비 지출 현황 조회 API
- [ ] 예산 초과 알림 기능 (백엔드 로직)

### 목표 관리
- [ ] 재정 목표 설정/관리 API
- [ ] 목표 달성 진행률 계산/조회 API

### 데이터 관리
- [ ] 은행 거래 내역 가져오기 API (CSV/OFX 파일 파싱)

### 보고서
- [ ] 현금 흐름 보고서 생성 API
- [ ] 순자산 추이 보고서 생성 API
- [ ] 투자 성과 분석 보고서 생성 API
- [ ] 사용자 정의 보고서 생성 API

### 알림
- [ ] 알림 생성/조회 API (백엔드 로직 필요)

### 대시보드
- [ ] 주요 지표 조회 API
- [ ] 월별/연도별 수입/지출 통계 API
- [ ] 카테고리별 지출 분석 API
- [ ] 예산 관리 API (요약 정보)
- [ ] 환율 정보 조회 API (그래프용)

## 2. 코드 구조 및 아키텍처 개선

- [ ] **`money` 앱 분리 검토:** 앱 규모가 커질 경우, `accounts`, `transactions`, `investments`, `rates`, `budgets`, `goals` 등 도메인별 앱 분리 고려
- [ ] **서비스 계층 도입 검토:** 복잡한 비즈니스 로직(모델 간 상호작용, 외부 연동 등)을 `services.py`로 분리하여 ViewSet/Signal 단순화 및 재사용성/테스트 용이성 향상
- [ ] **`choices.py` 리팩토링:** 파일이 비대해질 경우 모델별 또는 공통 `core` 앱으로 분리 고려
- [ ] **테스트 커버리지 향상:** 단위/통합 테스트 지속적 추가 (특히 서비스 계층)

## 3. 백그라운드 작업 (Celery 등)

- [ ] **월말 계좌 잔액 스냅샷 생성:** 매월 말일 자정에 실행되어 각 계좌의 잔액을 `AccountSnapshot`에 저장하는 주기적 작업 구현
- [ ] **환율 정보 주기적 업데이트:** 외부 API를 통해 주기적으로 환율 정보를 가져와 데이터베이스에 업데이트하는 작업 구현
- [ ] **반복 거래 자동 생성:** 설정된 주기에 따라 자동으로 거래 내역을 생성하는 주기적 작업 구현
- [ ] **알림 생성 작업:** 예산 초과, 목표 달성 임박 등 특정 조건 발생 시 알림을 생성하는 작업 구현

## 4. 데이터베이스

### 모델 설계
- [ ] 은행 모델 최적화
- [ ] 계좌 모델 최적화
- [ ] `AccountSnapshot` 모델 활용 강화 (월말 잔액 저장)
- [ ] 거래 모델 최적화 (삭제 시 잔액 반영 고려)
- [ ] `ItemTransaction` 모델 확장 또는 주식 거래용 신규 모델 설계
- [ ] `ItemPrice` 모델 확장 또는 주식 가격용 신규 모델 설계
- [ ] `ExchangeRate` 모델 신규 생성 (환율 정보 저장)
- [ ] `Salary` 모델 신규 생성 또는 `Transaction` 모델 확장 (월급 기록)
- [ ] `Budget` 모델 신규 생성
- [ ] `RecurringTransaction` 모델 신규 생성
- [ ] `FinancialGoal` 모델 신규 생성
- [ ] `UserCategory` 또는 `Tag` 모델 신규 생성
- [ ] `Notification` 모델 신규 생성
- [ ] 사용자 모델 최적화
- [ ] 카테고리 모델 구현 (기존 또는 신규)
- [ ] 예산 모델 구현

### 데이터베이스 최적화
- [ ] 인덱스 설계 및 적용
- [ ] 쿼리 최적화
- [ ] 데이터베이스 파티셔닝
- [ ] 캐싱 전략 수립

### 마이그레이션
- [ ] 데이터 마이그레이션 스크립트 작성
- [ ] 롤백 전략 수립
- [ ] 마이그레이션 테스트

## 5. 인증/인가

### 사용자 인증
- [x] JWT 토큰 기반 인증 구현
- [ ] 토큰 갱신 메커니즘 구현
- [ ] 소셜 로그인 (OAuth 2.0) 구현
- [ ] 비밀번호 재설정 기능

### 접근 제어
- [ ] 역할 기반 접근 제어 (RBAC) 구현
- [ ] 권한 관리 시스템 구현
- [ ] API 접근 제한 구현

## 6. 보안

### 데이터 보안
- [ ] 데이터 암호화 구현
- [ ] 민감 정보 마스킹
- [ ] SQL 인젝션 방지
- [ ] XSS 방지

### API 보안
- [x] API 키 관리 (TokenAuthentication)
- [ ] 요청 제한 (Rate Limiting)
- [x] CORS 설정
- [ ] HTTPS 강제

## 7. 성능 최적화

### API 성능
- [ ] API 응답 시간 최적화
- [ ] 쿼리 최적화
- [ ] 캐싱 구현
- [ ] 비동기 처리 구현

### 서버 성능
- [ ] 서버 리소스 모니터링
- [ ] 로드 밸런싱 설정
- [ ] 스케일링 전략 수립

## 8. 테스트

### 단위 테스트
- [ ] 모델 테스트
- [ ] 서비스 테스트
- [ ] API 엔드포인트 테스트
- [ ] 유틸리티 함수 테스트
- [ ] 백그라운드 작업 테스트

### 통합 테스트
- [ ] API 통합 테스트
- [ ] 데이터베이스 통합 테스트
- [ ] 외부 서비스 통합 테스트

### 성능 테스트
- [ ] 부하 테스트
- [ ] 스트레스 테스트
- [ ] 동시성 테스트

## 9. 모니터링 및 로깅

### 로깅
- [ ] 구조화된 로깅 구현
- [ ] 로그 레벨 설정
- [ ] 로그 수집 시스템 구축
- [ ] 로그 분석 도구 설정

### 모니터링
- [ ] 서버 상태 모니터링
- [ ] API 성능 모니터링
- [ ] 에러 추적 시스템 구축
- [ ] 알림 시스템 구현

## 10. 문서화

### API 문서
- [x] Swagger/OpenAPI 문서 작성 (drf-spectacular)
- [ ] API 사용 예제 작성
- [ ] 에러 코드 문서화

### 기술 문서
- [ ] 아키텍처 문서 작성
- [ ] 데이터베이스 스키마 문서화
- [ ] 배포 가이드 작성

## 우선순위 (조정됨)

1. 핵심 API 구현 및 기능 확장
   - 거래 관리 (삭제 시 잔액 업데이트, 반복 거래, 대량 편집)
   - 주식 관리 API
   - 예산 관리 API
   - 월말 잔액 스냅샷 생성/조회
   - 환율 정보 관리 API/Task
   - 목표 관리 API

2. 데이터베이스 설계 및 최적화
   - 신규 모델 추가 (예산, 목표, 환율, 반복거래 등)
   - 쿼리 최적화 및 인덱스

3. 백그라운드 작업 구현
   - 월말 스냅샷 생성
   - 반복 거래 생성
   - 환율 업데이트

4. 보고서 및 분석 기능
   - 기본 보고서 API (현금 흐름, 순자산)

5. 보안 및 안정성
   - 인증/인가 강화
   - 데이터 보안 강화
   - 모니터링 시스템 구축
   - 테스트 보강

6. 코드 구조 개선 (중/장기)
   - 서비스 계층 도입
   - 앱 분리 검토

## 진행 완료
- 거래(Transaction) 생성/수정/삭제 시 balance 필드 자동 갱신 (최적화 적용)
- OpenAI API를 활용한 거래 내역(raw text) 파싱 API 구현
  - POST /api/money/transactions/parse-raw/
  - 입력: raw_text
  - 출력: 파싱된 거래 리스트 (date, retailer, amount 등)

## 앞으로 할 일
- 프론트엔드와 연동 테스트
- 파싱 결과를 바로 Transaction으로 저장하는 기능 추가(선택)
- 파싱 프롬프트/출력 포맷 커스터마이즈(필요시)
