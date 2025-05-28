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

interface InputChatBoxProps {
  receiverMobileNumber: string;
  onSendMessage: (text: string) => void;
}
export function InputChatBox({
  receiverMobileNumber,
  onSendMessage,
}: InputChatBoxProps) {
  const theme: Theme = useAppTheme();
  const styles = ChatInputStyles(theme);

  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const user = useSelector((state: storeState) => state.user);
  const sendTextMessage = () => {
    onSendMessage(message);
    setMessage('');
  };

  const handleSend = async () => {
    if (message.trim() === '') {
      return;
    }
    sendTextMessage();
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
    } catch (error) {
      throw new Error('unable to encrypt message');
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
