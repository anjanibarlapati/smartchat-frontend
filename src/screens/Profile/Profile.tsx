import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {useCallback, useEffect, useRef, useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useDispatch, useSelector} from 'react-redux';
import {AlertModal} from '../../components/AlertModal/AlertModal';
import {ChangePasswordModal} from '../../components/ChangePasswordModal/ChangePasswordModal';
import {CustomAlert} from '../../components/CustomAlert/CustomAlert';
import LoadingIndicator from '../../components/Loading/Loading';
import {ProfileInfoTile} from '../../components/ProfileInfoTile/ProfileInfoTile';
import {ProfilePicturePickerModal} from '../../components/ProfilePicturePickerModal/ProfilePicturePickerModal';
import {ProfilePictureViewerModal} from '../../components/ProfilePictureViewer/PofilePictureViewer';
import {useRealmReset} from '../../contexts/RealmContext';
import {useAppTheme} from '../../hooks/appTheme';
import {useAlertModal} from '../../hooks/useAlertModal';
import {setUserProperty} from '../../redux/reducers/user.reducer';
import {storeState} from '../../redux/store';
import {RootStackParamList} from '../../types/Navigations';
import {UploadImage} from '../../types/UploadImage';
import {getTokens} from '../../utils/getTokens';
import {socketDisconnect} from '../../utils/socket';
import {Theme} from '../../utils/themes';
import {
  deleteAccount,
  logout,
  removeProfilePic,
  updateProfilePic,
} from './Profile.services';
import {getStyles} from './Profile.styles';

export const Profile = (): React.JSX.Element => {
  const userDetails = useSelector((state: storeState) => state.user);
  const {width, height} = useWindowDimensions();
  const theme: Theme = useAppTheme();
  const styles = getStyles(theme, width, height);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const {alertVisible, alertMessage, alertType, showAlert, hideAlert} =
    useAlertModal();
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

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const profileImageUri = profilePicUrl
    ? {uri: profilePicUrl}
    : require('../../../assets/images/profileImage.png');

  const imageUploaded = useRef(false);
  const {resetRealm} = useRealmReset();

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
      try {
        setLoading(true);
        const tokens = await getTokens(userDetails.mobileNumber);
        if (!tokens) {
          await EncryptedStorage.clear();
          resetRealm();
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
          showAlert('Profile picture updated', 'success');
        } else {
          showAlert(
            result.message ||
              'Updating profile picture failed. Please try again later',
            'warning',
          );
        }
      } catch (error) {
        showAlert(
          'Updating profile picture failed. Please try again later',
          'error',
        );
      } finally {
        setUploadImage(null);
        setLoading(false);
        imageUploaded.current = false;
      }
    };

    if (uploadImage) {
      handleUploadProfilePic();
    }
  }, [dispatch, navigation, resetRealm, showAlert, uploadImage, userDetails]);

  const signout = async () => {
    try {
      const tokens = await getTokens(userDetails.mobileNumber);
      if (!tokens) {
        await EncryptedStorage.clear();
        resetRealm();
        return;
      }
      const response = await logout(
        userDetails.mobileNumber,
        tokens.access_token,
      );
      if (response.ok) {
        socketDisconnect();
        await EncryptedStorage.clear();
        resetRealm();
      } else {
        const result = await response.json();
        showAlert(
          result.message || 'Signout failed. Please try again.',
          'warning',
        );
      }
    } catch (error) {
      showAlert(
        'Something went wrong while signing out. Please try again',
        'error',
      );
    }
  };

  const handleRemoveProfile = async () => {
    const tokens = await getTokens(userDetails.mobileNumber);
    if (!tokens) {
      await EncryptedStorage.clear();
      resetRealm();
      return;
    }
    try {
      setLoading(true);
      const response = await removeProfilePic(
        profilePicUrl as string,
        userDetails.mobileNumber,
        tokens.access_token,
      );
      if (response.ok) {
        const updatedUser = {
          ...userDetails,
          profilePicture: null,
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
        showAlert('Successfully Removed Profile', 'success');
      }
      setProfilePicUrl(null);
      setVisibleProfilePicModal(false);
    } catch (error) {
      showAlert(
        'Something went wrong while removing profile picture. Please try again',
        'error',
      );
    } finally {
      setLoading(false);
    }
  };

  const accountDelete = async () => {
    try {
      const tokens = await getTokens(userDetails.mobileNumber);
      if (!tokens) {
        await EncryptedStorage.clear();
        resetRealm();
        return;
      }
      const response = await deleteAccount(
        userDetails.mobileNumber,
        tokens.access_token,
      );
      if (response.ok) {
        await EncryptedStorage.clear();
        resetRealm();
      } else {
        showAlert('Failed to delete account', 'error');
      }
    } catch (error) {
      showAlert(
        'Something went wrong while deleting account. Please try again',
        'error',
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}>
      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.profileImg}>
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <Image
              source={profileImageUri}
              style={styles.profileImg}
              accessibilityLabel="ProfilePicture"
              resizeMode="cover"
            />
          </TouchableOpacity>

          <ProfilePictureViewerModal
            visible={showModal}
            imageSource={profileImageUri}
            onClose={() => setShowModal(false)}
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
            image={require('../../../assets/icons/last-name-icon.png')}
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
            onPress={() => setShowChangePasswordModal(true)}
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
            profilePicture={userDetails.profilePicture}
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
      <ChangePasswordModal
        visible={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />

      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        type={alertType}
        onClose={hideAlert}
      />
    </KeyboardAvoidingView>
  );
};
