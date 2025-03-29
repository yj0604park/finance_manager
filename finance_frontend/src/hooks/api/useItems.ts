import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ItemsWrapper } from '../../api/wrappers';
import { Item } from '../../api/models/Item';
import { PatchedItem } from '../../api/models/PatchedItem';

/**
 * 아이템 목록을 가져오는 훅
 */
export const useItems = () => {
  return useQuery({
    queryKey: ['items'],
    queryFn: () => ItemsWrapper.getAll()
  });
};

/**
 * 특정 아이템을 가져오는 훅
 */
export const useItem = (id: number) => {
  return useQuery({
    queryKey: ['items', id],
    queryFn: () => ItemsWrapper.getById(id),
    enabled: !!id // id가 존재할 때만 쿼리 실행
  });
};

/**
 * 아이템 생성 훅
 */
export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Item) => ItemsWrapper.create(data),
    onSuccess: () => {
      // 아이템 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['items'] });
    }
  });
};

/**
 * 아이템 업데이트 훅
 */
export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Item }) =>
      ItemsWrapper.update(id, data),
    onSuccess: (updated: Item) => {
      // 아이템 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['items'] });
      // 특정 아이템 캐시 업데이트
      queryClient.setQueryData(['items', updated.id], updated);
    }
  });
};

/**
 * 아이템 부분 업데이트 훅
 */
export const usePartialUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PatchedItem }) =>
      ItemsWrapper.partialUpdate(id, data),
    onSuccess: (updated: Item) => {
      // 아이템 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['items'] });
      // 특정 아이템 캐시 업데이트
      queryClient.setQueryData(['items', updated.id], updated);
    }
  });
};

/**
 * 아이템 삭제 훅
 */
export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ItemsWrapper.delete(id),
    onSuccess: (_, id) => {
      // 아이템 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['items'] });
      // 특정 아이템 캐시 제거
      queryClient.removeQueries({ queryKey: ['items', id] });
    }
  });
};
