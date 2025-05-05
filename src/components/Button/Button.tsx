import { Text, TouchableOpacity} from 'react-native';
import { styles } from './Button.styles';

interface ButtonProps {
  label: string;
  onPress?: () => void;
}

const Button = ({label, onPress}: ButtonProps) => {
  return (
    <TouchableOpacity style={styles.buttonColor} onPress={onPress}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
};



export default Button;
