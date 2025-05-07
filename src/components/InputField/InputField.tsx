import { Text, TextInput, View} from 'react-native';
import { styles } from './InputField.styles';

interface InputFieldProps {
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  required?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' ;

}

const InputField = ({
  value,
  placeholder,
  onChangeText,
  error,
  secureTextEntry,
  required,
  keyboardType = 'default',
}: InputFieldProps) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        placeholder={required ? `${placeholder} *` : placeholder}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};



export default InputField;
