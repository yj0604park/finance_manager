import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ItemPricesWrapper } from '../../api/wrappers';
import { ItemPrice } from '../../api/models/ItemPrice';
import { PatchedItemPrice } from '../../api/models/PatchedItemPrice';

// 쿼리 키 상수
export const ITEM_PRICES_QUERY_KEY = 'itemPrices';

/**
 * 모든 아이템 가격 정보를 가져오는 훅
 */
export function useItemPrices() {
  return useQuery({
    queryKey: [ITEM_PRICES_QUERY_KEY],
    queryFn: () => ItemPricesWrapper.getAll(),
  });
}

/**
 * 특정 아이템의 가격 목록을 가져오는 훅
 */
export function useItemPricesByItem(itemId: number) {
  return useQuery({
    queryKey: [ITEM_PRICES_QUERY_KEY, 'byItem', itemId],
    queryFn: () => ItemPricesWrapper.getByItemId(itemId),
    enabled: !!itemId,
  });
}

/**
 * 특정 ID의 아이템 가격 정보를 가져오는 훅
 */
export function useItemPrice(id?: number) {
  return useQuery({
    queryKey: [ITEM_PRICES_QUERY_KEY, id],
    queryFn: () => ItemPricesWrapper.getById(id!),
    enabled: !!id,
  });
}

/**
 * 새 아이템 가격 정보를 생성하는 훅
 */
export function useCreateItemPrice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ItemPrice) => ItemPricesWrapper.create(data),
    onSuccess: (newItemPrice) => {
      // 아이템 가격 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: [ITEM_PRICES_QUERY_KEY] });
      // 해당 아이템의 가격 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: [ITEM_PRICES_QUERY_KEY, 'byItem', newItemPrice.item]
      });
    },
  });
}

/**
 * 아이템 가격 정보를 업데이트하는 훅
 */
export function useUpdateItemPrice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ItemPrice }) =>
      ItemPricesWrapper.update(id, data),
    onSuccess: (updatedItemPrice) => {
      // 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: [ITEM_PRICES_QUERY_KEY] });
      // 해당 아이템의 가격 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: [ITEM_PRICES_QUERY_KEY, 'byItem', updatedItemPrice.item]
      });
      // 개별 항목 캐시 업데이트
      queryClient.setQueryData(
        [ITEM_PRICES_QUERY_KEY, updatedItemPrice.id],
        updatedItemPrice
      );
    },
  });
}

/**
 * 아이템 가격 정보를 부분 업데이트하는 훅
 */
export function usePartialUpdateItemPrice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PatchedItemPrice }) =>
      ItemPricesWrapper.partialUpdate(id, data),
    onSuccess: (updatedItemPrice) => {
      // 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: [ITEM_PRICES_QUERY_KEY] });
      // 해당 아이템의 가격 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: [ITEM_PRICES_QUERY_KEY, 'byItem', updatedItemPrice.item]
      });
      // 개별 항목 캐시 업데이트
      queryClient.setQueryData(
        [ITEM_PRICES_QUERY_KEY, updatedItemPrice.id],
        updatedItemPrice
      );
    },
  });
}

/**
 * 아이템 가격 정보를 삭제하는 훅
 */
export function useDeleteItemPrice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ItemPricesWrapper.delete(id),
    onSuccess: (_data, id) => {
      // 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: [ITEM_PRICES_QUERY_KEY] });
      // 개별 항목 캐시 제거
      queryClient.removeQueries({ queryKey: [ITEM_PRICES_QUERY_KEY, id] });
      // 참고: 여기서는 아이템 ID를 알 수 없어 해당 아이템의 가격 목록 캐시를 무효화할 수 없음
    },
  });
}

/**
 * 아이템 가격 정보를 삭제하는 훅 (아이템 ID 알고 있는 경우)
 */
export function useDeleteItemPriceWithItemId(itemId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ItemPricesWrapper.delete(id),
    onSuccess: (_data, id) => {
      // 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: [ITEM_PRICES_QUERY_KEY] });
      // 해당 아이템의 가격 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: [ITEM_PRICES_QUERY_KEY, 'byItem', itemId]
      });
      // 개별 항목 캐시 제거
      queryClient.removeQueries({ queryKey: [ITEM_PRICES_QUERY_KEY, id] });
    },
  });
}
