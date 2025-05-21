import {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {AlertModal} from '../../components/Modal/AlertModal';
import {ProfileInfoTile} from '../../components/ProfileInfoTile/ProfileInfoTile';
import {ProfilePicturePickerModal} from '../../components/ProfilePicturePickerModal/ProfilePicturePickerModal';
import {useAppTheme} from '../../hooks/appTheme';
import LoadingIndicator from '../../components/Loading/Loading';
import {
  deleteAccount,
  removeProfilePic,
  updateProfilePic,
} from './Profile.services';
import {getStyles} from './Profile.styles';
import {storeState} from '../../redux/store';
import {setUserProperty} from '../../redux/reducers/user.reducer';
import {RootStackParamList} from '../../types/Navigations';
import {UploadImage} from '../../types/UploadImage';
import {getTokens} from '../../utils/getTokens';
import {Theme} from '../../utils/themes';

export const Profile = (): React.JSX.Element => {
  const userDetails = useSelector((state: storeState) => state.user);
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const [editField, setEditField] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [signoutModal, setSignoutModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(
    userDetails.profilePicture || null,
  );
  const [uploadImage, setUploadImage] = useState<UploadImage | string | null>(
    null,
  );
  const [visibleProfilePicModal, setVisibleProfilePicModal] = useState(false);
  const imageUploaded = useRef(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Profile',
      headerTitleStyle: styles.headerTitleStyle,
      headerStyle: styles.headerBackgroundColor,
    });
  }, [navigation, styles.headerBackgroundColor, styles.headerTitleStyle]);

  useFocusEffect(
    useCallback(() => {
      setEditField('');
    }, []),
  );

  useEffect(() => {
    const handleUploadProfilePic = async () => {
      if (!uploadImage || imageUploaded.current) {
        return;
      }
      imageUploaded.current = true;
      setLoading(true);
      try {
        const tokens = await getTokens(userDetails.mobileNumber);
        if (!tokens) {
          await EncryptedStorage.clear();
          navigation.reset({
            index: 0,
            routes: [{name: 'WelcomeScreen'}],
          });
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
          dispatch(
            setUserProperty({
              property: 'profilePicture',
              value: result.profilePicture,
            }),
          );
          setProfilePicUrl(result.profilePicture);
          await EncryptedStorage.setItem(
            'User Data',
            JSON.stringify(updatedUser),
          );
          Alert.alert('Profile picture updated');
        } else {
          Alert.alert(result.message || 'Failed to upload profile picture');
        }
      } catch (error) {
        Alert.alert('Profile upload failed', 'Please try again later!');
      } finally {
        setUploadImage(null);
        setLoading(false);
        imageUploaded.current = false;
      }
    };

    if (uploadImage) {
      handleUploadProfilePic();
    }
  }, [dispatch, navigation, uploadImage, userDetails]);

  const signout = async () => {
    try {
      await EncryptedStorage.clear();
      navigation.reset({
        index: 0,
        routes: [{name: 'WelcomeScreen'}],
      });
    } catch (error) {
      Alert.alert('Something went wrong while signing out. Please try again');
    }
  };

  const handleRemoveProfile = async () => {
    const tokens = await getTokens(userDetails.mobileNumber);
    if (!tokens) {
      await EncryptedStorage.clear();
      navigation.reset({
        index: 0,
        routes: [{name: 'WelcomeScreen'}],
      });
      return;
    }
    try {
      const response = await removeProfilePic(
        profilePicUrl as string,
        userDetails.mobileNumber,
        tokens.access_token,
      );
      if (response.ok) {
        const updatedUser = {
          ...userDetails,
          profilePicture: '',
        };
        dispatch(
          setUserProperty({
            property: 'profilePicture',
            value: '',
          }),
        );
        await EncryptedStorage.setItem(
          'User Data',
          JSON.stringify(updatedUser),
        );
        Alert.alert('Successfully Removed Profile');
      }
      setProfilePicUrl('');
      setVisibleProfilePicModal(false);
    } catch (error) {
      Alert.alert(
        'Something went wrong while removing profile picture. Please try again',
      );
    }
  };

  const accountDelete = async () => {
    try {
      const tokens = await getTokens(userDetails.mobileNumber);
      if (!tokens) {
        await EncryptedStorage.clear();
        navigation.reset({
          index: 0,
          routes: [{name: 'WelcomeScreen'}],
        });
        return;
      }
      const response = await deleteAccount(
        userDetails.mobileNumber,
        tokens.access_token,
      );
      if (response.ok) {
        await EncryptedStorage.clear();
        navigation.reset({
          index: 0,
          routes: [{name: 'WelcomeScreen'}],
        });
      } else {
        Alert.alert('Failed to delete account');
      }
    } catch (error) {
      Alert.alert(
        'Something went wrong while deleting account. Please try again',
      );
    }
  };

  // if(isLoading) {
  //   return <LoadingScreen />;
  // }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}>
      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled">
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
        <LoadingIndicator visible={isLoading} />
        <View style={styles.detailsContainer}>
          <ProfileInfoTile
            label={'First Name'}
            value={userDetails.firstName}
            image={require('../../../assets/icons/user-icon.png')}
            editField={editField}
            setEditField={setEditField}
            setLoading={setLoading}
          />
          <ProfileInfoTile
            label={'Last Name'}
            value={userDetails.lastName}
            image={require('../../../assets/icons/user-icon.png')}
            editField={editField}
            setEditField={setEditField}
            setLoading={setLoading}
          />
          <ProfileInfoTile
            label={'Email'}
            value={userDetails.email}
            image={require('../../../assets/icons/email.png')}
            editField={editField}
            setEditField={setEditField}
            setLoading={setLoading}
          />
          <ProfileInfoTile
            label={'Contact'}
            value={userDetails.mobileNumber}
            image={require('../../../assets/icons/contact.png')}
            editField={editField}
            setEditField={setEditField}
            setLoading={setLoading}
          />
          <ProfileInfoTile
            label={'Change Password'}
            value={'*******'}
            image={require('../../../assets/icons/password.png')}
            editField={editField}
            setEditField={setEditField}
            setLoading={setLoading}
          />
          <TouchableOpacity
            style={styles.box}
            onPress={() => {
              if (editField) {
                setEditField('');
              }
              setDeleteModal(true);
            }}>
            <Image
              source={require('../../../assets/icons/delete.png')}
              resizeMode="contain"
              style={styles.image}
            />
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.box}
            onPress={() => {
              if (editField) {
                setEditField('');
              }
              setSignoutModal(true);
            }}>
            <Image
              source={require('../../../assets/icons/logout.png')}
              resizeMode="contain"
              style={styles.deleteImg}
            />
            <Text style={styles.valueText}>Sign out</Text>
          </TouchableOpacity>
          <ProfilePicturePickerModal
            isEditingProfilePicture={visibleProfilePicModal}
            close={() => {
              setVisibleProfilePicModal(false);
            }}
            profilePicture={userDetails.profilePicture || null}
            setProfilePic={setUploadImage}
            remove={handleRemoveProfile}
          />
          <AlertModal
            message={'Do you want to sign out?'}
            visible={signoutModal}
            confirmText={'Yes'}
            cancelText={'Cancel'}
            onConfirm={() => {
              setSignoutModal(false);
              signout();
            }}
            onCancel={() => {
              setSignoutModal(false);
            }}
          />
          <AlertModal
            message={'Do you really want to delete your account?'}
            visible={deleteModal}
            confirmText={'Delete'}
            cancelText={'No'}
            onConfirm={() => {
              setDeleteModal(false);
              accountDelete();
            }}
            onCancel={() => {
              setDeleteModal(false);
            }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
