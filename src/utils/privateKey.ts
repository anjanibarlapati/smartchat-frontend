import Sodium from 'react-native-libsodium';

export const encryptPrivateKey = async (privateKey: string, userId: string)=> {
  const salt = Sodium.randombytes_buf(Sodium.crypto_pwhash_SALTBYTES);
  const key = Sodium.crypto_pwhash(
    Sodium.crypto_secretbox_KEYBYTES,
    userId,
    salt,
    3,
    33554432,
    Sodium.crypto_pwhash_ALG_DEFAULT
  );

  const nonce = Sodium.randombytes_buf(Sodium.crypto_secretbox_NONCEBYTES);
  const cipher = Sodium.crypto_secretbox_easy(
    Sodium.from_base64(privateKey),
    nonce,
    key
  );

  return {
    salt: Sodium.to_base64(salt),
    nonce: Sodium.to_base64(nonce),
    privateKey: Sodium.to_base64(cipher),
  };
};


export const decryptPrivateKey = async (
    salt: string,
    nonce: string,
    encryptedPrivateKey: string,
    userId: string
) => {

  const saltBytes = Sodium.from_base64(salt);
  const nonceBytes = Sodium.from_base64(nonce);
  const cipherBytes = Sodium.from_base64(encryptedPrivateKey);

  const key = Sodium.crypto_pwhash(
    Sodium.crypto_secretbox_KEYBYTES,
    userId,
    saltBytes,
    3,
    33554432,
    Sodium.crypto_pwhash_ALG_DEFAULT
  );

  const decryptedBase64 = Sodium.crypto_secretbox_open_easy(cipherBytes, nonceBytes, key);
  return Sodium.to_base64(decryptedBase64);
};

