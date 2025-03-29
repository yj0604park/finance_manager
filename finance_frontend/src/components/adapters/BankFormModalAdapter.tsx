import React from 'react';
import BankFormModal from '../banks/BankFormModal';
import { Bank as InternalBank } from '../../types/models';
import { Bank as ApiBank } from '../../api/models/Bank';
import { bankToApiModel, apiBankToModel } from '../../utils/modelAdapters';

// 어댑터 컴포넌트 props 정의
interface BankFormModalAdapterProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (bank: Partial<InternalBank>) => void;
  bank?: InternalBank;
}

/**
 * 은행 폼 모달 어댑터 컴포넌트
 *
 * 내부 모델과 API 모델 간의 타입 변환을 처리합니다.
 */
const BankFormModalAdapter: React.FC<BankFormModalAdapterProps> = ({
  open,
  onClose,
  onSubmit,
  bank
}) => {
  // 내부 모델을 API 모델로 변환
  const apiBank = bank ? bankToApiModel(bank) as ApiBank : undefined;

  // API 모델로부터 폼 제출을 처리하는 핸들러
  const handleSubmit = (apiBankData: Partial<ApiBank>) => {
    // API 모델을 내부 모델로 변환하여 원래 핸들러에 전달
    const internalBankData = apiBankToModel(apiBankData);
    onSubmit(internalBankData);
  };

  return (
    <BankFormModal
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      bank={apiBank}
    />
  );
};

export default BankFormModalAdapter;
