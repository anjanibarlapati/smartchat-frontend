import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

export const getStyles = (theme: Theme) => StyleSheet.create({
    container:{
      flex: 1,
      backgroundColor: theme.primaryBackground,

    },
    scrollContainer:{
      display:'flex',
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
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
        color: theme.primaryTextColor,
      },
      registerView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center',
        marginBottom: '2%',
        gap:5,
        marginTop:17,
      },
      registerText: {
        color: theme.primaryColor,
        fontWeight: 'bold',
        fontFamily: 'Nunito',
      },
});
