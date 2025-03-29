import { useState, useEffect } from 'react';
import { TransactionsWrapper } from '../api/wrappers';
import { TransactionWithExtendedInfo } from '../api/wrappers/extendedTypes';

export const TransactionList = () => {
  const [transactions, setTransactions] = useState<TransactionWithExtendedInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // 확장된 래퍼 클래스 사용 - 자동 생성된 코드를 수정하지 않고 확장 기능 활용
        const data = await TransactionsWrapper.getAllExtended();
        setTransactions(data);
      } catch (err) {
        setError('트랜잭션을 불러오는 중 오류가 발생했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div>
      <h2>트랜잭션 목록</h2>
      <table>
        <thead>
          <tr>
            <th>날짜</th>
            <th>금액</th>
            <th>총액 (확장 필드)</th>
            <th>요약 (확장 필드)</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.date}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.totalAmount}</td>
              <td>{transaction.summary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
