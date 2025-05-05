import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    window: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
    },
    img: {
      height: 120,
      width: 120,
    },
    inputfields: {
      gap: 1,
      marginTop: '5%',
      marginBottom: '5%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontFamily: 'Nunito',
    },
    loginView: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: '2%',
    },
    loginText: {
      color: '#008080',
      fontWeight: 'bold',
      fontFamily: 'Nunito',
    },
    phoneContainer: {
      width: '75%',
      height: 55,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#F2F2F2',
      marginTop: 10,
      backgroundColor: '#F2F2F2',
    },
  });
