import React, {useState} from 'react';
import {TextInput, View, KeyboardAvoidingView} from 'react-native';
import {ChatInputStyles} from './InputChatBox.styles';
import {Theme} from '../../utils/themes';
import {useAppTheme} from '../../hooks/appTheme';
// type Props = {
//   onSend: (message: string) => void;
// };

export function InputChatBox() {
  const theme: Theme = useAppTheme();
  const styles = ChatInputStyles(theme);
  const [message, setMessage] = useState('');

  return (
    <KeyboardAvoidingView
    //   behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    //  keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
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
    </KeyboardAvoidingView>
  );
}
