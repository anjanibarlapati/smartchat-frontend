import {StyleSheet} from 'react-native';
import {Theme} from '../../utils/themes';

export const getStyles = (theme: Theme) =>
  StyleSheet.create({
    bodyText: {
      fontSize: 20,
      textAlign: 'center',
      fontFamily: 'Nunito',
      color: theme.primaryTextColor,
    },
    viewText:{
        marginTop:15,
        fontWeight:'bold',
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'Nunito',
        color: theme.primaryColor,
    },
  });
