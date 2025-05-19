import {StyleSheet} from 'react-native';
import {Theme} from '../../utils/themes';

export const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.primaryBackground,
    },
    headerText: {
      fontSize: 25,
      fontFamily: 'Nunito-Bold',
      color: theme.primaryColor,
    },
    bodyContainer: {
      display: 'flex',
      zIndex: -1,
      position: 'relative',
    },
    totalContainer: {
      flex: 1,
    },
    textContainer: {
      marginTop: '75%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      margin: 10,
    },
    bodyText: {
      fontSize: 20,
      textAlign: 'center',
      fontFamily: 'Nunito-Bold',
      color: theme.primaryTextColor,
    },
    addContactContainer: {
      margin: 20,
      display: 'flex',
      position: 'absolute',
      bottom: 0,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#008080',
      height: '8%',
      width: '14%',
      borderRadius: 10,
    },
    addContactImage: {
      height: 40,
      width: 40,
    },
  });
