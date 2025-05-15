import EncryptedStorage from 'react-native-encrypted-storage';

export const getTokens = async(mobileNumber: string) => {
    const tokens = await EncryptedStorage.getItem(mobileNumber);
    return tokens ? JSON.parse(tokens) : null;
};
