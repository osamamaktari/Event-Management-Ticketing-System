// في src/composables/useNotifications.js

import { useToast } from 'vue-toastification';

export function useNotifications() {
  const toast = useToast();

  const showSuccess = (message) => {
    toast.success(message);
  };

  const showError = (message) => {
    toast.error(message);
  };

  const showInfo = (message) => {
    toast.info(message);
  };

  const showWarning = (message) => {
    toast.warning(message);
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
}
