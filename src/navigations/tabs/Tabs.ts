import { Platform, StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

export const getStyles = (theme: Theme) => StyleSheet.create({
    container:{
        display:'flex',
        flexDirection:'column',
        alignItems: 'center',
        justifyContent:'center',
        height: 55,
        width: 65,
        marginTop: 45,
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
        backgroundColor: theme.tabBackgroundColor,
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
        color: theme.primaryTextColor,
        fontSize: 12,
        fontWeight: '500',
        fontFamily: Platform.OS === 'ios' ? 'Nunito' : '',
    },
    focusedText:{
        fontWeight:'800',
    },
});




