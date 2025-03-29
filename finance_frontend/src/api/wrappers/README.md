# API 래퍼 패턴 사용 가이드

## 개요

이 패턴은 자동 생성된 OpenAPI 클라이언트 코드를 직접 수정하지 않고 확장하는 방법을 제공합니다. 이를 통해 백엔드 API 변경 시 프론트엔드 코드를 쉽게 갱신할 수 있습니다.

## 구조

```
src/api/
├── core/            # 자동 생성된 OpenAPI 코어 기능
├── models/          # 자동 생성된 모델 타입
├── services/        # 자동 생성된 API 서비스
├── wrappers/        # 커스텀 확장 래퍼 클래스
│   ├── index.ts     # 모든 래퍼 내보내기
│   ├── extendedTypes.ts # 확장된 타입 정의
│   └── {Service}Wrapper.ts # 각 서비스별 래퍼
└── index.ts         # 자동 생성된 API 내보내기
```

## 사용 방법

1. **절대 자동 생성된 코드를 직접 수정하지 마세요!**
   - `/api/core/`, `/api/models/`, `/api/services/` 디렉토리의 코드는 API 스펙 변경 시 재생성됩니다.
   - 직접 수정한 내용은 모두 덮어씌워집니다.

2. **항상 래퍼 클래스를 사용하세요.**
   ```tsx
   // ❌ 잘못된 사용법
   import { TransactionsService } from '../api';
   const transactions = await TransactionsService.transactionsList();

   // ✅ 올바른 사용법
   import { TransactionsWrapper } from '../api/wrappers';
   const transactions = await TransactionsWrapper.getAll();
   ```

3. **확장된 타입과 유틸리티 활용하기**
   ```tsx
   // 확장된 트랜잭션 정보 사용
   import { TransactionsWrapper } from '../api/wrappers';
   const extendedTransactions = await TransactionsWrapper.getAllExtended();
   console.log(extendedTransactions[0].totalAmount); // 확장된 속성 접근
   ```

## API 스펙 업데이트 방법

백엔드 API가 변경되면 다음 스크립트를 실행하여 프론트엔드 코드를 업데이트합니다:

```
pwsh ./sync-openapi-spec.ps1
```

이 스크립트는:
1. 백엔드에서 최신 OpenAPI 스펙을 가져옵니다.
2. 프론트엔드 리소스 디렉토리에 저장합니다.
3. API 클라이언트 코드를 재생성합니다.

## 새로운 서비스 래퍼 생성하기

1. 새 래퍼 클래스 파일 생성 (`src/api/wrappers/{NewService}Wrapper.ts`)
2. 필요에 따라 확장된 인터페이스 작성 (`extendedTypes.ts`)
3. `src/api/wrappers/index.ts`에 새 래퍼 내보내기 등록
