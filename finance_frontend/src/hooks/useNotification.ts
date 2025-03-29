import { useState, useCallback } from 'react';
import { NotificationState } from '../components/common/NotificationSnackbar';

interface UseNotificationReturn {
  notification: NotificationState;
  showNotification: (message: string, severity: 'success' | 'error' | 'warning' | 'info') => void;
  hideNotification: () => void;
}

export const useNotification = (): UseNotificationReturn => {
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showNotification = useCallback(
    (message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'success') => {
      setNotification({
        open: true,
        message,
        severity,
      });
    },
    []
  );

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({
      ...prev,
      open: false,
    }));
  }, []);

  return {
    notification,
    showNotification,
    hideNotification,
  };
};
