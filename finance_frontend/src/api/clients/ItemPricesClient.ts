import { OpenAPI } from '../core/OpenAPI';
import { ItemPrice, CreateItemPriceDto, UpdateItemPriceDto } from '../models/ItemPrice';

const baseUrl = '/api/item-prices/';

/**
 * 아이템 가격 관련 API 클라이언트
 */
export class ItemPricesClient {
  /**
   * 모든 아이템 가격 가져오기
   */
  static async getAll(): Promise<ItemPrice[]> {
    const response = await fetch(`${OpenAPI.BASE}${baseUrl}`, {
      method: 'GET',
      headers: OpenAPI.HEADERS ? { ...OpenAPI.HEADERS } : undefined
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch item prices: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * 특정 아이템의 가격 목록 가져오기
   * @param itemId 아이템 ID
   */
  static async getByItemId(itemId: number): Promise<ItemPrice[]> {
    const response = await fetch(`${OpenAPI.BASE}${baseUrl}?item=${itemId}`, {
      method: 'GET',
      headers: OpenAPI.HEADERS ? { ...OpenAPI.HEADERS } : undefined
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch prices for item ${itemId}: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * 아이템 가격 상세 정보 가져오기
   * @param id 아이템 가격 ID
   */
  static async getById(id: number): Promise<ItemPrice> {
    const response = await fetch(`${OpenAPI.BASE}${baseUrl}${id}/`, {
      method: 'GET',
      headers: OpenAPI.HEADERS ? { ...OpenAPI.HEADERS } : undefined
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch item price ${id}: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * 아이템 가격 생성
   * @param data 아이템 가격 데이터
   */
  static async create(data: CreateItemPriceDto): Promise<ItemPrice> {
    const response = await fetch(`${OpenAPI.BASE}${baseUrl}`, {
      method: 'POST',
      headers: {
        ...(OpenAPI.HEADERS ? OpenAPI.HEADERS : {}),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Failed to create item price: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * 아이템 가격 수정
   * @param id 아이템 가격 ID
   * @param data 수정할 아이템 가격 데이터
   */
  static async update(id: number, data: UpdateItemPriceDto): Promise<ItemPrice> {
    const response = await fetch(`${OpenAPI.BASE}${baseUrl}${id}/`, {
      method: 'PUT',
      headers: {
        ...(OpenAPI.HEADERS ? OpenAPI.HEADERS : {}),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Failed to update item price ${id}: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * 아이템 가격 삭제
   * @param id 아이템 가격 ID
   */
  static async delete(id: number): Promise<void> {
    const response = await fetch(`${OpenAPI.BASE}${baseUrl}${id}/`, {
      method: 'DELETE',
      headers: OpenAPI.HEADERS ? { ...OpenAPI.HEADERS } : undefined
    });

    if (!response.ok) {
      throw new Error(`Failed to delete item price ${id}: ${response.statusText}`);
    }
  }
}
