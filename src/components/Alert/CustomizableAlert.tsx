import { Image, Modal, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../../hooks/appTheme';
import { AlertType } from '../../types/AlertType';
import { Theme } from '../../utils/themes';
import { getStyles } from './CustomizableAlert.styles';

interface CustomizableAlertProps {
  visible: boolean;
  message: string;
  type?: AlertType;
  onClose: () => void;
}

const iconForAlertType = (type: AlertType) => {
  switch (type) {
    case 'success':
      return require('../../../assets/icons/success.png');
    case 'error':
      return require('../../../assets/icons/error.png');
    case 'warning':
      return require('../../../assets/icons/warning.png');
    case 'info':
    default:
      return require('../../../assets/icons/info.png');
  }
};

export const CustomizableAlert = ({
  visible,
  message,
  type = 'info',
  onClose,
}: CustomizableAlertProps) => {
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme);

  const icon = iconForAlertType(type);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.box}>
          <Image
            source={icon}
            resizeMode="contain"
            style={styles.iconImage}
            accessibilityLabel="Icon-Image"
          />
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
