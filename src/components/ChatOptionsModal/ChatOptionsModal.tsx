import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import {Theme} from '../../utils/themes';
import {useAppTheme} from '../../hooks/appTheme';
import { getStyles } from './ChatOptionsModal.styles';

type ChatBlockModalProps = {
  visible: boolean;
  onClearChat: () => void;
  onBlock: () => void;
  onClose: () => void;
};

export const ChatOptionsModal = ({
  visible,
  onClearChat,
  onBlock,
  onClose,
}: ChatBlockModalProps) => {
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme);
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
      >
      <TouchableWithoutFeedback onPress={onClose} >
        <View style={Platform.OS === 'android' ? [styles.overlay, {paddingTop: 50}] : [styles.overlay, {paddingTop: 101}]}  accessibilityLabel="overlay">
            <View style={styles.modalContainer} >
              <TouchableOpacity onPress={onClearChat}>
                <Text style={styles.text}>Clear Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onBlock}>
                <Text style={styles.text}>Block</Text>
              </TouchableOpacity>
            </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
