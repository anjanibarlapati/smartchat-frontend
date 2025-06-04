import { Image, TouchableOpacity } from 'react-native';
import { styles } from './Menu.styles';

export const Menu = ({onClick}: {onClick: () => void}) => {

  return (
      <TouchableOpacity onPress={onClick} style={styles.menuBox}>
        <Image
          source={require('../../../assets/icons/menu.png')}
          style={styles.menuIcon}
          accessibilityLabel="Menu-Image"
        />
      </TouchableOpacity>
  );
};
