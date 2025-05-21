import Sodium from 'react-native-libsodium';
import { BASE_URL } from './constants';
import {getTokens} from './getTokens';
import {generateKeyPair, getPublicKey, storePublicKey} from './keyPairs';


global.fetch = jest.fn();

jest.mock('react-native-encrypted-storage', () => ({
  getItem: jest.fn(),
}));

jest.mock('react-native-libsodium', () => ({
  crypto_box_keypair: jest.fn(),
  to_base64: jest.fn(),
}));

jest.mock('./getTokens', () => ({
  getTokens: jest.fn(),
}));

describe('Check for public key and private key generation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should generate a key pair and return base64 keys', async () => {
    const mockKeyPair = {
      publicKey: 'rawPublicKey',
      privateKey: 'rawPrivateKey',
    };

    (Sodium.crypto_box_keypair as jest.Mock).mockResolvedValue(mockKeyPair);
    (Sodium.to_base64 as jest.Mock).mockImplementation(
      (key: string) => `base64(${key})`,
    );

    const result = await generateKeyPair();

    expect(Sodium.crypto_box_keypair).toHaveBeenCalled();
    expect(Sodium.to_base64).toHaveBeenCalledWith('rawPublicKey');
    expect(Sodium.to_base64).toHaveBeenCalledWith('rawPrivateKey');

    expect(result).toEqual({
      publicKey: 'base64(rawPublicKey)',
      privateKey: 'base64(rawPrivateKey)',
    });
  });
});

describe('Check for storePublicKey API ', () => {
  it('Should send a POST request with the correct token and payload', async () => {

    const mockToken = {access_token: 'valid_token'};
    const mockResponse = {status: 200};

    (getTokens as jest.Mock).mockResolvedValue(mockToken);
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    const result = await storePublicKey('6303974949', 'base64PublicKey');

    expect(getTokens).toHaveBeenCalledWith('6303974949');
    expect(fetch).toHaveBeenCalledWith(`${BASE_URL}publicKey`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'smart-chat-token-header-key': 'Bearer valid_token',
      },
      body: JSON.stringify({
        mobileNumber: '6303974949',
        publicKey: 'base64PublicKey',
      }),
    });
    expect(result).toBe(mockResponse);
  });
});

describe('Check for getPublicKey API ', ()=>{
    it('Should send a POST request with correct headers and body', async()=>{
        const mockResponse = {status : 200};

        (fetch as jest.Mock).mockResolvedValue(mockResponse);

        const result = await getPublicKey('6303974949', 'valid_token');

        expect(fetch).toHaveBeenCalledWith(`${BASE_URL}user/publicKey`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'smart-chat-token-header-key': 'Bearer valid_token',
      },
      body: JSON.stringify({
        mobileNumber: '6303974949',
      }),
    });
    expect(result).toBe(mockResponse);
    });

});
