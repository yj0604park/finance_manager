import React from 'react';
import { QueryClientProvider as RQProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient';

interface QueryClientProviderProps {
  children: React.ReactNode;
}

/**
 * 애플리케이션에서 사용할 QueryClientProvider 래퍼
 *
 * 외부에서 정의된 queryClient 인스턴스를 사용합니다.
 */
export const QueryClientProvider: React.FC<QueryClientProviderProps> = ({ children }) => {
  return <RQProvider client={queryClient}>{children}</RQProvider>;
};
