import { Text, TouchableOpacity} from 'react-native';
import { getStyles } from './Button.styles';
import { Theme } from '../../utils/themes';
import { useAppTheme } from '../../hooks/appTheme';
interface ButtonProps {
  label: string;
  onPress?: () => void;
}

const Button = ({label, onPress}: ButtonProps) => {
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme);
  return (
    <TouchableOpacity style={styles.buttonColor} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
};



export default Button;
