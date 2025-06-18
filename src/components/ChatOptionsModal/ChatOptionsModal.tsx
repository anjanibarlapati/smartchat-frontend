import React from 'react';
import {
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useRealm } from '../../contexts/RealmContext';
import { useAppTheme } from '../../hooks/appTheme';
import { Chat } from '../../realm-database/schemas/Chat';
import { storeState } from '../../redux/store';
import { Theme } from '../../utils/themes';
import { getStyles } from './ChatOptionsModal.styles';

type ChatBlockModalProps = {
  visible: boolean;
  onClearChat: () => void;
  onBlockAndUnblock: () => void;
  onClose: () => void;
  receiverMobileNumber: string
};

export const ChatOptionsModal = ({
  visible,
  onClearChat,
  onBlockAndUnblock,
  onClose,
  receiverMobileNumber,
}: ChatBlockModalProps) => {
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme);
  const realm = useRealm();
  const chat = realm.objectForPrimaryKey<Chat>('Chat', receiverMobileNumber);
  const user = useSelector((state: storeState) => state.user);

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
              <TouchableOpacity onPress={() => {onClearChat();}}>
                <Text style={styles.text}>Clear Chat</Text>
              </TouchableOpacity>
              {user.mobileNumber !== receiverMobileNumber && !chat?.isAccountDeleted && <TouchableOpacity onPress={() => {onBlockAndUnblock();}}>
                  <Text style={styles.text}>
                    {chat?.isBlocked ? 'Unblock' : 'Block'}
                  </Text>
                </TouchableOpacity>
              }
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};
