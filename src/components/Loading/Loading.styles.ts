import {Dimensions, StyleSheet} from 'react-native';
export const getStyles = () =>
  StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    },
    lottieView: {
      width: 130,
      height: 130,
    },
  });
