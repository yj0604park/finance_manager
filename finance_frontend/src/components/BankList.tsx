import { useState, useEffect } from 'react';
import { BanksService } from '../api/services/BanksService';
import type { Bank } from '../api/models/Bank';

/**
 * Component that displays a list of banks from the API
 */
export default function BankList() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch banks
    async function fetchBanks() {
      try {
        setLoading(true);
        const bankData = await BanksService.banksList();
        setBanks(bankData);
        setError(null);
      } catch (err) {
        console.error('Error fetching banks:', err);
        setError('Failed to load banks. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchBanks();
  }, []);

  if (loading) {
    return <div>Loading banks...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="bank-list">
      <h2>My Banks</h2>
      {banks.length === 0 ? (
        <p>No banks found.</p>
      ) : (
        <ul>
          {banks.map((bank) => (
            <li key={bank.id} className="bank-item">
              <div className="bank-name">{bank.name}</div>
              <div className="bank-details">
                <span className="bank-country">Country: {bank.country}</span>
                <span className="bank-amount">Amount: {bank.amount}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
