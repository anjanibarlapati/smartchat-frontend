import {getStyles} from './Loading.styles.ts';
import LottieView from 'lottie-react-native';
import {View} from 'react-native';
import { useAppTheme } from '../../hooks/appTheme.ts';
import { Theme } from '../../utils/themes.ts';
function LoadingScreen():React.JSX.Element{

  const theme: Theme = useAppTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.loadingImage} testID="animation">
        <LottieView
          style={styles.lottieView}
          source={require('../../../assets/loadingImages/loadingImage.json')}
          autoPlay
          loop
        />
      </View>
    </View>
  );
}

export default LoadingScreen;
