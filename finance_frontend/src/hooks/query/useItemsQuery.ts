import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ItemsClient } from '../../api/clients/ItemsClient';
import { Item, CreateItemDto, UpdateItemDto } from '../../api/models/Item';
import { FilterFunction } from '../../types/filter';

// 쿼리 키
export const itemsKeys = {
  all: ['items'] as const,
  lists: () => [...itemsKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...itemsKeys.lists(), filters] as const,
  details: () => [...itemsKeys.all, 'detail'] as const,
  detail: (id: number) => [...itemsKeys.details(), id] as const,
};

/**
 * 아이템 목록 조회 쿼리 훅
 * @param filterFn 클라이언트 필터링 함수 (선택사항)
 */
export const useItemsQuery = (filterFn?: FilterFunction<Item>) => {
  return useQuery({
    queryKey: itemsKeys.lists(),
    queryFn: async () => {
      const items = await ItemsClient.getAll();

      // 클라이언트 측 필터링 적용 (필요한 경우)
      if (filterFn) {
        return items.filter(filterFn);
      }

      return items;
    },
  });
};

/**
 * 아이템 상세 조회 쿼리 훅
 * @param id 아이템 ID
 */
export const useItemQuery = (id?: number) => {
  return useQuery({
    queryKey: itemsKeys.detail(id || 0),
    queryFn: () => ItemsClient.getById(id!),
    enabled: !!id, // id가 유효할 때만 쿼리 실행
  });
};

/**
 * 아이템 생성 뮤테이션 훅
 */
export const useCreateItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateItemDto) => ItemsClient.create(data),
    onSuccess: () => {
      // 아이템 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: itemsKeys.lists() });
    },
  });
};

/**
 * 아이템 수정 뮤테이션 훅
 */
export const useUpdateItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateItemDto }) =>
      ItemsClient.update(id, data),
    onSuccess: (_, variables) => {
      // 변경된 아이템 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: itemsKeys.detail(variables.id) });
      // 목록 쿼리도 무효화
      queryClient.invalidateQueries({ queryKey: itemsKeys.lists() });
    },
  });
};

/**
 * 아이템 삭제 뮤테이션 훅
 */
export const useDeleteItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ItemsClient.delete(id),
    onSuccess: (_, id) => {
      // 삭제된 아이템 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: itemsKeys.detail(id) });
      // 목록 쿼리도 무효화
      queryClient.invalidateQueries({ queryKey: itemsKeys.lists() });
    },
  });
};
