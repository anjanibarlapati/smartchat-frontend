import Realm from 'realm';
import { SyncActionType } from '../../utils/syncPendingActions';
import { addUserAction } from './addUserAction';


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

describe('Tests related to adding the user offline actions operation', () => {
  let mockRealm: Partial<Realm>;
  let mockWrite: jest.Mock;
  let mockCreate: jest.Mock;

  beforeEach(() => {
    mockCreate = jest.fn();
    mockWrite = jest.fn(fn => fn());
    mockRealm = {
      write: mockWrite,
      create: mockCreate,
    };
  });

  it('Should call the realm.write and realm.create with correct arguments', () => {
    const type = SyncActionType.BLOCK_USER;
    const payload = {userId:'shailu123'};
    addUserAction(mockRealm as Realm, type, payload);
    expect(mockWrite).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });
});
