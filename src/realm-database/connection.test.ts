import Realm from 'realm';
import {  closeRealm, deleteAllRealmData, getRealmInstance, setRealmInstance } from './connection';

describe('Set realm instance', () => {
  let mockRealm: Partial<Realm>;
   beforeEach(() => {
    jest.resetModules();
    mockRealm = {
      close: jest.fn(),
      isClosed: false,
    };
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
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


describe('Delete all realm data', () => {
  let mockRealm: Partial<Realm>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRealm = {
      close: jest.fn(),
      isClosed: false,
    };
    setRealmInstance(mockRealm as Realm);
    jest.spyOn(Realm, 'deleteFile').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should close the realm instance if not already closed and delete realm file', () => {
    deleteAllRealmData();

    expect(mockRealm.close).toHaveBeenCalled();
    expect(Realm.deleteFile).toHaveBeenCalled();
  });

  it('should not call close if realm instance is already closed but still delete realm file', () => {
     const mockClose = jest.fn();
    mockRealm = { close: mockClose, isClosed: true };
    setRealmInstance(mockRealm as Realm);

    deleteAllRealmData();

    expect(mockRealm.close).not.toHaveBeenCalled();
    expect(Realm.deleteFile).toHaveBeenCalled();
  });
});
