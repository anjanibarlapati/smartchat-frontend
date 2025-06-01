import EncryptedStorage from 'react-native-encrypted-storage';
import Sodium from 'react-native-libsodium';
import {getPublicKey} from './keyPairs';

export const decryptMessage = async (
  senderMobileNumber: string,
  ciphertextBase64: string,
  nonceBase64: string,
  accessToken: string,
) => {
  try {
    const privateKeyRaw = await EncryptedStorage.getItem('privateKey');

    if (!privateKeyRaw) {
      throw new Error('Receiver private key not found');
    }


    const parsedPrivateKey = JSON.parse(privateKeyRaw);

    const response = await getPublicKey(senderMobileNumber, accessToken);

    const result = await response.json();

    const senderPublicKeyBase64 = result.publicKey;

    const ciphertext = Sodium.from_base64(ciphertextBase64);

    const nonce = Sodium.from_base64(nonceBase64);
    const senderPublicKey = Sodium.from_base64(senderPublicKeyBase64);
    const receiverPrivateKey = Sodium.from_base64(parsedPrivateKey.privateKey);

    const decrypted = Sodium.crypto_box_open_easy(
      ciphertext,
      nonce,
      senderPublicKey,
      receiverPrivateKey,
    );
    const decryptedMessage = Sodium.to_string(decrypted);

    return decryptedMessage;
  } catch (error) {
    throw new Error('Unable to decrypt message');
  }
};
