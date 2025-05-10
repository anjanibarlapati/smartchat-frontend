import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container:{
        display:'flex',
        flexDirection:'column',
        alignItems: 'center',
        justifyContent:'center',
        height: 55,
        width: 65,
        marginTop: 35,
        gap:5,
    },
    tabIconContainer:{
       width: 55,
       height: 40,
       justifyContent: 'center',
       alignItems: 'center',
       borderRadius:20,
    },
    focused: {
        backgroundColor: 'rgba(0, 128, 128, 0.25)',
      },
      unfocused: {
        backgroundColor: 'transparent',
    },
    icon:{
        width: 30,
        height: 30,
        resizeMode:'contain',
    },
    label:{
        color: 'black',
        fontSize: 12,
        fontWeight: '500',
        fontFamily: Platform.OS === 'ios' ? 'Nunito' : '',
    },
    focusedText:{
        fontWeight:'800',
    },
});




