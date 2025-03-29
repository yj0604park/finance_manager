import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ItemPricesClient } from '../../api/clients/ItemPricesClient';
import { ItemPrice, CreateItemPriceDto, UpdateItemPriceDto } from '../../api/models/ItemPrice';
import { FilterFunction } from '../../types/filter';

// 쿼리 키
export const itemPricesKeys = {
  all: ['itemPrices'] as const,
  lists: () => [...itemPricesKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...itemPricesKeys.lists(), filters] as const,
  byItem: (itemId: number) => [...itemPricesKeys.lists(), { itemId }] as const,
  details: () => [...itemPricesKeys.all, 'detail'] as const,
  detail: (id: number) => [...itemPricesKeys.details(), id] as const,
};

/**
 * 아이템 가격 목록 조회 쿼리 훅
 * @param filterFn 클라이언트 필터링 함수 (선택사항)
 */
export const useItemPricesQuery = (filterFn?: FilterFunction<ItemPrice>) => {
  return useQuery({
    queryKey: itemPricesKeys.lists(),
    queryFn: async () => {
      const prices = await ItemPricesClient.getAll();

      // 클라이언트 측 필터링 적용 (필요한 경우)
      if (filterFn) {
        return prices.filter(filterFn);
      }

      return prices;
    },
  });
};

/**
 * 특정 아이템의 가격 목록 조회 쿼리 훅
 * @param itemId 아이템 ID
 */
export const useItemPricesByItemQuery = (itemId: number) => {
  return useQuery({
    queryKey: itemPricesKeys.byItem(itemId),
    queryFn: () => ItemPricesClient.getByItemId(itemId),
    enabled: !!itemId, // itemId가 유효할 때만 쿼리 실행
  });
};

/**
 * 아이템 가격 상세 조회 쿼리 훅
 * @param id 아이템 가격 ID
 */
export const useItemPriceQuery = (id?: number) => {
  return useQuery({
    queryKey: itemPricesKeys.detail(id || 0),
    queryFn: () => ItemPricesClient.getById(id!),
    enabled: !!id, // id가 유효할 때만 쿼리 실행
  });
};

/**
 * 아이템 가격 생성 뮤테이션 훅
 */
export const useCreateItemPriceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateItemPriceDto) => ItemPricesClient.create(data),
    onSuccess: (_, variables) => {
      // 아이템 가격 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: itemPricesKeys.lists() });
      // 해당 아이템의 가격 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: itemPricesKeys.byItem(variables.item) });
    },
  });
};

/**
 * 아이템 가격 수정 뮤테이션 훅
 */
export const useUpdateItemPriceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateItemPriceDto }) =>
      ItemPricesClient.update(id, data),
    onSuccess: (result, variables) => {
      // 변경된 아이템 가격 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: itemPricesKeys.detail(variables.id) });
      // 해당 아이템의 가격 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: itemPricesKeys.byItem(result.item) });
      // 전체 목록 쿼리도 무효화
      queryClient.invalidateQueries({ queryKey: itemPricesKeys.lists() });
    },
  });
};

/**
 * 아이템 가격 삭제 뮤테이션 훅
 */
export const useDeleteItemPriceMutation = (itemId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ItemPricesClient.delete(id),
    onSuccess: (_, id) => {
      // 삭제된 아이템 가격 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: itemPricesKeys.detail(id) });
      // 해당 아이템의 가격 목록 쿼리 무효화 (itemId가 있는 경우)
      if (itemId) {
        queryClient.invalidateQueries({ queryKey: itemPricesKeys.byItem(itemId) });
      }
      // 전체 목록 쿼리도 무효화
      queryClient.invalidateQueries({ queryKey: itemPricesKeys.lists() });
    },
  });
};
