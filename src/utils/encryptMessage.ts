import EncryptedStorage from 'react-native-encrypted-storage';
import Sodium from 'react-native-libsodium';
import {getPublicKey} from './keyPairs';

export const encryptMessage = async (
  receiverMobileNumber: string,
  message: string,
  access_token: string,
) => {
  try {
    const response = await getPublicKey(receiverMobileNumber, access_token);
    const result = await response.json();

    const receiverPublicKeyBase64 = result.publicKey;

    const senderKeyPairRaw = await EncryptedStorage.getItem('privateKey');

    if (!senderKeyPairRaw) {
      throw new Error('Sender private key not found');
    }

    const senderKeyPair = JSON.parse(senderKeyPairRaw);

    let senderPrivateKey = Sodium.from_base64(senderKeyPair.privateKey);

    const receiverPublicKey = Sodium.from_base64(receiverPublicKeyBase64);

    const nonce = Sodium.randombytes_buf(Sodium.crypto_box_NONCEBYTES);
    const ciphertext = Sodium.crypto_box_easy(
      message,
      nonce,
      receiverPublicKey,
      senderPrivateKey,
    );

    return {
      ciphertext: Sodium.to_base64(ciphertext),
      nonce: Sodium.to_base64(nonce),
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};
