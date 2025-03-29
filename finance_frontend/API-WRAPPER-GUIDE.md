# API 래퍼 패턴 사용 가이드

## 개요

이 문서는 finance_frontend 프로젝트에서 사용하는 API 래퍼 패턴에 대한 상세 가이드입니다. 이 패턴은 자동 생성된 OpenAPI 클라이언트 코드를 직접 수정하지 않고 확장하여, 백엔드 API 변경 시 프론트엔드 코드를 쉽게 갱신할 수 있게 합니다.

## 디렉토리 구조

```
finance_frontend/src/
├── api/
│   ├── core/            # 자동 생성된 OpenAPI 코어 기능 (수정 금지)
│   ├── models/          # 자동 생성된 모델 타입 (수정 금지)
│   ├── services/        # 자동 생성된 API 서비스 (수정 금지)
│   ├── wrappers/        # 커스텀 래퍼 클래스 (여기만 수정)
│   │   ├── index.ts     # 모든 래퍼 내보내기
│   │   ├── AccountsWrapper.ts
│   │   ├── TransactionsWrapper.ts
│   │   └── ...
│   ├── client.ts        # API 클라이언트 설정 및 인증 로직
│   └── index.ts         # 자동 생성된 API 내보내기 (수정 금지)
├── hooks/
│   ├── api/             # React Query 훅
│   │   ├── index.ts     # 모든 API 훅 내보내기
│   │   ├── useAccounts.ts
│   │   └── ...
├── types/
│   ├── models.ts        # 내부 앱 모델 타입 정의
├── utils/
│   ├── typeConverters.ts # API 모델 <-> 앱 모델 변환 로직
```

## OpenAPI 스펙 변경 시 절차

백엔드 API 스펙이 변경되면 다음 순서로 작업합니다:

1. OpenAPI 스펙 파일 동기화 및 API 클라이언트 재생성:
   ```powershell
   ./sync-openapi-spec.ps1
   ```

2. 모든 테스트 실행하여 문제 확인:
   ```powershell
   cd finance_frontend
   yarn test:run
   ```

3. 래퍼 클래스 업데이트:
   - 새로운 필드나 메서드가 필요한 경우, 래퍼 클래스(`/api/wrappers/`)를 수정
   - 자동 생성된 파일(`/api/core/`, `/api/models/`, `/api/services/`)은 절대 직접 수정하지 말 것

4. 필요한 경우 React Query 훅도 업데이트(`/hooks/api/`)

## 새 API 엔드포인트 래핑 가이드

### 1. 타입 변환 로직 구현

새로운 API 엔드포인트에 대한 모델이 필요하면 다음 단계를 따릅니다:

1. `src/types/models.ts`에 내부 앱 모델 인터페이스 추가:
   ```typescript
   export interface NewEntity extends BaseEntity {
     name: string;
     description: string;
     // ...기타 필요한 필드
   }
   ```

2. `src/utils/typeConverters.ts`에 변환 함수 추가:
   ```typescript
   import { NewEntity as ApiNewEntity } from '../api/models/NewEntity';
   import { NewEntity } from '../types/models';

   export const convertApiToNewEntity = (apiEntity: ApiNewEntity): NewEntity => {
     return {
       id: apiEntity.id,
       name: apiEntity.name,
       // ...기타 필드 변환
     };
   };

   export const convertNewEntityToApi = (entity: Partial<NewEntity>): Partial<ApiNewEntity> => {
     return {
       id: entity.id,
       name: entity.name,
       // ...기타 필드 변환
     };
   };
   ```

### 2. 래퍼 클래스 작성

래퍼 클래스는 다음 구조를 따릅니다:

1. `src/api/wrappers/NewEntityWrapper.ts` 생성:
   ```typescript
   import { NewEntityService } from '../services/NewEntityService';
   import { NewEntity as ApiNewEntity } from '../models/NewEntity';
   import { NewEntity } from '../../types/models';
   import { convertApiToNewEntity, convertNewEntityToApi } from '../../utils/typeConverters';

   export class NewEntityWrapper {
     // 목록 조회
     static async getAll(): Promise<NewEntity[]> {
       try {
         const response = await NewEntityService.newEntitiesList();
         return response.map(convertApiToNewEntity);
       } catch (error) {
         console.error('Failed to fetch entities', error);
         throw error;
       }
     }

     // 상세 조회
     static async getById(id: number): Promise<NewEntity> {
       try {
         const response = await NewEntityService.newEntitiesRetrieve(id);
         return convertApiToNewEntity(response);
       } catch (error) {
         console.error(`Failed to fetch entity with id ${id}`, error);
         throw error;
       }
     }

     // 생성
     static async create(data: Omit<NewEntity, 'id'>): Promise<NewEntity> {
       try {
         const apiData = convertNewEntityToApi(data);
         const response = await NewEntityService.newEntitiesCreate(apiData as ApiNewEntity);
         return convertApiToNewEntity(response);
       } catch (error) {
         console.error('Failed to create entity', error);
         throw error;
       }
     }

     // 수정
     static async update(id: number, data: Partial<NewEntity>): Promise<NewEntity> {
       try {
         const apiData = convertNewEntityToApi({ ...data, id });
         const response = await NewEntityService.newEntitiesUpdate(id, apiData as ApiNewEntity);
         return convertApiToNewEntity(response);
       } catch (error) {
         console.error(`Failed to update entity with id ${id}`, error);
         throw error;
       }
     }

     // 삭제
     static async delete(id: number): Promise<void> {
       try {
         await NewEntityService.newEntitiesDestroy(id);
       } catch (error) {
         console.error(`Failed to delete entity with id ${id}`, error);
         throw error;
       }
     }
   }
   ```

