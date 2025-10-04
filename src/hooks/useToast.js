import { useState } from 'react';

const useToast = () => {
  const [toast, setToast] = useState({
    isVisible: false,
    type: 'info',
    message: ''
  });

  const showToast = (message, type = 'info') => {
    setToast({
      isVisible: true,
      type,
      message
    });
  };

  const hideToast = () => {
    setToast(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  const showSuccess = (message) => showToast(message, 'success');
  const showError = (message) => showToast(message, 'error');
  const showWarning = (message) => showToast(message, 'warning');
  const showInfo = (message) => showToast(message, 'info');

  return {
    toast,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default useToast;