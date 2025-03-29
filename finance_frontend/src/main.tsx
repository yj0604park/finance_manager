import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './styles/theme';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ko } from 'date-fns/locale';
import { QueryClientProvider } from './lib/react-query/QueryClientProvider';

// 앱 렌더링
async function startApp() {
  // 앱 렌더링
  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <QueryClientProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
              <App />
            </LocalizationProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </React.StrictMode>
    );
  }
}

startApp();
