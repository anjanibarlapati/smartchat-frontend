import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

const getStyles = (theme: Theme) => StyleSheet.create({
    container: {
      display:'flex',
      flexDirection:'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.primaryBackground,
      paddingVertical:10,
      paddingLeft:15,
      paddingRight: 40,
    },
    body:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        gap:20,
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
    },
    contactName: {
        color: theme.primaryTextColor,
        fontSize: 18,
    },
    contactNumber:{
        color: theme.secondaryTextColor,
        fontSize: 14,
    },
    inviteText:{
        color: theme.primaryColor,
        fontSize: 16,
        fontWeight: '600',
    },
});

export { getStyles };

