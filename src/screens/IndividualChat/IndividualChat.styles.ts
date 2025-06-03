import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

export const getStyles = (theme: Theme) => StyleSheet.create({
    headerStyle: {
        backgroundColor: theme.primaryBackground,
        paddingRight: 20,
    },
    container: {
        flex: 1,
        backgroundColor: theme.primaryBackground,
        padding: 8,
    },
    box: {
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.secondaryBackground,
    },
    blockedText: {
      color: theme.secondaryTextColor,
      fontSize: 14,
      textAlign: 'center',
    },
    headerBox: {
        backgroundColor: theme.primaryBackground,
        width: '90%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

});
