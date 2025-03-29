import { useState, useCallback } from 'react';

interface UseModalReturn<T> {
  isOpen: boolean;
  data: T | null;
  openModal: (data?: T) => void;
  closeModal: () => void;
}

export const useModal = <T = any>(): UseModalReturn<T> => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const openModal = useCallback((data: T | null = null) => {
    setData(data);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // 모달이 닫힌 후 일정 시간 뒤에 데이터 초기화 (애니메이션 완료 후)
    setTimeout(() => setData(null), 300);
  }, []);

  return {
    isOpen,
    data,
    openModal,
    closeModal,
  };
};
