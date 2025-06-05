import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

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
    totalContainer: {
      flex: 1,
    },
    textContainer: {
      display: 'flex',
      flex:1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
    },
    unreadTextContainer: {
      display: 'flex',
      flex:1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      gap:15,
    },
    homeChatsContainer:{
      flex:1,
      display:'flex',
      flexDirection:'row',
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
    unReadBodyText: {
      fontSize: width > 600 ? 24 : 20,
      textAlign: 'center',
      fontFamily: 'Nunito-Regular',
      color: theme.primaryTextColor,
    },
    viewText:{
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'Nunito-Bold',
        color: theme.primaryColor,
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
