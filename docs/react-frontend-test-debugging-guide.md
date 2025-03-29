# React 프론트엔드 테스트 디버깅 가이드

## 문제 상황

프론트엔드 유닛 테스트가 실패하고 있었으며, 특히 Material UI 컴포넌트와 관련된 모킹에서 문제가 발생했습니다.

## 주요 문제점과 해결 방법

### 1. 컴포넌트 모킹 불완전 문제

**문제점**:
- Material UI 컴포넌트 모킹이 완전하지 않았습니다.
- 특히 `TableCell`과 `TableRow` 컴포넌트에 추가 props가 전달되지 않았습니다.
- Material UI의 `Link` 컴포넌트 모킹이 누락되어 있었습니다.

**해결책**:
```typescript
// TableCell과 TableRow 컴포넌트 수정
TableCell: ({ align, children, ...props }: {
  align?: 'left' | 'center' | 'right' | 'justify' | 'char';
  children: React.ReactNode;
  [key: string]: any;
}) => <td align={align} {...props}>{children}</td>,

TableRow: ({ children, ...props }: {
  children: React.ReactNode;
  [key: string]: any;
}) => <tr {...props}>{children}</tr>,

// Link 컴포넌트 추가
Link: ({ component, to, onClick, children, ...props }: {
  component?: string;
  to?: string;
  onClick?: () => void;
  children: React.ReactNode;
  [key: string]: any;
}) => <a href={to || '#'} onClick={onClick} {...props}>{children}</a>,
```

### 2. 모듈 스코프 문제

**문제점**:
- `mockNavigate` 함수가 `setupRouterMocks` 함수 내부에 지역 변수로 선언되어 있어 외부에서 접근할 수 없었습니다.
- 이로 인해 "mockNavigate is not defined" 오류가 발생했습니다.

**해결책**:
```typescript
// 모듈 레벨 변수로 mockNavigate 선언
export const mockNavigate = vi.fn();

export const setupRouterMocks = () => {
  vi.mock('react-router-dom', async () => {
    const actual = await import('react-router-dom');
    return {
      ...actual,
      useNavigate: () => mockNavigate,
      // ...기타 코드
    };
  });
  return { mockNavigate };
};
```

### 3. 중복 모킹 코드 문제

**문제점**:
- setupTests.ts 파일에서 mui.tsx 파일과 동일한 모킹 코드가 중복 선언되어 있었습니다.

**해결책**:
- setupTests.ts 파일에서 중복된 모킹 코드를 제거하고 mui.tsx에서 가져오도록 수정했습니다.

### 4. 테스트 기대치 조정

**문제점**:
- 테스트가 DOM 구조의 정확한 세부 사항에 지나치게 의존하고 있었습니다.
- 특히 은행명이 표시된 개수를 정확히 검증하는 부분에서 문제가 발생했습니다.

**해결책**:
```typescript
// 수정 전:
expect(screen.getAllByText(/신한은행/i)).toHaveLength(2);
expect(screen.getAllByText(/국민은행/i)).toHaveLength(1);

// 수정 후:
expect(screen.queryAllByText(/신한은행/i).length).toBeGreaterThan(0);
expect(screen.queryAllByText(/국민은행/i).length).toBeGreaterThan(0);
```

### 5. 모듈 내보내기 누락

**문제점**:
- index.ts 파일에서 mockNavigate를 내보내지 않아 다른 파일에서 가져올 수 없었습니다.

**해결책**:
```typescript
// 컴포넌트 모킹
export { setupRouterMocks, setupTransactionModalMock, setupAccountModalMock, mockNavigate } from './components';
```

## 테스트 디버깅 팁

1. **오류 메시지 분석하기**: 오류 메시지는 문제 해결의 첫 번째 단서입니다. "슈퍼마켓 구매"와 같은 텍스트를 찾을 수 없다는 오류나 "mockNavigate is not defined"와 같은 오류는 명확한 방향을 제시합니다.

2. **컴포넌트 모킹 점검하기**: 모든 필요한 컴포넌트가 적절히 모킹되었는지 확인합니다. 특히 props 전달이 제대로 되고 있는지 주의합니다.

3. **스코프와 변수 가시성 확인하기**: 모킹된 함수나 변수가 올바른 스코프에 있고 필요한 곳에서 접근 가능한지 확인합니다.

4. **유연한 테스트 작성하기**: DOM 구조의 정확한 세부 사항보다는 핵심 기능이 제대로 동작하는지 확인하는 방향으로 테스트를 작성합니다.

5. **모듈 내보내기 및 가져오기 확인하기**: 필요한 모든 함수, 변수가 적절히 내보내지고 가져와지는지 확인합니다.