2. `src/api/wrappers/index.ts`에 내보내기 추가:
   ```typescript
   export { NewEntityWrapper } from './NewEntityWrapper';
   ```

### 3. React Query 훅 작성

1. `src/hooks/api/useNewEntities.ts` 생성:
   ```typescript
   import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
   import { NewEntityWrapper } from '../../api/wrappers';
   import type { NewEntity } from '../../types/models';

   // 목록 조회 훅
   export const useNewEntities = () => {
     return useQuery({
       queryKey: ['newEntities'],
       queryFn: () => NewEntityWrapper.getAll()
     });
   };

   // 상세 조회 훅
   export const useNewEntity = (id: number) => {
     return useQuery({
       queryKey: ['newEntities', id],
       queryFn: () => NewEntityWrapper.getById(id),
       enabled: !!id
     });
   };

   // 생성 훅
   export const useCreateNewEntity = () => {
     const queryClient = useQueryClient();

     return useMutation({
       mutationFn: (data: Omit<NewEntity, 'id'>) => NewEntityWrapper.create(data),
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['newEntities'] });
       }
     });
   };

   // 수정 훅
   export const useUpdateNewEntity = () => {
     const queryClient = useQueryClient();

     return useMutation({
       mutationFn: ({ id, data }: { id: number; data: Partial<NewEntity> }) =>
         NewEntityWrapper.update(id, data),
       onSuccess: (updated) => {
         queryClient.invalidateQueries({ queryKey: ['newEntities'] });
         queryClient.setQueryData(['newEntities', updated.id], updated);
       }
     });
   };

   // 삭제 훅
   export const useDeleteNewEntity = () => {
     const queryClient = useQueryClient();

     return useMutation({
       mutationFn: (id: number) => NewEntityWrapper.delete(id),
       onSuccess: (_, id) => {
         queryClient.invalidateQueries({ queryKey: ['newEntities'] });
         queryClient.removeQueries({ queryKey: ['newEntities', id] });
       }
     });
   };
   ```

2. `src/hooks/api/index.ts`에 내보내기 추가:
   ```typescript
   export * from './useNewEntities';
   ```

## 컴포넌트에서 사용 예시

```tsx
import { useNewEntities, useCreateNewEntity } from '../hooks/api';

const NewEntityList = () => {
  const { data: entities, isLoading, error } = useNewEntities();
  const createMutation = useCreateNewEntity();

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;

  const handleCreate = () => {
    createMutation.mutate({
      name: 'New Entity',
      description: 'Description'
    });
  };

  return (
    <div>
      <button onClick={handleCreate}>새로 만들기</button>
      {entities?.map(entity => (
        <div key={entity.id}>{entity.name}</div>
      ))}
    </div>
  );
};
```

## 주의사항

1. **자동 생성 코드 수정 금지**
   - `/api/core/`, `/api/models/`, `/api/services/`, `/api/index.ts`는 절대 수정하지 말 것
   - 이 파일들은 OpenAPI 스펙이 변경되면 덮어써짐

2. **수정 작업이 필요할 때**
   - 항상 래퍼 클래스(`/api/wrappers/`)를 통해 수정
   - 타입 변환 로직은 `typeConverters.ts`에 구현

3. **프로젝트에서 클라이언트 사용 시**
   - 자동 생성된 서비스를 직접 호출하지 말고, 항상 래퍼 클래스를 통해 사용
   ```typescript
   // ❌ 잘못된 방법
   import { NewEntityService } from '../api/services/NewEntityService';
   const entities = await NewEntityService.newEntitiesList();

   // ✅ 올바른 방법
   import { NewEntityWrapper } from '../api/wrappers';
   const entities = await NewEntityWrapper.getAll();

   // ✅ 더 좋은 방법 (React 컴포넌트에서)
   import { useNewEntities } from '../hooks/api';
   const { data: entities } = useNewEntities();
   ```

## 문제 해결

### 1. API 반환 타입이 변경된 경우

1. `sync-openapi-spec.ps1` 스크립트 실행
2. `typeConverters.ts`의 변환 함수 업데이트
3. 필요하면 `models.ts`의 내부 타입도 업데이트

### 2. 새 인증 메커니즘 추가 필요

`client.ts` 파일에서 인증 관련 로직을 수정하세요. (이 파일은 자동 생성되지 않음)

### 3. 래퍼 클래스와 React Query 훅 간 불일치

API 변경 후 래퍼 클래스는 업데이트했지만 React Query 훅을 업데이트하지 않은 경우 발생합니다.
항상 래퍼 클래스 업데이트 후 관련 훅도 함께 업데이트하세요.
