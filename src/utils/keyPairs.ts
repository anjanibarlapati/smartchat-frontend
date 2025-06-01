import Sodium from 'react-native-libsodium';
import { BASE_URL } from './constants';

export const generateKeyPair = async () => {
  const keyPair = await Sodium.crypto_box_keypair();

  const base64PublicKey = Sodium.to_base64(keyPair.publicKey);
  const base64PrivateKey = Sodium.to_base64(keyPair.privateKey);

  return {publicKey: base64PublicKey, privateKey: base64PrivateKey};
};

export const storeKeys = async (
  mobileNumber: string,
  publicKey: string,
  encryptedPrivateKey:{
    salt: string;
    nonce: string;
    privateKey: string;
  },
  accessToken: string
) => {

  const response = await fetch(`${BASE_URL}user/keys`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'smart-chat-token-header-key': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      mobileNumber: mobileNumber,
      publicKey: publicKey,
      privateKey: encryptedPrivateKey.privateKey,
      nonce: encryptedPrivateKey.nonce,
      salt: encryptedPrivateKey.salt,
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
