import {
  useItems,
  useItem,
  useCreateItem,
  useUpdateItem,
  useDeleteItem,
  ITEMS_QUERY_KEY
} from '../api/useItems';
import { Item } from '../../api/models/Item';
import { FilterFunction } from '../../types/filter';

// 쿼리 키
export const itemsKeys = {
  all: [ITEMS_QUERY_KEY] as const,
  lists: () => [...itemsKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...itemsKeys.lists(), filters] as const,
  details: () => [...itemsKeys.all, 'detail'] as const,
  detail: (id: number) => [...itemsKeys.details(), id] as const,
};

/**
 * 아이템 목록 조회 쿼리 훅
 * @param filterFn 클라이언트 필터링 함수 (선택사항)
 * @deprecated - 새로운 useItems 훅 사용을 권장
 */
export const useItemsQuery = (filterFn?: FilterFunction<Item>) => {
  const { data, ...rest } = useItems();

  // 필터링된 데이터 반환
  return {
    ...rest,
    data: data && filterFn ? data.filter(filterFn) : data,
  };
};

/**
 * 아이템 상세 조회 쿼리 훅
 * @param id 아이템 ID
 * @deprecated - 새로운 useItem 훅 사용을 권장
 */
export const useItemQuery = (id?: number) => {
  return useItem(id);
};

/**
 * 아이템 생성 뮤테이션 훅
 * @deprecated - 새로운 useCreateItem 훅 사용을 권장
 */
export const useCreateItemMutation = () => {
  return useCreateItem();
};

/**
 * 아이템 수정 뮤테이션 훅
 * @deprecated - 새로운 useUpdateItem 훅 사용을 권장
 */
export const useUpdateItemMutation = () => {
  return useUpdateItem();
};

/**
 * 아이템 삭제 뮤테이션 훅
 * @deprecated - 새로운 useDeleteItem 훅 사용을 권장
 */
export const useDeleteItemMutation = () => {
  return useDeleteItem();
};
