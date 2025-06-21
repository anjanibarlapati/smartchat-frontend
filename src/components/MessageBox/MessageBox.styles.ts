import {StyleSheet} from 'react-native';
import {Theme} from '../../utils/themes';

export const getStyles = (theme: Theme, width: number, height: number, isSender: boolean) =>
  StyleSheet.create({
    container: {
      maxWidth: width > 600 ? '55%' : '80%',
      padding: 8,
      borderRadius:12,
      // borderTopRightRadius: isSender ? 0 : 12,
      // borderTopLeftRadius: isSender ? 12 : 0,
      borderBottomLeftRadius: isSender ? 12 : 0,
      borderBottomRightRadius: isSender ? 0 : 12,
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
      fontFamily:'Nunito-Regular',
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
      fontFamily:'Nunito-Regular',
    },
    tickIcon: {
      width: 16,
      height: 16,
    },
  });
