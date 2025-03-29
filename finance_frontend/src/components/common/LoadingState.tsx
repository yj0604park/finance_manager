import React from 'react';
import { Container, Typography, CircularProgress, Box } from '@mui/material';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = '로딩 중...' }) => {
  return (
    <Container>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', my: 4 }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography>{message}</Typography>
      </Box>
    </Container>
  );
};

export default LoadingState;
