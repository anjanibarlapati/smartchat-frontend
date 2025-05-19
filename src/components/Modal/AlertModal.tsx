import React from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {getStyles} from './AlertModal.styles';
import {Theme} from '../../utils/themes';
import {useAppTheme} from '../../hooks/appTheme';

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
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.message}>{message}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={onCancel}>
                <Text style={styles.cancelText}>{cancelText}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onConfirm}>
                <Text style={styles.confirmText}>{confirmText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
    </Modal>
  );
};
