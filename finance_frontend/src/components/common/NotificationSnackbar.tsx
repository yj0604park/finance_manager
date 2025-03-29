import React from 'react';
import { Snackbar, Alert } from '@mui/material';

export interface NotificationState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

interface NotificationSnackbarProps {
  notification: NotificationState;
  onClose: () => void;
}

const NotificationSnackbar: React.FC<NotificationSnackbarProps> = ({ notification, onClose }) => {
  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={6000}
      onClose={onClose}
    >
      <Alert
        onClose={onClose}
        severity={notification.severity}
        sx={{ width: '100%' }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;
