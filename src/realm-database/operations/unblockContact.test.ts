import Realm from 'realm';
import { unblockContactInRealm } from './unblockContact';

describe('Tests related to the unblockContact operation', () => {
    let mockRealm: Partial<Realm>;
    const mockWrite = jest.fn(fn => fn());
    const mockObjectForPrimaryKey = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockRealm = {
            write: mockWrite,
            objectForPrimaryKey: mockObjectForPrimaryKey,
        };
    });

    it('Should set isBlocked value to false if chat exists', () => {
        const mockChat = { chatId: '6303522765', isBlocked: true };
        mockObjectForPrimaryKey.mockReturnValue(mockChat);
        unblockContactInRealm(mockRealm as Realm, '6303522765');
        expect(mockObjectForPrimaryKey).toHaveBeenCalledWith('Chat', '6303522765');
        expect(mockChat.isBlocked).toBe(false);
    });

    it('Should check for realm.write to called only 1 time when chat does not exists', () => {
        mockObjectForPrimaryKey.mockReturnValue(null);
        unblockContactInRealm(mockRealm as Realm, '6303522765');
        expect(mockWrite).toHaveBeenCalledTimes(1);
    });

});
