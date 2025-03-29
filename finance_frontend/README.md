# Finance Manager

금융 거래를 관리하고 추적하는 웹 애플리케이션입니다.

## 기술 스택

- React
- TypeScript
- Material-UI
- Jest & React Testing Library

## 시작하기

### 필수 조건

- Node.js 16.x 이상
- Yarn 패키지 매니저

### 설치

```bash
cd dashboard
yarn install
```

### 개발 서버 실행

```bash
yarn start
```

### 테스트 실행

```bash
yarn test
```

## 프로젝트 구조

```
dashboard/
├── src/
│   ├── components/     # 재사용 가능한 컴포넌트
│   ├── pages/         # 페이지 컴포넌트
│   ├── services/      # API 서비스
│   ├── types/         # TypeScript 타입 정의
│   └── utils/         # 유틸리티 함수
└── public/            # 정적 파일
```

## 테스트

- Jest와 React Testing Library를 사용하여 단위 테스트 및 통합 테스트를 실행합니다.
- GitHub Actions를 통해 자동화된 테스트를 실행합니다.

## Git 커밋 전 검사

이 프로젝트에는 Git 커밋 전 TypeScript 타입 검사와 코드 품질 검사를 위한 설정이 포함되어 있습니다:

1. **TypeScript 타입 검사**: `tsc --noEmit` 명령어를 사용하여 타입 오류가 없는지 확인합니다.
2. **Linting 및 포맷팅**: ESLint와 Prettier를 사용하여 코드 품질과 일관된 코드 스타일을 유지합니다.

이 검사는 `husky`와 `lint-staged`를 통해 커밋 전에 자동으로 실행됩니다. 오류가 발견되면 커밋이 중단됩니다.

### 수동으로 검사 실행하기

다음 명령어로 수동 검사를 실행할 수 있습니다:

```bash
# TypeScript 타입 검사
yarn tsc --noEmit

# ESLint 검사
yarn lint

# Prettier 포맷팅 검사
yarn prettier --check "src/**/*.{ts,tsx}"
```

## 기여하기

1. 이슈를 생성하여 변경 사항을 논의합니다.
2. 새로운 브랜치를 생성합니다.
3. 변경 사항을 커밋합니다.
4. Pull Request를 생성합니다.
