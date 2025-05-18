import {StyleSheet} from 'react-native';
import {Theme} from '../../utils/themes';

export const getStyles = (theme: Theme, isSender: boolean) =>
  StyleSheet.create({
    container: {
      maxWidth: '80%',
      padding: 8,
      borderRadius: 12,
      marginVertical: 8,
      alignSelf: isSender ? 'flex-end' : 'flex-start',
    },

    senderContainer: {
      backgroundColor: theme.senderMessageBox,
    },

    receiverContainer: {
      backgroundColor: theme.receiverMessageBox,
    },

    messageText: {
      fontSize: 16,
      color: theme.primaryTextColor,
    },

    footer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginTop: 4,
      gap: 6,
    },

    timeText: {
      fontSize: 12,
      color: theme.timestamp,
    },

    tickIcon: {
      width: 16,
      height: 16,
    },
  });
