import { OpenAPI } from '../core/OpenAPI';
import { Item, CreateItemDto, UpdateItemDto } from '../models/Item';

const baseUrl = '/api/items/';

/**
 * 아이템 관련 API 클라이언트
 */
export class ItemsClient {
  /**
   * 모든 아이템 가져오기
   */
  static async getAll(): Promise<Item[]> {
    const response = await fetch(`${OpenAPI.BASE}${baseUrl}`, {
      method: 'GET',
      headers: OpenAPI.HEADERS ? { ...OpenAPI.HEADERS } : undefined
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch items: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * 아이템 상세 정보 가져오기
   * @param id 아이템 ID
   */
  static async getById(id: number): Promise<Item> {
    const response = await fetch(`${OpenAPI.BASE}${baseUrl}${id}/`, {
      method: 'GET',
      headers: OpenAPI.HEADERS ? { ...OpenAPI.HEADERS } : undefined
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch item ${id}: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * 아이템 생성
   * @param data 아이템 데이터
   */
  static async create(data: CreateItemDto): Promise<Item> {
    const response = await fetch(`${OpenAPI.BASE}${baseUrl}`, {
      method: 'POST',
      headers: {
        ...(OpenAPI.HEADERS ? OpenAPI.HEADERS : {}),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Failed to create item: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * 아이템 수정
   * @param id 아이템 ID
   * @param data 수정할 아이템 데이터
   */
  static async update(id: number, data: UpdateItemDto): Promise<Item> {
    const response = await fetch(`${OpenAPI.BASE}${baseUrl}${id}/`, {
      method: 'PUT',
      headers: {
        ...(OpenAPI.HEADERS ? OpenAPI.HEADERS : {}),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Failed to update item ${id}: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * 아이템 삭제
   * @param id 아이템 ID
   */
  static async delete(id: number): Promise<void> {
    const response = await fetch(`${OpenAPI.BASE}${baseUrl}${id}/`, {
      method: 'DELETE',
      headers: OpenAPI.HEADERS ? { ...OpenAPI.HEADERS } : undefined
    });

    if (!response.ok) {
      throw new Error(`Failed to delete item ${id}: ${response.statusText}`);
    }
  }
}
