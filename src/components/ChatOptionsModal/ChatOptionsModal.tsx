import React, {useState} from 'react';
import {
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useAppTheme} from '../../hooks/appTheme';
import {Theme} from '../../utils/themes';
import {AlertModal} from '../AlertModal/AlertModal';
import {getStyles} from './ChatOptionsModal.styles';

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

  const [showClearAlert, setShowClearAlert] = useState(false);
  const [showBlockAlert, setShowBlockAlert] = useState(false);

  return (
    <>
      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={onClose}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View
            style={
              Platform.OS === 'android'
                ? [styles.overlay, {paddingTop: 50}]
                : [styles.overlay, {paddingTop: 101}]
            }
            accessibilityLabel="overlay">
            <View style={styles.modalContainer}>
              <TouchableOpacity onPress={() => setShowClearAlert(true)}>
                <Text style={styles.text}>Clear Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowBlockAlert(true)}>
                <Text style={styles.text}>Block</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <AlertModal
          message={'Do you really want to clear this chat?'}
          visible={showClearAlert}
          confirmText={'Yes'}
          cancelText={'Cancel'}
          onConfirm={() => {
            setShowClearAlert(false);
            onClearChat();
          }}
          onCancel={() => setShowClearAlert(false)}
        />
        <AlertModal
          message={'Are you sure you want to block this chat?'}
          visible={showBlockAlert}
          confirmText={'Yes'}
          cancelText={'Cancel'}
          onConfirm={() => {
            setShowBlockAlert(false);
            onBlock();
          }}
          onCancel={() => setShowBlockAlert(false)}
        />
      </Modal>
    </>
  );
};
