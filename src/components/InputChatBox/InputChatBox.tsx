import React, {useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useAppTheme} from '../../hooks/appTheme';
import {addMessage, Message} from '../../redux/reducers/messages.reducer';
import {storeState} from '../../redux/store';
import {Theme} from '../../utils/themes';
import {sendMessage} from './InputChatBox.service';
import {ChatInputStyles} from './InputChatBox.styles';
import { getSocket } from '../../utils/socket';

export function InputChatBox({receiverMobileNumber}: {receiverMobileNumber: string}) {
  const theme: Theme = useAppTheme();
  const styles = ChatInputStyles(theme);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const user = useSelector((state: storeState) => state.user);
  const handleSend = async () => {
    if (message.trim() === '') {
      return;
    }
    try {
      const result = await sendMessage(
        user.mobileNumber,
        receiverMobileNumber,
        message.trim(),
      );
      const msg: Message = {
        id: result.message._id,
        sender: user.mobileNumber,
        receiver: receiverMobileNumber,
        message: message.trim(),
        sentAt: new Date().toISOString(),
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
            messageId: msg.id,
            chatId: msg.sender,
          });
      }

    } catch (error) {
      throw new Error('Unable to encrypt message');
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
    </KeyboardAvoidingView>
  );
}
