import { Text, TextInput, View} from 'react-native';
import { styles } from './InputField.styles';

interface InputFieldProps {
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  required?: boolean;

}

const InputField = ({
  value,
  placeholder,
  onChangeText,
  error,
  secureTextEntry,
  required,
}: InputFieldProps) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        placeholder={required ? `${placeholder} *` : placeholder}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};



export default InputField;
