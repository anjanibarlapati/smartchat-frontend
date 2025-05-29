import { getDeviceId } from 'react-native-device-info';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASE_URL } from './constants';

export const checkAccessToken = async () => {
  try {
    const storedUser = await EncryptedStorage.getItem('User Data');
    if (storedUser) {
      const user = JSON.parse(storedUser);

      const token = await EncryptedStorage.getItem(user.mobileNumber);
      if (token) {
        let { access_token, refresh_token } = JSON.parse(token);

        const response = await fetch(`${BASE_URL}token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accessToken: access_token,
            refreshToken: refresh_token,
            mobileNumber: user.mobileNumber,
            deviceId: getDeviceId(),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.newAccessToken) {
            access_token = data.newAccessToken;

            await EncryptedStorage.setItem(
              user.mobileNumber,
              JSON.stringify({
                access_token,
                refresh_token,
              }),
            );
          }
          return true;
        }
      }
      return false;
    }
  } catch (error) {
    throw new Error('Token check failed');
  }
};
