import { Text, TextInput, useWindowDimensions, View} from 'react-native';
import { getStyles } from './InputField.styles';
import { Theme } from '../../utils/themes';
import { useAppTheme } from '../../hooks/appTheme';
import { EyeIcon } from '../EyeIcon/EyeIcon';

interface InputFieldProps {
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  required?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' ;
  showToggle?: boolean;
  showPassword?: boolean;
  togglePasswordVisibility?: () => void;
}

const InputField = ({
  value,
  placeholder,
  onChangeText,
  error,
  secureTextEntry,
  required,
  keyboardType = 'default',
  showToggle = false,
  showPassword = false,
  togglePasswordVisibility,
}: InputFieldProps) => {
  const { width } = useWindowDimensions();
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme, width);
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          placeholder={required ? `${placeholder} *` : placeholder}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
        />
        {showToggle && togglePasswordVisibility && (
            <EyeIcon showPassword={showPassword} togglePasswordVisibility={togglePasswordVisibility}/>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};



export default InputField;

