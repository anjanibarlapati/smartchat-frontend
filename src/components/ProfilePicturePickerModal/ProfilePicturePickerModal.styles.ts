import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container:{
        display:'flex',
        height:'100%',
        justifyContent:'flex-end',
    },
    body:{
        display:'flex',
        padding:'2%',
        backgroundColor:'rgb(186, 224, 224)',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor:'black',
        shadowOffset:{width:1, height:1},
        shadowOpacity:3,
        shadowRadius:3,
        elevation:4,
        gap:20,
    },
    bar:{
        display:'flex',
        alignItems:'center',
    },
    subBar:{
        backgroundColor:'black',
        borderRadius:10,
        width:50,
        height:5,
    },
    header:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        gap:'30%',
        paddingHorizontal:'5%',
    },
    cancelIcon:{
        width:15,
        height:15,
    },
    text: {
        color: 'black',
        fontSize:18,
        fontWeight: 'bold',
        fontFamily: 'Nunito',
    },
    icons:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        paddingHorizontal:'15%',
        paddingTop:'5%',
        paddingBottom:'15%',
        gap:'30%',
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
        color: 'black',
        fontSize:12,
        fontWeight: 'bold',
        fontFamily: 'Nunito',
    },
});
