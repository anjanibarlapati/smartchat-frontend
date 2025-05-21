import LottieView from 'lottie-react-native';
import {View} from 'react-native';
import {getStyles} from './Loading.styles.ts';
interface LoadingIndicatorProps {
  visible: boolean;
}
const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({visible}) => {
  const styles = getStyles();
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay} testID="animation">
      <LottieView
        source={require('../../../assets/loadingImages/loadingImage.json')}
        autoPlay
        loop
        style={styles.lottieView}
      />
    </View>
  );
};
export default LoadingIndicator;
