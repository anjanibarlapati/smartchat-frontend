import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

export const getStyles = (theme: Theme) => StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        gap: 10,
        backgroundColor: theme.primaryBackground,
        paddingLeft: 20,
    },
    profielDetailsContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap:15,
        width: '100%',
    },
    profileImage: {
        height:40,
        width:40,
        borderRadius: 50,
    },
    profileDetails: {
        display: 'flex',
        justifyContent: 'flex-start',
        gap:2,
    },
    nameText: {
        fontSize: 16,
        color: theme.primaryTextColor,
        fontFamily:'Nunito-Bold',
    },
    numberText: {
        fontSize: 14,
        color: theme.primaryTextColor,
        fontFamily:'Nunito-SemiBold',
    },
    backIcon: {
        height: 30,
        width: 30,
    },
    backImage: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
