import { useState } from 'react';
import { AlertType } from '../types/AlertType';

export const useAlertModal = () => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<AlertType>('info');

  const showAlert = (message: string, type: AlertType = 'info') => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
  };

  return {
    alertVisible,
    alertMessage,
    alertType,
    showAlert,
    hideAlert,
  };
};
