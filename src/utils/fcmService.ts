import { getApp } from '@react-native-firebase/app';
import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  isDeviceRegisteredForRemoteMessages,
  registerDeviceForRemoteMessages,
  requestPermission,
} from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from './constants';

const app = getApp();
export const messaging = getMessaging(app);

export const generateAndUploadFcmToken = async (userMobileNumber: string) => {
  let hasPermission = false;

  if(Platform.OS === 'ios') {
    const status = await requestPermission(messaging);
    hasPermission =
      status === AuthorizationStatus.AUTHORIZED ||
      status === AuthorizationStatus.PROVISIONAL;
    return;
  } else if(Platform.OS === 'android') {
    const sdkInt = typeof Platform.Version === 'string' ? parseInt(Platform.Version, 10) : Platform.Version;
    if(sdkInt >= 33) {
      const result = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if(!result) {
        const permissionResult = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        hasPermission = permissionResult === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        hasPermission = true;
      }
    } else {
      hasPermission = true;
    }
  }

  if(hasPermission) {
    const isRegistered = await isDeviceRegisteredForRemoteMessages(messaging);
    if (!isRegistered) {
      await registerDeviceForRemoteMessages(messaging);
    }

    const fcmToken = await getToken(messaging);
    if (fcmToken) {
      const tokens = await EncryptedStorage.getItem(userMobileNumber);
      const storedTokens = tokens ? JSON.parse(tokens) : null;
      if(storedTokens) {
        await uploadFcmToken(userMobileNumber, fcmToken, storedTokens.access_token);
      }
    }
  }
};

export const uploadFcmToken = async (userMobileNumber: string, token: string, accessToken: string) => {
    const response = await fetch(`${BASE_URL}user/fcmToken`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'smart-chat-token-header-key': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ mobileNumber: userMobileNumber, fcmToken: token }),
    });
    return response;
};
