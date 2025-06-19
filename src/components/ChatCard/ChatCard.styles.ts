import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

const getStyles = (theme: Theme, unreadCount: number) => StyleSheet.create({
    cardContainer: {
        display:'flex',
        width:'100%',
        flexDirection: 'row',
        backgroundColor: theme.primaryBackground,
        paddingVertical: 15,
        paddingHorizontal: 16,
        borderBottomColor: '#ccc',
        gap:10,
    },
    profileImage: {
        width: 55,
        height: 55,
        borderRadius: 50,
    },
    chatContent: {
        display:'flex',
        flexDirection: 'column',
        gap:5,
        alignItems: 'flex-start',
        justifyContent:'center',
    },
    textContainer: {
        display:'flex',
        width:'90%',
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    personName: {
        color: theme.primaryTextColor,
        fontSize: 16,
        fontWeight: 'bold',
        overflow: 'hidden',
        fontFamily:'Nunito-SemiBold',
    },
    latestMessage: {
        color: theme.secondaryTextColor,
        fontSize: 15,
        overflow: 'hidden',
        fontFamily:'Nunito-SemiBold',
    },
    timeText: {
        fontSize: 12,
        color: (unreadCount > 0) ? '#008080' : theme.secondaryTextColor,
        fontFamily:(unreadCount > 0) ? 'Nunito-Bold' : 'Nunito-SemiBold',
    },
    tickIcon: {
      width: 16,
      height: 16,
    },
    messageContainer:{
        display:'flex',
        position: 'static',
        width: '90%',
        flexDirection:'row',
        gap:5,
        alignItems:'center',
    },
});

export { getStyles };
