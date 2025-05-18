import { Image, TouchableOpacity } from 'react-native';
import { styles } from './Menu.styles';

export const Menu = () => {

  return (
    <TouchableOpacity>
        <Image source={require('../../../assets/icons/menu.png')} style={styles.menuIcon} accessibilityLabel="Menu-Image"/>
    </TouchableOpacity>
  );
};
