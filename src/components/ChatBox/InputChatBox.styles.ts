import {StyleSheet} from 'react-native';
import {Theme} from '../../utils/themes';

export const ChatInputStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.chatInputBackground,
      flexDirection: 'row',
      paddingHorizontal: 10,
      paddingVertical: 6,
      alignItems: 'flex-end',
      borderRadius: 35,
      margin: 10,
      borderWidth: 1,
      borderColor: theme.chatInputBorderColor,
    },
    input: {
      flex: 1,
      fontSize: 16,
      paddingHorizontal: 12,
      paddingVertical: 10,
      maxHeight: 90,
      color: theme.chatTextColor,
    },
    sendButton: {
      justifyContent: 'flex-end',
      padding: 10,
    },
    sendText: {
      fontSize: 20,
      color: theme.chatSendIconColor,
    },
  });
