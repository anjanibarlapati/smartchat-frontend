import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

export const getStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primaryBackground,

  },
  scrollContainer: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoStyles: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 90,
  },
  inputfields: {
    gap: 1,
    marginTop: '-10%',
    marginBottom: '5%',
    width: '90%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Nunito-Regular',
    color: theme.primaryTextColor,
  },
  registerView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '2%',
    gap: 5,
    marginTop: 17,
  },
  registerText: {
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
    fontFamily: 'Nunito-Regular',
  },
  errorText: {
    color: theme.primaryErrorText,
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'Nunito-Regular',
  },
});
