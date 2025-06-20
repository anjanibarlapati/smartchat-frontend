import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

export const getStyles = (theme: Theme)=> StyleSheet.create({
    timeStamp: {
        color: theme.secondaryTextColor,
        fontFamily:'Nunito-SemiBold',
    },
    timeStampBold: {
        color: theme.primaryShadowColor,
        fontFamily:'Nunito-Bold',
    },
    unreadTimeTesxt: {
        fontSize: 12,
        color:'#008080',
        fontFamily: 'Nunito-Bold',
    },
    timeText: {
        fontSize: 12,
        color: theme.secondaryTextColor,
        fontFamily: 'Nunito-SemiBold',
    },
});
