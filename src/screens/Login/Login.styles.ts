import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';

export const getStyles = (theme: Theme, width: number) => StyleSheet.create({
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
    width: width > 600 ? 300 : 250,
    height: width > 600 ? 300 : 250,
    resizeMode: 'contain',
    marginBottom: width > 600 ? 120 : 90,
  },
  inputfields: {
    gap: 1,
    marginTop: width > 600 ? -40 : -60,
    marginBottom: '5%',
    width: width > 600 ? '60%' : '90%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Nunito-Regular',
    color: theme.primaryTextColor,
    fontSize: width > 600 ? 18 : 14,
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
    fontSize: width > 600 ? 16 : 14,

  },
  phoneInputWrapper: {
    width: width > 600 ? '76%' : '75%',
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
    fontSize: width > 600 ? 16 : 14,

  },
  errorText: {
    color: theme.primaryErrorText,
    fontSize: width > 600 ? 14 : 12,
    marginTop: 5,
    fontFamily: 'Nunito-Regular',
  },
});
