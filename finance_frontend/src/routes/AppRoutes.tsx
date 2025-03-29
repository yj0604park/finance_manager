import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Banks from '../pages/Banks';
import Accounts from '../pages/Accounts';
import TransactionList from '../pages/transactions/List';
import TransactionAnalysis from '../pages/transactions/Analysis';
import Settings from '../pages/Settings';
import Login from '../pages/Login';
import { NotFound } from '../pages/NotFound';
import { useAuth } from '../contexts/AuthContext';
import Cards from '../pages/Cards';
import Assets from '../pages/Assets';
import Retailers from '../pages/Retailers';

// 인증이 필요한 라우트를 보호하는 컴포넌트
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/banks"
        element={
          <ProtectedRoute>
            <Banks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accounts"
        element={
          <ProtectedRoute>
            <Accounts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/retailers"
        element={
          <ProtectedRoute>
            <Retailers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <Navigate to="/transactions/list" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions/list"
        element={
          <ProtectedRoute>
            <TransactionList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions/analysis"
        element={
          <ProtectedRoute>
            <TransactionAnalysis />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cards"
        element={
          <ProtectedRoute>
            <Cards />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assets"
        element={
          <ProtectedRoute>
            <Assets />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
