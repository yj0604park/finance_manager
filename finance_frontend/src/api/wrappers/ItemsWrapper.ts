import { ItemsService } from '../services/ItemsService';
import { Item } from '../models/Item';
import { PatchedItem } from '../models/PatchedItem';

/**
 * 아이템 API 래퍼 클래스
 * 자동 생성된 서비스에 대한 타입 안전한 인터페이스 제공
 */
export class ItemsWrapper {
  /**
   * 모든 아이템 가져오기
   */
  static async getAll(): Promise<Item[]> {
    try {
      return await ItemsService.itemsList();
    } catch (error) {
      console.error('Failed to fetch items', error);
      throw error;
    }
  }

  /**
   * 특정 아이템 정보 가져오기
   */
  static async getById(id: number): Promise<Item> {
    try {
      return await ItemsService.itemsRetrieve(id);
    } catch (error) {
      console.error(`Failed to fetch item with id ${id}`, error);
      throw error;
    }
  }

  /**
   * 새 아이템 생성
   */
  static async create(data: Item): Promise<Item> {
    try {
      return await ItemsService.itemsCreate(data);
    } catch (error) {
      console.error('Failed to create item', error);
      throw error;
    }
  }

  /**
   * 아이템 정보 업데이트
   */
  static async update(id: number, data: Item): Promise<Item> {
    try {
      return await ItemsService.itemsUpdate(id, data);
    } catch (error) {
      console.error(`Failed to update item with id ${id}`, error);
      throw error;
    }
  }

  /**
   * 아이템 부분 업데이트
   */
  static async partialUpdate(id: number, data: PatchedItem): Promise<Item> {
    try {
      return await ItemsService.itemsPartialUpdate(id, data);
    } catch (error) {
      console.error(`Failed to partially update item with id ${id}`, error);
      throw error;
    }
  }

  /**
   * 아이템 삭제
   */
  static async delete(id: number): Promise<void> {
    try {
      await ItemsService.itemsDestroy(id);
    } catch (error) {
      console.error(`Failed to delete item with id ${id}`, error);
      throw error;
    }
  }
}
