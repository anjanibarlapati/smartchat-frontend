import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

export const getStyles = (theme: Theme)=> StyleSheet.create({
    timeStamp: {
        color: theme.secondaryTextColor,
        fontFamily:'Nunito',
    },
    timeStampBold: {
        color: theme.secondaryTextColor,
        fontWeight:'800',
        fontFamily:'Nunito',
    },
});


