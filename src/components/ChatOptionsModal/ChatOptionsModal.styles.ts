import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

export const getStyles = (theme:Theme)=> StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingTop: 100,
      padding:10,
    },
    modalContainer: {
      height: 80,
      backgroundColor: theme.primaryBackground,
      shadowColor: theme.primaryShadowColor,
      shadowOpacity: 0.12,
      shadowRadius: 5,
      borderRadius: 10,
      paddingHorizontal: 19,
      paddingVertical: 10,
      elevation:5,
    },
    clearChatButton: {
        height: 26,
        width: 173,
        justifyContent: 'center',
    },
      blockButton: {
        height: 15,
        width: 88,
        marginTop: 12,
        justifyContent: 'center',
      },
    text: {
      fontFamily: 'Nunito',
      fontStyle: 'normal',
      fontWeight: '500',
      fontSize: 14,
      lineHeight:16,
      textAlign: 'left',
      color: theme.primaryTextColor,
    },
  });
