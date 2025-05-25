import React, {useState} from 'react';
import {Image, KeyboardAvoidingView, TextInput, TouchableOpacity, View} from 'react-native';
import {useAppTheme} from '../../hooks/appTheme';
import {Theme} from '../../utils/themes';
import {ChatInputStyles} from './InputChatBox.styles';
import { addMessage, Message } from '../../redux/reducers/messages.reducer';
import { useDispatch, useSelector } from 'react-redux';
import { storeState } from '../../redux/store';
import { sendMessage } from './InputChatBox.service';

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
  const generateId = () => `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  const sendTextMessage = () => {
    onSendMessage(message);
    setMessage('');
  };

  const handleSend = async () => {
    if (message.trim() === '') {
      return;
    }
    const msg: Message = {
      id: generateId(),
      sender: user.mobileNumber,
      receiver: receiverMobileNumber,
      message: message.trim(),
      sentAt: new Date().toISOString(),
      isSender: true,
      status: 'sent',
    };


    dispatch(addMessage({chatId: receiverMobileNumber, message: msg}));
    sendTextMessage();
    try {
      await sendMessage(user.mobileNumber, receiverMobileNumber, message.trim());

    } catch (error) {
      throw new Error('unable to encrypt message');
    }
  };

  return (
    <KeyboardAvoidingView>
      <View style= {styles.wrapper}>
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
