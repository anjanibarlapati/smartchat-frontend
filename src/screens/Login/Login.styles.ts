import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoStyles: {
        width: 250,
        height: 250,
        resizeMode: 'contain',
        marginBottom:90,
      },
      inputfields: {
        gap: 1,
        marginTop: '-10%',
        marginBottom: '5%',
        width: '90%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      text: {
        fontFamily: 'Nunito',
      },
      registerView: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: '2%',
        gap:5,
        marginTop:17,
      },
      registerText: {
        color: '#008080',
        fontWeight: 'bold',
        fontFamily: 'Nunito',
      },
});
