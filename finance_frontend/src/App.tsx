import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Banks } from './pages/banks/Banks';
import { BankDetail } from './pages/banks/BankDetail';
import { AccountDetail } from './pages/accounts/AccountDetail';
import { Validation } from './pages/validation/Validation';
import { Income } from './pages/income/Income';
import { Assets } from './pages/assets/Assets';
import { Investments } from './pages/investments/Investments';
import { Loans } from './pages/loans/Loans';
import { Reports } from './pages/reports/Reports';
import { Tax } from './pages/tax/Tax';
import { Charts } from './pages/charts/Charts';
import { Shopping } from './pages/shopping/Shopping';
import { NotFound } from './pages/NotFound';
import { Box, CssBaseline } from '@mui/material';
import { client } from './library/apollo';
import { CreateTransactionPage } from './pages/transactions/CreateTransaction';
import TransactionList from './pages/transactions/TransactionList';
import RetailerDetail from './pages/retailer/RetailerDetail';
import { Layout } from './components/layout/Layout';
import Login from './pages/auth/Login';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <CssBaseline />
          <Box sx={{ 
            minHeight: '100vh',
            minWidth: '100vw',
            width: '100%',
            backgroundColor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
            margin: 0,
            padding: 0,
            boxSizing: 'border-box',
            overflow: 'hidden'
          }}>
            <Layout>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/banks" element={
                  <ProtectedRoute>
                    <Banks />
                  </ProtectedRoute>
                } />
                <Route path="/banks/:bankId" element={
                  <ProtectedRoute>
                    <BankDetail />
                  </ProtectedRoute>
                } />
                <Route path="/accounts/:accountId" element={
                  <ProtectedRoute>
                    <AccountDetail />
                  </ProtectedRoute>
                } />
                <Route path="/validation" element={
                  <ProtectedRoute>
                    <Validation />
                  </ProtectedRoute>
                } />
                <Route path="/income" element={
                  <ProtectedRoute>
                    <Income />
                  </ProtectedRoute>
                } />
                <Route path="/assets" element={
                  <ProtectedRoute>
                    <Assets />
                  </ProtectedRoute>
                } />
                <Route path="/investments" element={
                  <ProtectedRoute>
                    <Investments />
                  </ProtectedRoute>
                } />
                <Route path="/loans" element={
                  <ProtectedRoute>
                    <Loans />
                  </ProtectedRoute>
                } />
                <Route path="/reports" element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                } />
                <Route path="/taxes" element={
                  <ProtectedRoute>
                    <Tax />
                  </ProtectedRoute>
                } />
                <Route path="/charts" element={
                  <ProtectedRoute>
                    <Charts />
                  </ProtectedRoute>
                } />
                <Route path="/shopping" element={
                  <ProtectedRoute>
                    <Shopping />
                  </ProtectedRoute>
                } />
                <Route path="/transactions/create" element={
                  <ProtectedRoute>
                    <CreateTransactionPage />
                  </ProtectedRoute>
                } />
                <Route path="/transactions" element={
                  <ProtectedRoute>
                    <TransactionList />
                  </ProtectedRoute>
                } />
                <Route path="/retailer/:id" element={
                  <ProtectedRoute>
                    <RetailerDetail />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </Box>
        </BrowserRouter>
      </ApolloProvider>
    </AuthProvider>
  );
}

export default App;
