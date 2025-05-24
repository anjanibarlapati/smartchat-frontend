import React from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useAppTheme } from '../../hooks/appTheme';
import { Theme } from '../../utils/themes';
import { getStyles } from './AlertModal.styles';

interface AlertModalProps {
  message: string;
  visible: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AlertModal = ({
  message,
  visible,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: AlertModalProps) => {
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme);
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}>
        <TouchableWithoutFeedback onPress={onCancel}>
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.message}>{message}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={onCancel} style={styles.cancelTextContainer}>
                  <Text style={styles.cancelText}>{cancelText}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onConfirm} style={styles.confirmTextContainer}>
                  <Text style={styles.confirmText}>{confirmText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
    </Modal>
  );
};
