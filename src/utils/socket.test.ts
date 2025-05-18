import EncryptedStorage from 'react-native-encrypted-storage';
import {socketConnection, socketDisconnect} from './socket';
import {io} from 'socket.io-client';

jest.mock('react-native-encrypted-storage', () => ({
  getItem: jest.fn(),
}));

const mockOn = jest.fn();
const mockDisconnect = jest.fn();

jest.mock('socket.io-client', () => ({
  io: jest.fn(() => ({
    on: mockOn,
    disconnect: mockDisconnect,
    connected: true,
    id: 'mock-socket-id',
  })),
}));

describe('Check for socket creation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should not connect if token is missing', async () => {
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(null);
    await socketConnection();
    expect(io).not.toHaveBeenCalled();
  });

  it('Should disconnect socket when socketDisconnect is called', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const mockToken = JSON.stringify({access_token: 'valid_token'});
    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(mockToken);
    await socketConnection();
    await socketDisconnect();
    expect(mockDisconnect).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Socket manually disconnected');
  });


  it('should handle error during token fetch', async () => {
    const errorSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    (EncryptedStorage.getItem as jest.Mock).mockRejectedValue(
      new Error('Fetch error'),
    );
    await socketConnection();
    expect(errorSpy).toHaveBeenCalledWith(expect.any(Error));
  });

   it('should establish socket connection if access token is present', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const mockToken = JSON.stringify({ access_token: 'valid_token' });

    (EncryptedStorage.getItem as jest.Mock).mockResolvedValue(mockToken);
    await socketConnection();

    expect(EncryptedStorage.getItem).toHaveBeenCalledWith('token');
    expect(io).toHaveBeenCalledWith(expect.any(String), {
      transports: ['websocket'],
    });

    expect(mockOn).toHaveBeenCalledWith('connect', expect.any(Function));
    expect(mockOn).toHaveBeenCalledWith('disconnect', expect.any(Function));

    const connectHandler = mockOn.mock.calls.find(call => call[0] === 'connect')?.[1];
    if (connectHandler) {connectHandler();}
    expect(consoleSpy).toHaveBeenCalledWith('socket connection', true);
    expect(consoleSpy).toHaveBeenCalledWith('socket id is', 'mock-socket-id');


  });


});
