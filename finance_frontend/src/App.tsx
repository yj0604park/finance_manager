import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { Layout } from './components/layout/Layout';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Banks from './pages/Banks';
import { NotFound } from './pages/NotFound';
import { useAuth } from './contexts/AuthContext';
import { appRootBoxStyle } from './styles/layoutStyles';

// 인증 필요한 라우트 체크를 위한 컴포넌트
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Box sx={appRootBoxStyle}>
          <Layout>
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Box>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
