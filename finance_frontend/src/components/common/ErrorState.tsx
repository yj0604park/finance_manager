import React from 'react';
import { Container, Alert, Box, Button } from '@mui/material';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Alert
          severity="error"
          action={
            onRetry && (
              <Button color="inherit" size="small" onClick={onRetry}>
                다시 시도
              </Button>
            )
          }
        >
          {message}
        </Alert>
      </Box>
    </Container>
  );
};

export default ErrorState;
