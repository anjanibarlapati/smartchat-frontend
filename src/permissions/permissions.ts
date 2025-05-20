import {Alert, Platform} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

const requestPermission = async (permissionType: string) => {
  try {
    let permission;
    switch (permissionType) {
      case 'camera':
        permission = Platform.select({
          ios: PERMISSIONS.IOS.CAMERA,
          android: PERMISSIONS.ANDROID.CAMERA,
        });
        break;
      case 'media':
        permission = Platform.select({
          ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
          android: PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
        });
        break;
      case 'contacts':
        permission = Platform.select({
          ios: PERMISSIONS.IOS.CONTACTS,
          android: PERMISSIONS.ANDROID.READ_CONTACTS,
        });
        break;
      case 'send-sms':
        permission = Platform.select({
          ios: undefined,
          android: PERMISSIONS.ANDROID.SEND_SMS,
        });
        break;
    }
    if (!permission) {
      return true;
    }
    if (permission) {
      const result = await check(permission);
      if (result === RESULTS.DENIED) {
        const grantResult = await request(permission);
        if (grantResult === RESULTS.GRANTED) {
          return true;
        }
      } else if (result === RESULTS.GRANTED) {
        return true;
      }
      return false;
    }
    return false;
  } catch (error) {
    Alert.alert('Something went wrong!');
  }
};

export {requestPermission};
