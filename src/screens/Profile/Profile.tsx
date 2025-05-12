import { useEffect } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { ProfileInfoTile } from '../../components/ProfileInfoTile/ProfileInfoTile';
import { useAppTheme } from '../../hooks/appTheme';
import { getStyles } from './Profile.styles';
import { userState } from '../../types/User';
import { Theme } from '../../utils/themes';

export const Profile = (): React.JSX.Element => {

  const userDetails = useSelector((state: userState) => state.user);
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();

  useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Profile',
            headerTitleStyle: styles.headerTitleStyle,
            headerStyle: styles.headerBackgroundColor ,
        });
  }, [navigation, styles.headerBackgroundColor, styles.headerTitleStyle]);

  return (
    <View style={styles.container}>
      <View style={styles.profileImg}>
        <Image
          source={
            userDetails.profilePicture
              ? {uri: userDetails.profilePicture}
              : require('../../../assets/images/profileImage.png')
          }
          resizeMode="cover"
          style={styles.profileImg}
          accessibilityLabel="ProfilePicture"
        />
        <TouchableOpacity
          style={styles.editProfileImgBox}
          onPress={() => {
          }}>
          <Image
            source={require('../../../assets/icons/camera-icon.png')}
            style={styles.editIcon}
            accessibilityLabel="editIcon"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.detailsContainer}>
        <ProfileInfoTile
          label={'First Name'}
          value={userDetails.firstName}
          image={require('../../../assets/icons/user-icon.png')}
        />
        <ProfileInfoTile
          label={'Last Name'}
          value={userDetails.lastName}
          image={require('../../../assets/icons/user-icon.png')}
        />
        <ProfileInfoTile
          label={'Email'}
          value={userDetails.email}
          image={require('../../../assets/icons/email.png')}
        />
        <ProfileInfoTile
          label={'Contact'}
          value={`${userDetails.countryCode} ${userDetails.mobileNumber}`}
          image={require('../../../assets/icons/contact.png')}
        />
        <ProfileInfoTile
          label={'Change Password'}
          value={'*******'}
          image={require('../../../assets/icons/password.png')}
        />
        <TouchableOpacity style={styles.box}>
          <Image
            source={require('../../../assets/icons/delete.png')}
            resizeMode="contain"
            style={styles.image}
          />
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box}>
          <Image
            source={require('../../../assets/icons/logout.png')}
            resizeMode="contain"
            style={styles.deleteImg}
          />
          <Text style={styles.valueText}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
