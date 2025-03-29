import { useState, useEffect, useCallback } from 'react';
import { Account } from '../api/models/Account';
import { AccountsService } from '../api/services/AccountsService';

interface UseAccountsReturn {
  accounts: Account[];
  loading: boolean;
  error: string | null;
  fetchAccounts: () => Promise<void>;
  addAccount: (accountData: Partial<Account>) => Promise<Account>;
  updateAccount: (id: number, accountData: Partial<Account>) => Promise<Account>;
  deleteAccount: (id: number) => Promise<void>;
}

export const useAccounts = (): UseAccountsReturn => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await AccountsService.accountsList();
      setAccounts(response);
    } catch (err) {
      setError('계좌 목록을 불러오는데 실패했습니다.');
      console.error('Error fetching accounts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addAccount = useCallback(async (accountData: Partial<Account>): Promise<Account> => {
    try {
      const newAccount = await AccountsService.accountsCreate(accountData as Account);
      setAccounts((prev) => [...prev, newAccount]);
      return newAccount;
    } catch (err) {
      console.error('Error adding account:', err);
      throw err;
    }
  }, []);

  const updateAccount = useCallback(async (id: number, accountData: Partial<Account>): Promise<Account> => {
    try {
      const updatedAccount = await AccountsService.accountsUpdate(id, accountData as Account);
      setAccounts((prev) => prev.map((account) => (account.id === id ? updatedAccount : account)));
      return updatedAccount;
    } catch (err) {
      console.error('Error updating account:', err);
      throw err;
    }
  }, []);

  const deleteAccount = useCallback(async (id: number): Promise<void> => {
    try {
      await AccountsService.accountsDestroy(id);
      setAccounts((prev) => prev.filter((account) => account.id !== id));
    } catch (err) {
      console.error('Error deleting account:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    addAccount,
    updateAccount,
    deleteAccount,
  };
};
