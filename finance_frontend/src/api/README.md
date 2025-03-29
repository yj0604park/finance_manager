# API 클라이언트 구조 및 통합 계획

## 현재 구조

현재 API 관련 코드는 다음과 같은 여러 구성 요소로 나뉘어 있습니다:

1. **자동 생성된 OpenAPI 코드** (`/api/core`, `/api/models`, `/api/services`)
   - OpenAPI 스펙에서 자동 생성된 코드
   - 직접 수정하지 않음

2. **기존 클라이언트** (`/api/clients`)
   - 자동 생성된 서비스에 대한 래퍼 클래스
   - 타입 변환 및 예외 처리 로직 포함

3. **인증 및 API 설정** (`/api/client.ts`)
   - API 기본 URL 설정
   - 인증 토큰 관리
   - 로그인/로그아웃 기능

4. **새로운 래퍼 패턴** (`/api/wrappers`)
   - 자동 생성 코드의 안전한 래핑
   - 확장된 인터페이스 제공

## 문제점

1. `/api/clients`와 `/api/wrappers`가 유사한 역할을 함
2. 일관된 패턴이 없어 개발자가 혼란스러울 수 있음
3. 새 API가 추가될 때 어디에 구현해야 할지 불분명함

## 통합 계획

### 단기 계획

1. **파일 위치 통합**
   - 모든 래퍼 클래스를 `/api/wrappers`로 통합
   - 기존 `/api/clients` 코드를 단계적으로 마이그레이션

2. **명확한 타입 변환 규칙 수립**
   - API 모델과 내부 앱 모델 간의 일관된 변환 로직 구현
   - 확장 필드 및 유틸리티 함수 표준화

3. **React Query 통합**
   - 래퍼 클래스를 기반으로 React Query 훅 생성
   - `/hooks/api` 디렉토리에 구현

### 마이그레이션 가이드

1. 새로운 API 기능은 항상 `/api/wrappers`에 구현합니다.
2. 기존 코드를 수정할 때는 점진적으로 `/api/clients`에서 `/api/wrappers`로 마이그레이션합니다.
3. `import { XXXClient } from '../api/clients'` 대신 `import { XXXWrapper } from '../api/wrappers'`를 사용합니다.

## 참고 사항

- 자동 생성 코드는 절대 직접 수정하지 마세요.
- API 스펙이 변경되면 `sync-openapi-spec.ps1` 스크립트를 실행하여 클라이언트를 재생성합니다.
- 래퍼 클래스에서 확장 기능을 구현할 때 타입 안전성을 유지하세요.
