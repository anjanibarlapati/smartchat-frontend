import {StyleSheet} from 'react-native';
import {Theme} from '../../utils/themes';

export const Badgestyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: 24,
      height: 24,
      borderRadius: 50,
      backgroundColor: theme.badgeBackground,
      justifyContent: 'center',
      alignItems: 'center',
    },
    smallContainer:{
      width: 20,
      height: 20,
      borderRadius: 50,
      backgroundColor: theme.badgeBackground,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: theme.badgeTextColor,
      fontSize: 12,
      fontFamily:'Nunito-Bold',
    },
  });
