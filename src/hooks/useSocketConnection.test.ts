import { useSocketConnection } from './useSocketConnection';
import { createSocket } from '../utils/socket';
import { act, renderHook } from '@testing-library/react-native';

jest.mock('../utils/socket', () => ({
  createSocket: jest.fn(),
}));

const mockOn = jest.fn();
const mockOff = jest.fn();

const mockSocket = {
  on: mockOn,
  off: mockOff,
};

describe('useSocketConnection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (createSocket as jest.Mock).mockReturnValue(mockSocket);
  });

  it('should initially set isConnected to false', () => {
    const { result } = renderHook(() => useSocketConnection());
    expect(result.current.isConnected).toBe(false);
  });

  it('should set isConnected to true on socket connect', () => {
    let connectHandler: () => void;

    mockOn.mockImplementation((event, cb) => {
      if (event === 'connect') {
        connectHandler = cb;
      }
    });

    const { result } = renderHook(() => useSocketConnection());

    act(() => {
      connectHandler!();
    });

    expect(result.current.isConnected).toBe(true);
  });

  it('should set isConnected to false on socket disconnect', () => {
    let disconnectHandler: () => void;

    mockOn.mockImplementation((event, cb) => {
      if (event === 'disconnect') {
        disconnectHandler = cb;
      }
    });

    const { result } = renderHook(() => useSocketConnection());

    act(() => {
      disconnectHandler!();
    });

    expect(result.current.isConnected).toBe(false);
  });

  it('should register and clean up event listeners', () => {
    const handleConnect = expect.any(Function);
    const handleDisconnect = expect.any(Function);

    const { unmount } = renderHook(() => useSocketConnection());

    expect(mockOn).toHaveBeenCalledWith('connect', handleConnect);
    expect(mockOn).toHaveBeenCalledWith('disconnect', handleDisconnect);

    unmount();

    expect(mockOff).toHaveBeenCalledWith('connect', handleConnect);
    expect(mockOff).toHaveBeenCalledWith('disconnect', handleDisconnect);
  });
});
