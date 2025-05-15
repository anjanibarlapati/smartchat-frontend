import { useEffect, useRef, useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { ProfileInfoTile } from '../../components/ProfileInfoTile/ProfileInfoTile';
import { ProfilePicturePickerModal } from '../../components/ProfilePicturePickerModal/ProfilePicturePickerModal';
import { useAppTheme } from '../../hooks/appTheme';
import LoadingScreen from '../Loading/Loading';
import { deleteAccount, removeProfilePic, updateProfilePic } from './Profile.handler';
import { getStyles } from './Profile.styles';
import { storeState } from '../../redux/store';
import { setUserProperty } from '../../redux/userReducer';
import { WelcomeScreenNavigationProps } from '../../types/Navigations';
import { UploadImage } from '../../types/UploadImage';
import { getTokens } from '../../utils/getTokens';
import { Theme } from '../../utils/themes';

export const Profile = (): React.JSX.Element => {

  const userDetails = useSelector((state: storeState) => state.user);
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation<WelcomeScreenNavigationProps>();
  const dispatch = useDispatch();

  const [editField, setEditField] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(userDetails.profilePicture || null);
  const [uploadImage, setUploadImage] = useState<UploadImage | string | null>(null);
  const [visibleProfilePicModal, setVisibleProfilePicModal] = useState(false);
  const imageUploaded = useRef(false);

  useEffect(() => {
        navigation.setOptions({
            headerTitle: 'Profile',
            headerTitleStyle: styles.headerTitleStyle,
            headerStyle: styles.headerBackgroundColor ,
        });
  }, [navigation, styles.headerBackgroundColor, styles.headerTitleStyle]);

  useEffect(() => {
      const handleUploadProfilePic = async () => {
        if(!uploadImage || imageUploaded.current) {
          return;
        }
        imageUploaded.current = true;
        setLoading(true);
        try {
          const tokens = await getTokens(userDetails.mobileNumber);
          if(!tokens) {
            Alert.alert('Invalid Access tokens');
            return;
          }
          const formData = new FormData();
          formData.append('profilePicture', uploadImage);
          formData.append('mobileNumber', userDetails.mobileNumber);
          const response = await updateProfilePic(formData, tokens.access_token);
          const result = await response.json();
          if (response.ok) {
            const updatedUser = {
              ...userDetails,
              profilePicture: result.profilePicture,
            };
            dispatch(setUserProperty({
              property: 'profilePicture',
              value: result.profilePicture,
            }));
            setProfilePicUrl(result.profilePicture);
            await EncryptedStorage.setItem('User Data', JSON.stringify(updatedUser));
            Alert.alert('Profile picture updated');
          } else {
            Alert.alert(result.message || 'Failed to upload profile picture');
          }
        } catch (error) {
          Alert.alert('Upload failed', 'Please try again later!');
        } finally {
          setUploadImage(null);
          setLoading(false);
        }
      };

      if(uploadImage) {
        handleUploadProfilePic();
      }

  }, [dispatch, uploadImage, userDetails]);

  const signout = async() => {
    await EncryptedStorage.clear();
    navigation.navigate('WelcomeScreen');
  };

  const handleRemoveProfile = async() => {
    const tokens = await getTokens(userDetails.mobileNumber);
    if(!tokens) {
      Alert.alert('Invalid Access tokens');
      return;
    }
    const response = await removeProfilePic(profilePicUrl as string, userDetails.mobileNumber, tokens.access_token);
    if(response.ok) {
        const updatedUser = {
            ...userDetails,
            profilePicture: '',
        };
        dispatch(setUserProperty({
            property: 'profilePicture',
            value: '',
        }));
        await EncryptedStorage.setItem('User Data', JSON.stringify(updatedUser));
        Alert.alert('Successfully Removed');
    }
    setProfilePicUrl('');
    setVisibleProfilePicModal(false);
  };

  const accountDelete = async() => {
    const tokens = await getTokens(userDetails.mobileNumber);
    if(!tokens) {
      Alert.alert('Invalid Access tokens');
      return;
    }
    try{
      const response = await deleteAccount(userDetails.mobileNumber, tokens.access_token);
      if(response.ok) {
        await EncryptedStorage.clear();
        navigation.navigate('WelcomeScreen');
      } else {
        Alert.alert('Failed to delete');
      }
    } catch(error) {
      Alert.alert('Failed to delete!');
    }
  };

  if(isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileImg}>
        <Image
          source={
            profilePicUrl?.trim()
              ? {uri: profilePicUrl}
              : require('../../../assets/images/profileImage.png')
          }
          resizeMode="cover"
          style={styles.profileImg}
          accessibilityLabel="ProfilePicture"
        />
        <TouchableOpacity
          style={styles.editProfileImgBox}
          onPress={() => {
            setVisibleProfilePicModal(true);
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
          editField={editField}
          setEditField={setEditField}
        />
        <ProfileInfoTile
          label={'Last Name'}
          value={userDetails.lastName}
          image={require('../../../assets/icons/user-icon.png')}
          editField={editField}
          setEditField={setEditField}
        />
        <ProfileInfoTile
          label={'Email'}
          value={userDetails.email}
          image={require('../../../assets/icons/email.png')}
          editField={editField}
          setEditField={setEditField}
        />
        <ProfileInfoTile
          label={'Contact'}
          value={`${userDetails.countryCode} ${userDetails.mobileNumber}`}
          image={require('../../../assets/icons/contact.png')}
          editField={editField}
          setEditField={setEditField}
        />
        <ProfileInfoTile
          label={'Change Password'}
          value={'*******'}
          image={require('../../../assets/icons/password.png')}
          editField={editField}
          setEditField={setEditField}
        />
        <TouchableOpacity style={styles.box} onPress={() => {accountDelete();}}>
          <Image
            source={require('../../../assets/icons/delete.png')}
            resizeMode="contain"
            style={styles.image}
          />
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box} onPress={signout}>
          <Image
            source={require('../../../assets/icons/logout.png')}
            resizeMode="contain"
            style={styles.deleteImg}
          />
          <Text style={styles.valueText}>Sign out</Text>
        </TouchableOpacity>
        <ProfilePicturePickerModal
          isEditingProfilePicture={visibleProfilePicModal}
          close={() => {setVisibleProfilePicModal(false);}}
          profilePicture={userDetails.profilePicture || null}
          setProfilePic={setUploadImage}
          remove={handleRemoveProfile}
        />
      </View>
    </View>
  );
};
