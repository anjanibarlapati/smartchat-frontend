import Sodium from 'react-native-libsodium';
import {BASE_URL} from './constants';
import {getTokens} from './getTokens';

export const generateKeyPair = async () => {
  const keyPair = await Sodium.crypto_box_keypair();

  const base64PublicKey = Sodium.to_base64(keyPair.publicKey);
  const base64PrivateKey = Sodium.to_base64(keyPair.privateKey);

  return {publicKey: base64PublicKey, privateKey: base64PrivateKey};
};

export const storePublicKey = async (mobileNumber: string, publicKey: string) => {
  const tokens = await getTokens(mobileNumber);

  const response = await fetch(`${BASE_URL}publicKey`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'smart-chat-token-header-key': `Bearer ${tokens.access_token}`,
    },
    body: JSON.stringify({
      mobileNumber: mobileNumber,
      publicKey: publicKey,
    }),
  });
  return response;
};

export const getPublicKey = async (
  MobileNumber: string,
  access_token: string,
) => {
  const response = await fetch(`${BASE_URL}user/publicKey`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'smart-chat-token-header-key': `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      mobileNumber: MobileNumber,
    }),
  });
  return response;
};
