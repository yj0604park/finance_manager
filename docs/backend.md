# 백엔드 개발 가이드

## 프로젝트 개요

이 백엔드 시스템은 개인 재무 관리 애플리케이션을 위한 API 서버를 제공합니다. 사용자 인증, 계좌 관리, 거래 내역 추적, 예산 관리 등의 기능을 REST API 형태로 제공합니다.

## 기술 스택

- **언어**: Node.js 18.x / TypeScript
- **프레임워크**: Express.js
- **데이터베이스**: PostgreSQL 14
- **ORM**: Prisma
- **인증**: JWT (JSON Web Tokens)
- **테스팅**: Jest
- **로깅**: Winston
- **문서화**: Swagger / OpenAPI
- **컨테이너화**: Docker, Docker Compose

## 프로젝트 구조

```
finance_backend/
├── src/
│   ├── config/       # 환경 설정 및 상수
│   ├── controllers/  # API 컨트롤러
│   ├── middleware/   # 미들웨어 (인증, 로깅 등)
│   ├── models/       # 데이터 모델 (Prisma 스키마)
│   ├── routes/       # API 라우트 정의
│   ├── services/     # 비즈니스 로직
│   ├── utils/        # 유틸리티 함수
│   └── app.ts        # 애플리케이션 진입점
├── prisma/           # Prisma 스키마 및 마이그레이션
├── tests/            # 테스트 파일
└── dist/             # 컴파일된 JavaScript 파일
```

## 데이터 모델

### 사용자 (User)

```prisma
model User {
  id           Int       @id @default(autoincrement())
  email        String    @unique
  password     String
  name         String
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  accounts     Account[]
  transactions Transaction[]
}
```

### 계좌 (Account)

```prisma
model Account {
  id           Int       @id @default(autoincrement())
  userId       Int
  name         String
  type         String    // "CHECKING", "SAVINGS", "CREDIT", "INVESTMENT"
  balance      Decimal
  institution  String
  currency     String    @default("KRW")
  isActive     Boolean   @default(true)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  user         User      @relation(fields: [userId], references: [id])
  transactions Transaction[]
}
```

### 거래 내역 (Transaction)

```prisma
model Transaction {
  id           Int       @id @default(autoincrement())
  userId       Int
  accountId    Int
  amount       Decimal
  type         String    // "INCOME", "EXPENSE", "TRANSFER"
  category     String
  description  String?
  date         DateTime
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  user         User      @relation(fields: [userId], references: [id])
  account      Account   @relation(fields: [accountId], references: [id])
}
```

## API 엔드포인트

### 인증 API

- `POST /api/auth/register` - 새 사용자 등록
- `POST /api/auth/login` - 로그인 및 JWT 발급
- `POST /api/auth/refresh` - 토큰 갱신
- `POST /api/auth/logout` - 로그아웃

### 사용자 API

- `GET /api/users/me` - 현재 사용자 정보 조회
- `PUT /api/users/me` - 사용자 정보 수정
- `PUT /api/users/me/password` - 비밀번호 변경

### 계좌 API

- `GET /api/accounts` - 계좌 목록 조회
- `POST /api/accounts` - 새 계좌 추가
- `GET /api/accounts/:id` - 특정 계좌 상세 조회
- `PUT /api/accounts/:id` - 계좌 정보 수정
- `DELETE /api/accounts/:id` - 계좌 삭제

### 거래 내역 API

- `GET /api/transactions` - 거래 내역 목록 조회
- `POST /api/transactions` - 새 거래 내역 추가
- `GET /api/transactions/:id` - 특정 거래 내역 상세 조회
- `PUT /api/transactions/:id` - 거래 내역 수정
- `DELETE /api/transactions/:id` - 거래 내역 삭제

### 통계 API

- `GET /api/stats/monthly` - 월별 수입/지출 통계
- `GET /api/stats/category` - 카테고리별 지출 통계
- `GET /api/stats/balance-history` - 잔액 변화 추이

## 개발 가이드라인

### 코드 스타일

1. **TypeScript 사용**: 모든 코드는 TypeScript로 작성합니다.
2. **비동기 처리**: async/await를 사용하여 Promise를 처리합니다.
3. **에러 처리**: try-catch 구문을 사용하여 예외를 적절히 처리합니다.

예시:
```typescript
async function getUserData(userId: number): Promise<User> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  } catch (error) {
    logger.error(`Failed to get user data: ${error.message}`);
    throw error;
  }
}
```

### API 응답 형식

모든 API 응답은 일관된 형식을 따릅니다:

```typescript
// 성공 응답
{
  success: true,
  data: {
    // 응답 데이터
  }
}

// 에러 응답
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "오류 메시지"
  }
}
```

### 보안 가이드라인

1. **인증 필수**: 모든 API 요청은 인증이 필요합니다(공개 API 제외).
2. **데이터 검증**: 모든 입력 데이터는 유효성 검증을 거쳐야 합니다.
3. **민감 정보 보호**: 비밀번호는 암호화하여 저장하고, 민감한 정보는 로그에 기록하지 않습니다.

## 테스트

1. **단위 테스트**: 모든 서비스 및 유틸리티 함수에 단위 테스트를 작성합니다.
2. **통합 테스트**: API 엔드포인트에 대한 통합 테스트를 작성합니다.
3. **테스트 커버리지**: 80% 이상의 코드 커버리지를 유지합니다.

```bash
# 테스트 실행
npm test

# 커버리지 리포트 생성
npm run test:coverage
```

## 배포 및 실행

### 로컬 개발 환경

```bash
# 종속성 설치
npm install

# 개발 서버 실행
npm run dev

# 데이터베이스 마이그레이션
npx prisma migrate dev
```

### Docker 환경

```bash
# Docker 이미지 빌드 및 실행
docker-compose up --build
```

## 환경 변수

프로젝트는 다음과 같은 환경 변수를 사용합니다:

```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/finance
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

## 문제 해결

1. **데이터베이스 연결 오류**: DATABASE_URL이 올바른지 확인하세요.
2. **마이그레이션 오류**: `npx prisma migrate reset`을 실행하여 데이터베이스를 초기화하세요.
3. **인증 오류**: JWT_SECRET이 올바르게 설정되었는지 확인하세요.

## 참고 자료

- [Express.js 문서](https://expressjs.com/)
- [Prisma 문서](https://www.prisma.io/docs/)
- [JWT 인증 가이드](https://jwt.io/introduction/)
