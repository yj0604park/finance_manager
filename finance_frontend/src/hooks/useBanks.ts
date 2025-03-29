import { useState, useEffect, useCallback } from 'react';
import { Bank } from '../api/models/Bank';
import { BanksService } from '../api/services/BanksService';

interface UseBanksReturn {
  banks: Bank[];
  loading: boolean;
  error: string | null;
  fetchBanks: () => Promise<void>;
  addBank: (bankData: Partial<Bank>) => Promise<Bank>;
  updateBank: (id: number, bankData: Partial<Bank>) => Promise<Bank>;
  deleteBank: (id: number) => Promise<void>;
}

export const useBanks = (): UseBanksReturn => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBanks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await BanksService.banksList();
      setBanks(response);
    } catch (err) {
      setError('은행 목록을 불러오는데 실패했습니다.');
      console.error('Error fetching banks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addBank = useCallback(async (bankData: Partial<Bank>): Promise<Bank> => {
    try {
      const newBank = await BanksService.banksCreate(bankData as Bank);
      setBanks((prev) => [...prev, newBank]);
      return newBank;
    } catch (err) {
      console.error('Error adding bank:', err);
      throw err;
    }
  }, []);

  const updateBank = useCallback(async (id: number, bankData: Partial<Bank>): Promise<Bank> => {
    try {
      const updatedBank = await BanksService.banksUpdate(id, bankData as Bank);
      setBanks((prev) => prev.map((bank) => (bank.id === id ? updatedBank : bank)));
      return updatedBank;
    } catch (err) {
      console.error('Error updating bank:', err);
      throw err;
    }
  }, []);

  const deleteBank = useCallback(async (id: number): Promise<void> => {
    try {
      await BanksService.banksDestroy(id);
      setBanks((prev) => prev.filter((bank) => bank.id !== id));
    } catch (err) {
      console.error('Error deleting bank:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  return {
    banks,
    loading,
    error,
    fetchBanks,
    addBank,
    updateBank,
    deleteBank,
  };
};
