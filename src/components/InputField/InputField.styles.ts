import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

export const getStyles = (theme: Theme, width: number) => StyleSheet.create({
    container: {
      padding: 10,
      width: '80%',
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderColor: theme.primaryInputBackground,
      backgroundColor: theme.primaryInputBackground,
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      height: 40,
    },
    input: {
      flex: 1,
      height: '100%',
      fontFamily: 'Nunito-Regular',
      fontSize: width > 600 ? 16 : 14,
      color: theme.primaryTextColor,
    },
    errorText: {
      color: theme.primaryErrorText,
      fontSize: 12,
      fontFamily:'Nunito-Regular',
      marginTop: 5,
    },
  });
