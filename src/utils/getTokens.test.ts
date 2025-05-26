import { getTokens } from './getTokens';
import EncryptedStorage from 'react-native-encrypted-storage';

jest.mock('react-native-encrypted-storage', () => ({
    getItem: jest.fn(),
}));

describe('Tests related to the getTokens utiliy function', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Should successfully send the tokens if present', async() => {
        const mockedTokens = {accessToken: 'access-token-encrypted', refreshToken: 'refresh-token-encrypted'};
        (EncryptedStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockedTokens));
        const result = await getTokens('+919292929292');
        expect(EncryptedStorage.getItem).toHaveBeenCalledWith('+919292929292');
        expect(result).toEqual(mockedTokens);
    });

    test('Should returns null if no tokens are present', async() => {
        (EncryptedStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
        const result = await getTokens('+919292929292');
        expect(EncryptedStorage.getItem).toHaveBeenCalledWith('+919292929292');
        expect(result).toEqual(null);
    });

});
