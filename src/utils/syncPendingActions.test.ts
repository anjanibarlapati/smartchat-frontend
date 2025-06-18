import Realm from 'realm';
import {blockUserChat} from '../components/ChatOptionsModal/blockChat.service';
import {clearUserChat} from '../components/ChatOptionsModal/clearChat.service';
import {unblockUserChat} from '../components/ChatOptionsModal/unblockChat.service';
import {getSocket} from './socket';
import { SyncActionType, syncPendingActions } from './syncPendingActions';


jest.mock('../components/ChatOptionsModal/blockChat.service');
jest.mock('../components/ChatOptionsModal/clearChat.service');
jest.mock('../components/ChatOptionsModal/unblockChat.service');
jest.mock('./socket');

jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    requestPermission: jest.fn(),
    createChannel: jest.fn(),
    displayNotification: jest.fn(),
    createTriggerNotification: jest.fn(),
  },
  AndroidImportance: { HIGH: 'high' },
  TriggerType: { TIMESTAMP: 'timestamp' },
}));

describe('Tests related to syncing the offline actions', () => {
  let mockRealm: Partial<Realm>;
  let userActions: any[];
  const mockEmit = jest.fn();
  const mockWrite = jest.fn();
  const mockDelete = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();

    userActions = [
      {
        type: SyncActionType.MESSAGE_SEEN,
        payload: {
          sentAt: '2025-06-16T12:00:00Z',
        },
        status: 'pending',
      },
      {
        type: SyncActionType.CLEAR_CHAT,
        payload: {
          senderMobileNumber: '9951534911',
          receiverMobileNumber: '8106834082',
          clearedChatAt: new Date(),
        },
        status: 'pending',
      },
      {
        type: SyncActionType.BLOCK_USER,
        payload: {
          senderMobileNumber: '9951534911',
          receiverMobileNumber: '8106834082',
          blockedAt: new Date(),
        },
        status: 'pending',
      },
      {
        type: SyncActionType.UNBLOCK_USER,
        payload: {
          senderMobileNumber: '9951534911',
          receiverMobileNumber: '8106834082',
          unblockedAt: new Date(),
        },
        status: 'pending',
      },
      {
      type: SyncActionType.BLOCK_USER,
      payload: {
        receiverMobileNumber: '8106834082',
        blockedAt: new Date(),
      },
      status: 'pending',
    },
    {
      type: SyncActionType.UNBLOCK_USER,
      payload: {
        receiverMobileNumber: '8106834082',
        blockedAt: new Date(),
      },
      status: 'pending',
    },
    {
      type: SyncActionType.CLEAR_CHAT,
      payload: {
        receiverMobileNumber: '8106834082',
        blockedAt: new Date(),
      },
      status: 'pending',
    },
    ];

    mockWrite.mockImplementation((fn: any) => fn());
    mockRealm = {
      objects: jest.fn().mockReturnValue({
        filtered: jest.fn().mockReturnValue(userActions),
      }),
      write: mockWrite,
      delete: mockDelete,
    };
    (clearUserChat as jest.Mock).mockResolvedValue({ok: true});
    (blockUserChat as jest.Mock).mockResolvedValue({ok: true});
    (unblockUserChat as jest.Mock).mockResolvedValue({ok: true});
    (getSocket as jest.Mock).mockReturnValue({emit: mockEmit, disconnect: jest.fn()});
  });
 afterAll(() => {
  jest.resetAllMocks();
});
  it('should emit messageRead for MESSAGE_SEEN actions', async () => {
    await syncPendingActions(mockRealm as Realm);
    expect(mockEmit).toHaveBeenCalledWith('messageRead', {
      sentAt: '2025-06-16T12:00:00Z',
    });
  });

  it('Should call clearUserChat and delete the CLEAR_CHAT action', async () => {
    await syncPendingActions(mockRealm as Realm);
    expect(clearUserChat).toHaveBeenCalledWith(
      '9951534911',
      '8106834082',
      expect.any(Date),
    );
    expect(mockRealm.delete).toHaveBeenCalledWith(userActions[1]);
  });

  it('should call blockUserChat and delete the BLOCK_USER action', async () => {
    await syncPendingActions(mockRealm as Realm);
    expect(blockUserChat).toHaveBeenCalledWith({
      senderMobileNumber: '9951534911',
      receiverMobileNumber: '8106834082',
      blockedAt: expect.any(Date),
    });
    expect(mockRealm.delete).toHaveBeenCalledWith(userActions[2]);
  });

  it('should call unblockUserChat and delete the UNBLOCK_USER action', async () => {
    await syncPendingActions(mockRealm as Realm);
    expect(unblockUserChat).toHaveBeenCalledWith(
      '9951534911',
      '8106834082',
      expect.any(Date),
    );
    expect(mockRealm.delete).toHaveBeenCalledWith(userActions[3]);
  });

  it('should skip BLOCK_USER if sender or receiver number is missing', async () => {
  userActions = [userActions[4]];
  (mockRealm.objects as jest.Mock).mockReturnValue({
    filtered: jest.fn().mockReturnValue(userActions),
  });
  await syncPendingActions(mockRealm as Realm);
  expect(blockUserChat).not.toHaveBeenCalled();
  expect(mockRealm.delete).not.toHaveBeenCalled();
});

  it('should skip clear user chat if sender or receiver number is missing', async () => {
  userActions = [userActions[6]];
  (mockRealm.objects as jest.Mock).mockReturnValue({
    filtered: jest.fn().mockReturnValue(userActions),
  });
  await syncPendingActions(mockRealm as Realm);
  expect(blockUserChat).not.toHaveBeenCalled();
  expect(mockRealm.delete).not.toHaveBeenCalled();
});


  it('should skip unblock_user if sender or receiver number is missing', async () => {
  userActions = [userActions[5]];
  (mockRealm.objects as jest.Mock).mockReturnValue({
    filtered: jest.fn().mockReturnValue(userActions),
  });
  await syncPendingActions(mockRealm as Realm);
  expect(unblockUserChat).not.toHaveBeenCalled();
  expect(mockRealm.delete).not.toHaveBeenCalled();
});

it('should catch errors thrown during sync and log them', async () => {
  const error = new Error('Server error');
  (clearUserChat as jest.Mock).mockRejectedValueOnce(error);

  const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

  await syncPendingActions(mockRealm as Realm);

  expect(consoleSpy).toHaveBeenCalledWith(
    `Sync failed for clear_chat:`,
    error
  );

  consoleSpy.mockRestore();
});

it('should skip unknown action types without crashing', async () => {
  userActions = [
    {
      type: 'some_unknown_type',
      payload: {},
      status: 'pending',
    },
  ];

  mockRealm.objects = jest.fn().mockReturnValue({
    filtered: jest.fn().mockReturnValue(userActions),
  });

  await syncPendingActions(mockRealm as Realm);
});

});
