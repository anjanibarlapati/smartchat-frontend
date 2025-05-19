import {StyleSheet} from 'react-native';
import {Theme} from '../../utils/themes';

export const Badgestyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: 10,
      right: 10,
      minWidth: 24,
      height: 24,
      paddingHorizontal: 6,
      borderRadius: 12,
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
