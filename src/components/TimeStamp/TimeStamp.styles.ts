import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

export const getStyles = (theme: Theme)=> StyleSheet.create({
    timeStamp: {
        color: theme.secondaryTextColor,
        fontFamily:'Nunito-SemiBold',
    },
    timeStampBold: {
        color: theme.secondaryTextColor,
        fontFamily:'Nunito-Bold',
    },
});


