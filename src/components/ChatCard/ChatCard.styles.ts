import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

const getStyles = (theme: Theme, unreadCount: number) => StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.primaryBackground,
        paddingVertical: 15,
        paddingHorizontal: 16,
        borderBottomColor: '#ccc',
    },
    profileImage: {
        width: 55,
        height: 55,
        borderRadius: 50,
        marginRight: 12,
    },
    chatContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    personName: {
        color: theme.primaryTextColor,
        fontSize: 16,
        fontWeight: 'bold',
        overflow: 'hidden',
    },
    latestMessage: {
        color: theme.secondaryTextColor,
        fontSize: 14,
        marginTop: 2,
        overflow: 'hidden',
    },
    badgeTimeContainer: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingBottom: 2,
        minHeight: 50,
    },

    timeText: {
        marginTop: -22,
        fontSize: 12,
        color: (unreadCount > 0) ? '#008080' : theme.secondaryTextColor,
    },

    badgeWrapper: {
        marginTop: -5,
        alignSelf: 'flex-end',
        marginRight: 0,

    },
});

export { getStyles };
