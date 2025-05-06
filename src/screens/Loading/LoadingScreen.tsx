import {loadingImage} from './LoadingScreen.styles.ts';
import LottieView from 'lottie-react-native';
import {View} from 'react-native';
function LoadingScreen():React.JSX.Element{
  return (
    <View style={loadingImage.container}>
      <View style={loadingImage.loadingImage} testID="animation">
        <LottieView
          style={loadingImage.lottieView}
          source={require('../../../assets/loadingImages/loadingImage.json')}
          autoPlay
          loop
        />
      </View>
    </View>
  );
}

export default LoadingScreen;
