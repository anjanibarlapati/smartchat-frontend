import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

export const getStyles = (theme: Theme) => StyleSheet.create({
    container: {
      padding: 10,
      width: '80%',
    },
    input: {
      height: 40,
      borderColor: theme.primaryInputBackground,
      backgroundColor: theme.primaryInputBackground,
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      fontFamily:'Nunito-Regular',
    },
    errorText: {
      color: theme.primaryErrorText,
      fontSize: 12,
      fontFamily:'Nunito-Regular',
      marginTop: 5,
    },
  });
