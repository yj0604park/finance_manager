import { ItemPricesService } from '../services/ItemPricesService';
import { ItemPrice } from '../models/ItemPrice';
import { PatchedItemPrice } from '../models/PatchedItemPrice';

/**
 * 아이템 가격 API 래퍼 클래스
 * 자동 생성된 서비스에 대한 타입 안전한 인터페이스 제공
 */
export class ItemPricesWrapper {
  /**
   * 모든 아이템 가격 가져오기
   */
  static async getAll(): Promise<ItemPrice[]> {
    try {
      return await ItemPricesService.itemPricesList();
    } catch (error) {
      console.error('Failed to fetch item prices', error);
      throw error;
    }
  }

  /**
   * 특정 아이템의 가격 목록 가져오기
   * @param itemId 아이템 ID
   */
  static async getByItemId(itemId: number): Promise<ItemPrice[]> {
    try {
      // 모든 아이템 가격을 가져온 후 필터링
      const allPrices = await ItemPricesService.itemPricesList();
      return allPrices.filter(price => price.item === itemId);
    } catch (error) {
      console.error(`Failed to fetch prices for item ${itemId}`, error);
      throw error;
    }
  }

  /**
   * 아이템 가격 상세 정보 가져오기
   * @param id 아이템 가격 ID
   */
  static async getById(id: number): Promise<ItemPrice> {
    try {
      return await ItemPricesService.itemPricesRetrieve(id);
    } catch (error) {
      console.error(`Failed to fetch item price with id ${id}`, error);
      throw error;
    }
  }

  /**
   * 아이템 가격 생성
   * @param data 아이템 가격 데이터
   */
  static async create(data: ItemPrice): Promise<ItemPrice> {
    try {
      return await ItemPricesService.itemPricesCreate(data);
    } catch (error) {
      console.error('Failed to create item price', error);
      throw error;
    }
  }

  /**
   * 아이템 가격 수정
   * @param id 아이템 가격 ID
   * @param data 수정할 아이템 가격 데이터
   */
  static async update(id: number, data: ItemPrice): Promise<ItemPrice> {
    try {
      return await ItemPricesService.itemPricesUpdate(id, data);
    } catch (error) {
      console.error(`Failed to update item price with id ${id}`, error);
      throw error;
    }
  }

  /**
   * 아이템 가격 부분 수정
   * @param id 아이템 가격 ID
   * @param data 수정할 아이템 가격 데이터
   */
  static async partialUpdate(id: number, data: PatchedItemPrice): Promise<ItemPrice> {
    try {
      return await ItemPricesService.itemPricesPartialUpdate(id, data);
    } catch (error) {
      console.error(`Failed to partially update item price with id ${id}`, error);
      throw error;
    }
  }

  /**
   * 아이템 가격 삭제
   * @param id 아이템 가격 ID
   */
  static async delete(id: number): Promise<void> {
    try {
      await ItemPricesService.itemPricesDestroy(id);
    } catch (error) {
      console.error(`Failed to delete item price with id ${id}`, error);
      throw error;
    }
  }
}
