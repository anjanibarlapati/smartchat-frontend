import { StyleSheet } from 'react-native';
import { Theme } from '../../utils/themes';
export const getStyles = (theme: Theme) => StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.primaryBackground,
  },

  loadingImage: {
    height: 200,
    aspectRatio: 1,
  },
  lottieView:{
    flex:1,
  },
});
