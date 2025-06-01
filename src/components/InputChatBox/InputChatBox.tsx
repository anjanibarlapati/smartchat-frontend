import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useAppTheme } from '../../hooks/appTheme';
import { useAlertModal } from '../../hooks/useAlertModal';
import { addMessage } from '../../redux/reducers/messages.reducer';
import { storeState } from '../../redux/store';
import { Message } from '../../types/message';
import { getSocket } from '../../utils/socket';
import { Theme } from '../../utils/themes';
import { CustomAlert } from '../CustomAlert/CustomAlert';
import { sendMessage } from './InputChatBox.service';
import { ChatInputStyles } from './InputChatBox.styles';

export function InputChatBox({receiverMobileNumber}: {receiverMobileNumber: string}) {
  const theme: Theme = useAppTheme();
  const styles = ChatInputStyles(theme);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const user = useSelector((state: storeState) => state.user);
    const {
    alertVisible, alertMessage, alertType, showAlert, hideAlert,
  } = useAlertModal();


  const handleSend = async () => {
    if (message.trim() === '') {
      return;
    }
    try {
      const sentAt = new Date().toISOString();
      const response = await sendMessage(
        user.mobileNumber,
        receiverMobileNumber,
        message.trim(),
        sentAt,
      );

      const result = await response.json();

      const msg: Message = {
        message: message.trim(),
        sentAt: sentAt,
        isSender: true,
        status: 'sent',
      };
      dispatch(addMessage({chatId: receiverMobileNumber, message: msg}));
      const socket = getSocket();
      if (!socket?.connected) {
        return;
      }
      if(receiverMobileNumber === user.mobileNumber) {
        socket.emit('messageRead', {
            sentAt: sentAt,
            chatId: receiverMobileNumber,
          });
      }
      if(!response.ok) {
        showAlert(result.message, 'error');
      }
    } catch (error) {
      showAlert('Unable to send message', 'error');
    } finally{
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
      <CustomAlert visible={alertVisible} message={alertMessage} type={alertType} onClose={hideAlert} />
    </KeyboardAvoidingView>
  );
}
