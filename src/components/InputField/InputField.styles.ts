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
      paddingLeft: 10,
    },
    errorText: {
      color: theme.primaryErrorText,
      fontSize: 12,
      marginTop: 5,
    },
  });
