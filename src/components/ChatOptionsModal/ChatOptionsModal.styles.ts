import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

export const getStyles = (theme:Theme)=> StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    modalContainer: {
      position: 'absolute',
      width: 192,
      height: 68,
      marginLeft: 201,
      marginTop: 113,
      backgroundColor: theme.primaryBackground,
      shadowColor: theme.primaryShadowColor,
      shadowOpacity: 0.18,
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
        marginTop: 5,
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
