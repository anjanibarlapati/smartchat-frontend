import NetInfo from '@react-native-community/netinfo';
import React, {useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useRealm} from '../../contexts/RealmContext';
import {useAppTheme} from '../../hooks/appTheme';
import {useAlertModal} from '../../hooks/useAlertModal';
import {addNewMessageInRealm} from '../../realm-database/operations/addNewMessage';
import {storeState} from '../../redux/store';
import {Message, MessageStatus} from '../../types/message';
import {Theme} from '../../utils/themes';
import {CustomAlert} from '../CustomAlert/CustomAlert';
import {sendMessage} from './InputChatBox.service';
import {ChatInputStyles} from './InputChatBox.styles';

export function InputChatBox({
  receiverMobileNumber,
}: {
  receiverMobileNumber: string;
}) {
  const theme: Theme = useAppTheme();
  const styles = ChatInputStyles(theme);
  const [message, setMessage] = useState('');
  const user = useSelector((state: storeState) => state.user);
  const {alertVisible, alertMessage, alertType, showAlert, hideAlert} =
    useAlertModal();
  const realm = useRealm();

  const handleSend = async () => {
    if (message.trim() === '') {
      return;
    }
    try {
      const sentAt = new Date().toISOString();

      let newMessage: Message = {
        message: message.trim(),
        sentAt: sentAt,
        isSender: true,
        status: MessageStatus.SENT,
      };
      if (receiverMobileNumber === user.mobileNumber) {
        newMessage.status = MessageStatus.SEEN;
      }
      const netState = await NetInfo.fetch();
      if (!netState.isConnected) {
        newMessage.status = MessageStatus.PENDING;
        addNewMessageInRealm(realm, receiverMobileNumber, newMessage);
        return;
      }
      addNewMessageInRealm(realm, receiverMobileNumber, newMessage);
      sendMessage(
        user.mobileNumber,
        receiverMobileNumber,
        message.trim(),
        sentAt,
      );
    } catch (error) {
      showAlert('Unable to send message', 'error');
    } finally {
      setMessage('');
    }
  };

  return (
    <KeyboardAvoidingView>
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Type a message"
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={1000}
            scrollEnabled={true}
          />
        </View>
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Image
            source={theme.images.send}
            style={styles.sendButtonIcon}
            accessibilityLabel="send-icon"
          />
        </TouchableOpacity>
      </View>
      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        type={alertType}
        onClose={hideAlert}
      />
    </KeyboardAvoidingView>
  );
}
