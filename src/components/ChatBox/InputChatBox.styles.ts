import {StyleSheet} from 'react-native';
import {Theme} from '../../utils/themes';

export const ChatInputStyles = (theme: Theme) =>
  StyleSheet.create({
    wrapper: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    container: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      alignItems: 'flex-end',
      borderRadius: 35,
      margin: 10,
      borderWidth: 1,
      borderColor: theme.chatInputBorderColor,
    },

    input: {
      width: 280,
      fontSize: 16,
      paddingHorizontal: 12,
      paddingVertical: 10,
      maxHeight: 90,
      color: theme.chatTextColor,
    },
  });
