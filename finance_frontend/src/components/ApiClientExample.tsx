import { useState, useEffect } from 'react';
import { OpenAPI } from '../api/core/OpenAPI';
import { logout } from '../api/client';
import Login from './Login';
import BankList from './BankList';

/**
 * Main component that demonstrates using the API client
 */
export default function ApiClientExample() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if the user is already logged in on component mount
  useEffect(() => {
    const hasToken = !!OpenAPI.TOKEN;
    setIsLoggedIn(hasToken);
  }, []);

  // Handle successful login
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setIsLoggedIn(false);
    }
  };

  return (
    <div className="api-client-example">
      <h1>Finance Backend API Demo</h1>

      {isLoggedIn ? (
        <>
          <div className="header">
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>

          <BankList />
        </>
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}
