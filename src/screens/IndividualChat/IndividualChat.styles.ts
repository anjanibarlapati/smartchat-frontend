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
    },
    messageContainer:{
      flex:1,
      padding:8,
    },
    inputContainer:{
      paddingBottom:8,
      paddingHorizontal: 8,
    },
    blockedMessageContainer: {
      backgroundColor: '#B2D8D8',
      paddingVertical: 18,
    },
    box: {
      padding: 16,
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
     dayContainer: {
      alignItems: 'center',
    },

});
