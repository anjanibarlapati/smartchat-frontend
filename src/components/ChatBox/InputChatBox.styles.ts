import {StyleSheet} from 'react-native';
import {Theme} from '../../utils/themes';

export const ChatInputStyles = (theme: Theme) =>
  StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 20,
      gap:10,
    },
    container: {
      flex: 1,
      paddingHorizontal: 12,
      borderRadius: 30,
      borderWidth: 1,
      borderColor: theme.chatInputBorderColor,
    },
    input: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 12,
      maxHeight: 90,
      color: theme.chatTextColor,
      fontFamily:'Nunito-Regular',
      textAlign:'left',
    },
    sendButton: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 48,
      width: 48,
    },
    sendButtonIcon: {
      height: 90,
      width: 90,
    },
  });
