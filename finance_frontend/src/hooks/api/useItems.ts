import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ItemsWrapper } from '../../api/wrappers';
import { Item } from '../../api/models/Item';
import { PatchedItem } from '../../api/models/PatchedItem';

// 쿼리 키 상수
export const ITEMS_QUERY_KEY = 'items';

/**
 * 모든 아이템 정보를 가져오는 훅
 */
export function useItems() {
  return useQuery({
    queryKey: [ITEMS_QUERY_KEY],
    queryFn: () => ItemsWrapper.getAll(),
  });
}

/**
 * 특정 ID의 아이템 정보를 가져오는 훅
 */
export function useItem(id?: number) {
  return useQuery({
    queryKey: [ITEMS_QUERY_KEY, id],
    queryFn: () => ItemsWrapper.getById(id!),
    enabled: !!id,
  });
}

/**
 * 새 아이템 정보를 생성하는 훅
 */
export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Item) => ItemsWrapper.create(data),
    onSuccess: () => {
      // 아이템 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: [ITEMS_QUERY_KEY] });
    },
  });
}

/**
 * 아이템 정보를 업데이트하는 훅
 */
export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Item }) =>
      ItemsWrapper.update(id, data),
    onSuccess: (updatedItem) => {
      // 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: [ITEMS_QUERY_KEY] });
      // 개별 항목 캐시 업데이트
      queryClient.setQueryData(
        [ITEMS_QUERY_KEY, updatedItem.id],
        updatedItem
      );
    },
  });
}

/**
 * 아이템 정보를 부분 업데이트하는 훅
 */
export function usePartialUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PatchedItem }) =>
      ItemsWrapper.partialUpdate(id, data),
    onSuccess: (updatedItem) => {
      // 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: [ITEMS_QUERY_KEY] });
      // 개별 항목 캐시 업데이트
      queryClient.setQueryData(
        [ITEMS_QUERY_KEY, updatedItem.id],
        updatedItem
      );
    },
  });
}

/**
 * 아이템 정보를 삭제하는 훅
 */
export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ItemsWrapper.delete(id),
    onSuccess: (_data, id) => {
      // 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: [ITEMS_QUERY_KEY] });
      // 개별 항목 캐시 제거
      queryClient.removeQueries({ queryKey: [ITEMS_QUERY_KEY, id] });
    },
  });
}
