import React, {useState} from 'react';
import {KeyboardAvoidingView, TextInput, View} from 'react-native';
import {useAppTheme} from '../../hooks/appTheme';
import {Theme} from '../../utils/themes';
import {SendButton} from '../SendButton/SendButton';
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

  const sendTextMessage = () => {
    if (message.trim() === '') {
      return;
    }
    onSendMessage(message);
    setMessage('');
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
            textAlignVertical="top"
          />
        </View>
        <SendButton
          receiverMobileNumber={receiverMobileNumber}
          message={message}
          onSend={sendTextMessage}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
