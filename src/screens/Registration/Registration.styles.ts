import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

export const getStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryBackground,
  },
  body: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  img: {
    height: 120,
    width: 120,
    borderRadius: 60,
  },
  inputfields: {
    gap: 1,
    marginTop: '5%',
    marginBottom: '5%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Nunito-Regular',
    color: theme.primaryTextColor,
  },
  loginView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '2%',
    gap: 5,
  },
  loginText: {
    color: theme.primaryColor,
    fontFamily: 'Nunito-Bold',
  },
  phoneInputWrapper: {
    width: '75%',
    marginTop: 10,
    marginBottom: 10,
  },
  phoneInput: {
    height: 40,
    width: '100%',
    borderColor: theme.primaryInputBackground,
    backgroundColor: theme.primaryInputBackground,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    fontFamily:'Nunito-Regular',
  },
  errorText: {
    color: theme.primaryErrorText,
    fontSize: 12,
    marginTop: 5,
    fontFamily:'Nunito-Regular',
  },
});
