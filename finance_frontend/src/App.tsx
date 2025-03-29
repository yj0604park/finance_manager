import { BrowserRouter } from 'react-router-dom';
import { Box } from '@mui/material';
import { Layout } from './components/layout/Layout';
import { AuthProvider } from './contexts/AuthProvider';
import AppRoutes from './routes/AppRoutes';
import { appRootBoxStyle } from './styles/layoutStyles';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Box sx={appRootBoxStyle}>
          <Layout>
            <AppRoutes />
          </Layout>
        </Box>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
