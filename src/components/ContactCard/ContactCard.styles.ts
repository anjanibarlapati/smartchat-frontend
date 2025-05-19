import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

const getStyles = (theme: Theme) => StyleSheet.create({
    body:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        gap:20,
        backgroundColor: theme.primaryBackground,
        paddingVertical:10,
        paddingLeft:15,
        paddingRight: 40,
    },
    profileIcon: {
        width: 55,
        height: 55,
        borderRadius:50,
    },
    contactContainer: {
        display: 'flex',
        flexDirection:'column',
        gap:5,
        width:'80%',
    },
    nameInviteContainer:{
        display:'flex',
        flexDirection:'row',
        justifyContent: 'space-between',
        gap:10,
    },
    contactName: {
        color: theme.primaryTextColor,
        fontSize: 18,
        width:'75%',
        overflow:'hidden',
    },
    contactNumber:{
        color: theme.secondaryTextColor,
        fontSize: 14,
        fontFamily:'Nunito',
    },
    inviteText:{
        color: theme.primaryColor,
        fontSize: 16,
        fontWeight: '600',
        fontFamily:'Nunito',
    },
});

export { getStyles };

