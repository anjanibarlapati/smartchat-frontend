import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

export const getStyles = (theme: Theme) => StyleSheet.create({
    container:{
        display:'flex',
        height:'100%',
        justifyContent:'flex-end',
    },
    body:{
        display:'flex',
        padding:'2%',
        backgroundColor: theme.primaryModalBackground,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: theme.primaryShadowColor,
        shadowOffset:{width:1, height:1},
        shadowOpacity:0.4,
        shadowRadius:3,
        elevation:4,
        gap:20,
    },
    bar:{
        display:'flex',
        alignItems:'center',
    },
    subBar:{
        backgroundColor:theme.secondaryTextColor,
        borderRadius:10,
        width:35,
        height:5,
    },
    header:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        gap:110,
        paddingHorizontal:'5%',
    },
    cancelIcon:{
        width:15,
        height:15,
    },
    text: {
        color: theme.primaryTextColor,
        fontSize:18,
        fontWeight: 'bold',
        fontFamily: 'Nunito',
    },
    icons:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:'15%',
        paddingTop:'5%',
        paddingBottom:'15%',
        gap:70,
    },
    icon:{
        width:45,
        height:45,
    },
    iconContainer:{
        display:'flex',
        alignItems:'center',
        gap:0,
    },
    iconText:{
        color: theme.primaryTextColor,
        fontSize:12,
        fontWeight: 'bold',
        fontFamily: 'Nunito',
    },
});
