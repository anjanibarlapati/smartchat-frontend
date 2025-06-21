import { TouchableOpacity, Image } from 'react-native';
import { useAppTheme } from '../../hooks/appTheme';
import { getStyles } from './EyeIcon.styles';
import { Theme } from '../../utils/themes';

type EyeIconProps ={
  showPassword: boolean;
  togglePasswordVisibility: () => void;
}

export const EyeIcon = ({showPassword, togglePasswordVisibility}: EyeIconProps)=>{
    const styles = getStyles();
    const theme: Theme = useAppTheme();
    return(
        <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeIconWrapper}>
            <Image
            source={showPassword ? theme.images.eyeIcon : theme.images.eyeOffIcon}
            style={styles.eyeIcon}
            resizeMode="contain"
            accessibilityLabel="eye-icon"
            />
        </TouchableOpacity>
    );
};
