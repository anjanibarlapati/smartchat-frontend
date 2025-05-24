import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

export const getStyles = (theme:Theme)=> StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingTop: 100,
      padding:15,
    },
    modalContainer: {
      height: 80,
      width: 180,
      backgroundColor: theme.primaryBackground,
      shadowColor: theme.primaryShadowColor,
      shadowOpacity: 0.12,
      shadowRadius: 5,
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 10,
      elevation:5,
      justifyContent:'center',
      gap:10,
    },
    text: {
      fontFamily: 'Nunito-SemiBold',
      fontStyle: 'normal',
      fontSize: 14,
      lineHeight:16,
      textAlign: 'left',
      color: theme.primaryTextColor,
    },
  });
