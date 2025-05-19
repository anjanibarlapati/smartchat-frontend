import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

export const getStyles = (theme: Theme) => StyleSheet.create({
    headerStyle: {
        backgroundColor: theme.primaryBackground,
    },
    container: {
        flex: 1,
        backgroundColor: theme.primaryBackground,
    },

});
