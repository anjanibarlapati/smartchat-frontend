import { getDeviceId } from 'react-native-device-info';
import { BASE_URL } from '../../utils/constants';

export const verifyUserDetails = async(formData: FormData) => {
    const deviceId = getDeviceId();
    formData.append('deviceId', deviceId);
    const response = await fetch(`${BASE_URL}verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        body: formData,
    });
    return response;
};
