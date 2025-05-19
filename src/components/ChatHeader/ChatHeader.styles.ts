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
        paddingLeft: 10,
    },
    profielDetailsContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap:10,
        backgroundColor: theme.primaryBackground,
        width: '100%',
    },
    profileImage: {
        height:35,
        width:35,
        borderRadius: 20,
    },
    profileDetails: {
        display: 'flex',
        justifyContent: 'flex-start',
        gap:2,
    },
    nameText: {
        fontSize: 12,
        color: theme.primaryTextColor,
        fontFamily:'Nunito-Bold',
    },
    numberText: {
        fontSize: 10,
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
