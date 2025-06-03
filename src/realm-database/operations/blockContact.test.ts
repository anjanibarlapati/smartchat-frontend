import Realm from 'realm';
import { blockContactInRealm } from './blockContact';

describe('Tests related to the blockContactInRealm operation', () => {
    let mockRealm: Partial<Realm>;
    const mockWrite = jest.fn(fn => fn());
    const mockObjectForPrimaryKey = jest.fn();
    const mockCreate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockRealm = {
            write: mockWrite,
            objectForPrimaryKey: mockObjectForPrimaryKey,
            create: mockCreate,
        };
    });

    it('Should create a new chat with isBlocked value is true if chat does not exist', () => {
        mockObjectForPrimaryKey.mockReturnValue(null);
        blockContactInRealm(mockRealm as Realm, '6303522765');
        expect(mockObjectForPrimaryKey).toHaveBeenCalledWith('Chat', '6303522765');
        expect(mockCreate).toHaveBeenCalledWith('Chat', {
            chatId: '6303522765',
            isBlocked: true,
            publicKey: null,
        });
    });

    it('should set the field isBlocked to true if chat is already exists', () => {
        const mockChat = { chatId: '6303522765', isBlocked: false };
        mockObjectForPrimaryKey.mockReturnValue(mockChat);
        blockContactInRealm(mockRealm as Realm, '6303522765');
        expect(mockChat.isBlocked).toBe(true);
        expect(mockCreate).not.toHaveBeenCalled();
    });
});
