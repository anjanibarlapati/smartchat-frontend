import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B2D8D8',
  },
  logoStyles: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  appnameTagline: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appname: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 10,
    fontFamily: 'Nunito',
  },
  apptagline: {
    fontSize: 18,
    color: '#004747',
    textAlign: 'center',
    fontFamily: 'Nunito',
    fontWeight:'400',
  },
  getstartButton: {
    width: 250,
    height: 48,
    backgroundColor: '#008080',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  getstartText: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 18,
    color: '#FFFFFF',
    marginRight: 45,
  },

  chevronIconStyles: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
});
