import {StyleSheet} from 'react-native';
import {Theme} from '../../utils/themes';

export const getStyles = (theme: Theme, width:number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.primaryBackground,
    },
    headerText: {
      fontSize: width > 600 ? 32 : 25,
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
      paddingTop: width > 600 ? '15%' : '40%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      margin: 10,
    },

    homeImageStyles: {
      height: width > 600 ? 300 : 250,
      width: width > 600 ?  300 : 250,
      resizeMode: 'contain',
      marginBottom: 10,
    },
    bodyText: {
      fontSize: width > 600 ? 24 : 20,
      textAlign: 'center',
      fontFamily: 'Nunito-Bold',
      color: theme.primaryTextColor,
    },
    addContactContainer: {
      margin: 20,
      display: 'flex',
      position: 'absolute',
      bottom: 0,
      right: width > 600 ? 50 : 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#008080',
      height: width > 700 ? '10%' : '8%',
      width: width > 600 ? '10%' : '15%',
      borderRadius: 10,
    },
    addContactImage: {
      height: width > 600 ? 55 : 45,
      width: width > 600 ? 65 : 45,
    },
  });
