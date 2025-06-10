import { Image, TouchableOpacity } from 'react-native';
import { styles } from './Menu.styles';

interface MenuProps {
  onClick: () => void;
}
export const Menu = ({ onClick }: MenuProps) => {

  return (
      <TouchableOpacity onPress={onClick} style={styles.menuBox}  accessibilityLabel={'Menu'}>
        <Image
          source={require('../../../assets/icons/menu.png')}
          style={styles.menuIcon}
          accessibilityLabel="Menu-Image"
        />
      </TouchableOpacity>
  );
};
