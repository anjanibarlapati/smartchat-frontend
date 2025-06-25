import { useNavigation } from '@react-navigation/native';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../../hooks/appTheme';
import { HomeScreenNavigationProps } from '../../types/Navigations';
import { Theme } from '../../utils/themes';
import { getStyles } from './ChatHeader.styles';

interface ChatHeaderProps {
    name: string,
    originalNumber: string,
    profilePic: string | null,
    isSelfChat: boolean,
    isOnline: boolean
}

export const ChatHeader = ({name, profilePic, isSelfChat, isOnline}: ChatHeaderProps) => {
    const theme: Theme = useAppTheme();
    const styles = getStyles(theme);
    const navigation = useNavigation<HomeScreenNavigationProps>();
    const handleNavigation = ()=>{
        navigation.replace('Home');
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
                    {`${name}${isSelfChat ? ' (You)' : ''}`}
                </Text>
                 {!isSelfChat && (
                 <Text style={[styles.statusText, isOnline && styles.onlineStatusText]}>
                     {isOnline ? 'Online' : ''}
                </Text>
                )}

            </View>
        </View>
    </View>
  );
};
