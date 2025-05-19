import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

export const getStyles = (theme: Theme) => StyleSheet.create({
    overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: theme.primaryBackground,
    borderRadius: 10,
    padding: 25,
    width: '80%',
    elevation: 5,
  },
message: {
    fontSize: 16,
    fontFamily:'Nunito-Bold',
    textAlign: 'center',
    marginBottom: 25,
    color:'#008080',
  },
buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cancelText: {
    color: theme.secondaryTextColor,
    fontFamily:'Nunito-Bold',
  },
  confirmText: {
    color: theme.primaryColor,
    fontFamily:'Nunito-Bold',
  },
});
