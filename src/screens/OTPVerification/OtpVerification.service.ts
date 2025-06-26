import { getDeviceId } from 'react-native-device-info';
import { BASE_URL } from '../../utils/constants';

export const verifyOTP = async (otp: string, mobileNumber: string) => {
    const response = await fetch(`${BASE_URL}verifyOTP`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ otp, mobileNumber }),
    });
    return response;
};

export const generateOTPAndSendMail = async (email: string, mobileNumber: string) => {
    const response = await fetch(`${BASE_URL}sendOTP`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
    },
      body: JSON.stringify({ email, mobileNumber }),
    });
    return response;

};

export const createUser = async (mobileNumber: string) => {
    const response = await fetch(`${BASE_URL}register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mobileNumber }),
    });
    return response;

};

export const verifyLogin = async (mobileNumber: string, otp: string) => {
    const response = await fetch(`${BASE_URL}verifyLogin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mobileNumber, deviceId: getDeviceId(), otp }),
    });
    return response;

};


