import {View} from 'react-native';
import LottieView from 'lottie-react-native';
import {loadingImage} from './LoadingScreen.ts';
const LoadingScreen = () => {
  return (
    <View style={loadingImage.container}>
      <View style={loadingImage.loadingImage} testID="animation">
        <LottieView
          style={{flex: 1}}
          source={require('../../../../assets/loadingImages/loadingImage.json')}
          autoPlay
          loop
        />
      </View>
    </View>
  );
};
export default LoadingScreen;
