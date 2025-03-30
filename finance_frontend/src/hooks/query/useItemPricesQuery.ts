import {
  useItemPrices,
  useItemPricesByItem,
  useItemPrice,
  useCreateItemPrice,
  useUpdateItemPrice,
  useDeleteItemPrice,
  useDeleteItemPriceWithItemId,
  ITEM_PRICES_QUERY_KEY
} from '../api/useItemPrices';
import { ItemPrice } from '../../api/models/ItemPrice';
import { FilterFunction } from '../../types/filter';

// 쿼리 키
export const itemPricesKeys = {
  all: [ITEM_PRICES_QUERY_KEY] as const,
  lists: () => [...itemPricesKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...itemPricesKeys.lists(), filters] as const,
  byItem: (itemId: number) => [...itemPricesKeys.lists(), { itemId }] as const,
  details: () => [...itemPricesKeys.all, 'detail'] as const,
  detail: (id: number) => [...itemPricesKeys.details(), id] as const,
};

/**
 * 아이템 가격 목록 조회 쿼리 훅
 * @param filterFn 클라이언트 필터링 함수 (선택사항)
 * @deprecated - 새로운 useItemPrices 훅 사용을 권장
 */
export const useItemPricesQuery = (filterFn?: FilterFunction<ItemPrice>) => {
  const { data, ...rest } = useItemPrices();

  // 필터링된 데이터 반환
  return {
    ...rest,
    data: data && filterFn ? data.filter(filterFn) : data,
  };
};

/**
 * 특정 아이템의 가격 목록 조회 쿼리 훅
 * @param itemId 아이템 ID
 * @deprecated - 새로운 useItemPricesByItem 훅 사용을 권장
 */
export const useItemPricesByItemQuery = (itemId: number) => {
  return useItemPricesByItem(itemId);
};

/**
 * 아이템 가격 상세 조회 쿼리 훅
 * @param id 아이템 가격 ID
 * @deprecated - 새로운 useItemPrice 훅 사용을 권장
 */
export const useItemPriceQuery = (id?: number) => {
  return useItemPrice(id);
};

/**
 * 아이템 가격 생성 뮤테이션 훅
 * @deprecated - 새로운 useCreateItemPrice 훅 사용을 권장
 */
export const useCreateItemPriceMutation = () => {
  return useCreateItemPrice();
};

/**
 * 아이템 가격 수정 뮤테이션 훅
 * @deprecated - 새로운 useUpdateItemPrice 훅 사용을 권장
 */
export const useUpdateItemPriceMutation = () => {
  return useUpdateItemPrice();
};

/**
 * 아이템 가격 삭제 뮤테이션 훅
 * @deprecated - 새로운 useDeleteItemPrice 또는 useDeleteItemPriceWithItemId 훅 사용을 권장
 */
export const useDeleteItemPriceMutation = (itemId?: number) => {
  return itemId
    ? useDeleteItemPriceWithItemId(itemId)
    : useDeleteItemPrice();
};
