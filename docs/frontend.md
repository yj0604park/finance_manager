# 프론트엔드 개발 가이드

## 프로젝트 개요

이 프로젝트는 개인 재무 관리를 위한 대시보드 애플리케이션입니다. 사용자가 은행 계좌, 거래 내역, 지출 추적 등을 관리할 수 있는 웹 인터페이스를 제공합니다.

## 기술 스택

- **프레임워크**: React 19
- **타입 시스템**: TypeScript
- **UI 라이브러리**: Material UI 6
- **상태 관리**: React Query (TanStack Query)
- **라우팅**: React Router 7
- **테스팅**: Vitest, React Testing Library
- **번들러**: Vite
- **코드 품질**: ESLint, Prettier

## 프로젝트 구조

```
finance_frontend/
├── src/
│   ├── api/          # API 통신 관련 코드
│   ├── components/   # 재사용 가능한 컴포넌트
│   ├── contexts/     # React Context 정의
│   ├── pages/        # 페이지 컴포넌트
│   ├── routes/       # 라우팅 구성
│   ├── styles/       # 전역 스타일 및 테마
│   ├── test/         # 테스트 유틸리티 및 모킹
│   └── utils/        # 유틸리티 함수
├── public/           # 정적 자산
└── dist/             # 빌드된 파일 (배포용)
```

## 주요 컴포넌트

### 계좌 관리 (Accounts)

- `AccountList`: 계좌 목록 표시
- `AccountFormModal`: 계좌 추가/수정 모달
- `AccountDetail`: 계좌 상세 정보 표시

### 거래 내역 (Transactions)

- `TransactionList`: 거래 내역 목록 표시
- `TransactionFormModal`: 거래 추가/수정 모달
- `TransactionFilter`: 거래 필터링 컴포넌트

### 대시보드 (Dashboard)

- `Dashboard`: 메인 대시보드 화면
- `BalanceSummary`: 잔액 요약 컴포넌트
- `ExpensePieChart`: 지출 분석 차트

## 개발 가이드라인

### 컴포넌트 작성 규칙

1. **함수형 컴포넌트 사용**: 모든 컴포넌트는 함수형 컴포넌트로 작성합니다.
   ```typescript
   const MyComponent: React.FC<MyComponentProps> = ({ prop1, prop2 }) => {
     return <div>...</div>;
   };
   ```

2. **명확한 타입 정의**: 모든 props는 인터페이스로 타입을 정의합니다.
   ```typescript
   interface MyComponentProps {
     value: string;
     onChange: (value: string) => void;
   }
   ```

3. **컴포넌트 분리**: 복잡한 컴포넌트는 작은 단위로 분리하여 재사용성을 높입니다.

### API 통신

1. **API 서비스 사용**: 직접 fetch나 axios를 호출하지 말고, api 폴더 내의 서비스를 사용합니다.
   ```typescript
   const { data } = await TransactionsService.transactionsList();
   ```

2. **React Query 활용**: 데이터 페칭은 React Query의 useQuery, useMutation을 활용합니다.

### 테스트 작성

1. **단위 테스트 필수**: 모든 주요 컴포넌트에 대한 단위 테스트를 작성합니다.
2. **테스트 모킹**: 외부 의존성은 적절히 모킹합니다.
3. **유연한 테스트**: 구현 세부사항보다 기능 중심으로 테스트를 작성합니다.

### 스타일링

1. **Material UI 활용**: 커스텀 스타일은 최소화하고 Material UI의 컴포넌트와 테마를 활용합니다.
2. **반응형 설계**: 모든 컴포넌트는 모바일부터 데스크탑까지 반응형으로 작동해야 합니다.

## 빌드 및 배포

### 개발 환경 실행

```bash
# 로컬 개발 서버 실행
yarn dev

# 테스트 실행
yarn test

# 빌드
yarn build
```

### Docker 배포

```bash
# Docker 빌드 및 실행
docker-compose -f docker-compose.local.yml up --build vite
```

## 문제 해결

1. **테스트 오류**: [테스트 디버깅 가이드](./react-frontend-test-debugging-guide.md)를 참조하세요.
2. **빌드 오류**: node_modules를 삭제하고 패키지를 다시 설치해보세요.
3. **Type 오류**: 최신 API 타입 정의를 생성하려면 `yarn generate-api` 명령을 실행하세요.

## 참고 자료

- [React 공식 문서](https://react.dev/)
- [Material UI 문서](https://mui.com/material-ui/getting-started/)
- [React Router 문서](https://reactrouter.com/)
