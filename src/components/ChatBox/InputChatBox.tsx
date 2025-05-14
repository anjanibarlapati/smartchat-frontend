import React, {useState} from 'react';
import {TextInput, View, KeyboardAvoidingView} from 'react-native';
import {ChatInputStyles} from './InputChatBox.styles';
import {Theme} from '../../utils/themes';
import {useAppTheme} from '../../hooks/appTheme';

export function InputChatBox() {
  const theme: Theme = useAppTheme();
  const styles = ChatInputStyles(theme);
  const [message, setMessage] = useState('');

  return (
    <KeyboardAvoidingView>
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
