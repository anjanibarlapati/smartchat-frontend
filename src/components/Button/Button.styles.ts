import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

export const getStyles = (theme: Theme) => StyleSheet.create({
    buttonColor: {
      backgroundColor: theme.primaryColor,
      borderRadius: 5,
      padding: 12,
      width:'30%',
      display:'flex',
      alignItems:'center',
    },
    buttonText: {
      color: theme.primaryButtonTextColor,
      fontSize: 14,
      fontFamily: 'Nunito-Bold',
    },
  });
