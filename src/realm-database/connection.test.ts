import { setRealmInstance, getRealmInstance, closeRealm } from './connection';
import Realm from 'realm';

jest.mock('realm', () => ({
  BSON: {
    ObjectId: jest.fn(() => 'mocked-object-id'),
  },
}));

describe('Set realm instance', () => {
  let mockRealm: Partial<Realm>;
   beforeEach(() => {
    jest.clearAllMocks();
    mockRealm = {
      close: jest.fn(),
      isClosed: false,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set the realmInstance variable', () => {
    setRealmInstance(mockRealm as Realm);
    expect(getRealmInstance()).toBe(mockRealm);
  });
});

describe('Get realm instance', () => {
  let mockRealm: Partial<Realm>;
    beforeEach(() => {
        jest.clearAllMocks();
        mockRealm = {
        close: jest.fn(),
        isClosed: false,
    };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should throw an error if realmInstance is not set', () => {
    jest.resetModules();
    const { getRealmInstance: freshGetRealmInstance } = require('./connection');
    expect(() => freshGetRealmInstance()).toThrow('Realm instance is not set');
  });

  it('should return the previously set realmInstance', () => {
    setRealmInstance(mockRealm as Realm);
    expect(getRealmInstance()).toBe(mockRealm);
  });
});

describe('Close Realm', () => {
  let mockRealm: Partial<Realm>;
    beforeEach(() => {
        jest.clearAllMocks();
        mockRealm = {
        close: jest.fn(),
        isClosed: false,
    };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call close on realmInstance if not already closed', () => {
    setRealmInstance(mockRealm as Realm);
    closeRealm();
    expect(mockRealm.close).toHaveBeenCalled();
  });

  it('should not call close if realmInstance is already closed', () => {
    const mockClose = jest.fn();
    mockRealm = { close: mockClose, isClosed: true };
    setRealmInstance(mockRealm as Realm);

    closeRealm();

    expect(mockClose).not.toHaveBeenCalled();
  });
});
