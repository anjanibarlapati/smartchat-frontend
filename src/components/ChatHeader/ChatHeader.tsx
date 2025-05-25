import { View, Text, Image, TouchableOpacity } from 'react-native';
import { getStyles } from './ChatHeader.styles';
import { useAppTheme } from '../../hooks/appTheme';
import { Theme } from '../../utils/themes';
import { useNavigation } from '@react-navigation/native';

interface ChatHeaderProps {
    name: string,
    originalNumber: string,
    profilePic?: string | null
}

export const ChatHeader = ({name, originalNumber, profilePic}: ChatHeaderProps) => {
    const theme: Theme = useAppTheme();
    const styles = getStyles(theme);
    const navigation = useNavigation();
    const handleNavigation = ()=>{
        navigation.goBack();
    };

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backImage} onPress={handleNavigation}>
            <Image source={require('../../../assets/images/chevron.png')} style={styles.backIcon} accessibilityLabel="Back-Icon"/>
        </TouchableOpacity>
        <View style={styles.profielDetailsContainer}>
            <Image source={profilePic ? {uri: profilePic} : require('../../../assets/images/profileImage.png')} resizeMode="cover" style={styles.profileImage} accessibilityLabel="Profile-Image"/>
            <View style={styles.profileDetails}>
                <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.nameText}>
                    {name}
                </Text>
                <Text style={styles.numberText}>{originalNumber}</Text>
            </View>
        </View>
    </View>
  );
};
