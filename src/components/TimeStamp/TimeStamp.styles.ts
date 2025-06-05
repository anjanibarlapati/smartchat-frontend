import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

export const getStyles = (theme: Theme)=> StyleSheet.create({
    timeStamp: {
        fontSize:13,
        color: theme.secondaryTextColor,
        fontFamily:'Nunito-SemiBold',
    },
    timeStampBold: {
        fontSize:13,
        color: theme.secondaryTextColor,
        fontFamily:'Nunito-Bold',
    },
});


