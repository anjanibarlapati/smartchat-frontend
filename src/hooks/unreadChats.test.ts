import { renderHook } from '@testing-library/react-native';
import { useQuery } from '../contexts/RealmContext';
import { Chat } from '../realm-database/schemas/Chat';
import { Contact } from '../realm-database/schemas/Contact';
import { Message } from '../realm-database/schemas/Message';
import { useUnreadChats } from './unreadChats';
import { MessageStatus } from '../types/message';

jest.mock('../contexts/RealmContext', () => ({
  useQuery: jest.fn(),
}));

const mockUseQuery = useQuery as jest.Mock;

type RealmCollection<T> = T[] & {
  filtered: (query: string, ...args: unknown[]) => RealmCollection<T>;
  sorted: (field: keyof T, descending: boolean) => RealmCollection<T>;
};

function createRealmCollection<T extends Record<string, any>>(items: T[]): RealmCollection<T> {
  const collection = [...items] as RealmCollection<T>;

  collection.filtered = (query: string, ...args: any[]): RealmCollection<T> => {
    if (query === 'isSender == false AND status != $0') {
      const excludeStatus = args[0];
      return createRealmCollection(collection.filter((m: T) => !m.isSender && m.status !== excludeStatus));
    }

    if (query === 'chat.chatId == $0') {
      const chatId = args[0];
      return createRealmCollection(collection.filter((m: T) => m.chat?.chatId === chatId));
    }

    if (query === 'mobileNumber == $0') {
      const mobileNumber = args[0];
      return createRealmCollection(collection.filter((c: T) => c.mobileNumber === mobileNumber));
    }

    return createRealmCollection([]);
  };

  collection.sorted = (field: keyof T, descending: boolean): RealmCollection<T> => {
    const sorted = [...collection].sort((a, b) => {
      const aTime = new Date(a[field] as string).getTime();
      const bTime = new Date(b[field] as string).getTime();
      return descending ? bTime - aTime : aTime - bTime;
    });
    return createRealmCollection(sorted);
  };

  return collection;
}

describe('useUnreadChats', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns unread chats with latest message and contact info', () => {
    const chats = [{ chatId: '1' }, { chatId: '2' }];
    const messages = [
      {
        chat: { chatId: '1' },
        message: 'Hi',
        sentAt: '2023-01-02T10:00:00Z',
        isSender: false,
        status: MessageStatus.DELIVERED,
      },
      {
        chat: { chatId: '1' },
        message: 'Seen msg',
        sentAt: '2023-01-01T10:00:00Z',
        isSender: false,
        status: MessageStatus.SEEN,
      },
      {
        chat: { chatId: '2' },
        message: 'Hey',
        sentAt: '2023-01-03T08:00:00Z',
        isSender: false,
        status: MessageStatus.DELIVERED,
      },
    ];
    const contacts = [
      {
        mobileNumber: '1',
        name: 'Alice',
        originalNumber: '001',
        profilePicture: 'a.jpg',
      },
      {
        mobileNumber: '2',
        name: 'Bob',
        originalNumber: '002',
        profilePicture: 'b.jpg',
      },
    ];

    mockUseQuery.mockImplementation((schema) => {
      if (schema === Chat) {return createRealmCollection(chats);}
      if (schema === Message) {return createRealmCollection(messages);}
      if (schema === Contact) {return createRealmCollection(contacts);}
      return createRealmCollection([]);
    });

    const { result } = renderHook(() => useUnreadChats());

    expect(result.current).toHaveLength(2);
    expect(result.current[0].contact.name).toBe('Bob');
    expect(result.current[1].contact.name).toBe('Alice');
    expect(result.current[0].unreadCount).toBe(1);
    expect(result.current[1].unreadCount).toBe(1);
    expect(result.current[0].lastMessage.message).toBe('Hey');
  });

  it('excludes chats with only seen messages', () => {
    const chats = [{ chatId: '1' }];
    const messages = [
      {
        chat: { chatId: '1' },
        message: 'Seen',
        sentAt: '2023-01-02T10:00:00Z',
        isSender: false,
        status: MessageStatus.SEEN,
      },
    ];

    mockUseQuery.mockImplementation((schema) => {
      if (schema === Chat) {return createRealmCollection(chats);}
      if (schema === Message) {return createRealmCollection(messages);}
      if (schema === Contact) {return createRealmCollection([]);}
      return createRealmCollection([]);
    });

    const { result } = renderHook(() => useUnreadChats());
    expect(result.current).toHaveLength(0);
  });

  it('uses fallback contact info if contact is missing', () => {
    const chats = [{ chatId: '999' }];
    const messages = [
      {
        chat: { chatId: '999' },
        message: 'Yo',
        sentAt: '2023-01-02T10:00:00Z',
        isSender: false,
        status: MessageStatus.DELIVERED,
      },
    ];

    mockUseQuery.mockImplementation((schema) => {
      if (schema === Chat) {return createRealmCollection(chats);}
      if (schema === Message) {return createRealmCollection(messages);}
      if (schema === Contact) {return createRealmCollection([]);}
      return createRealmCollection([]);
    });

    const { result } = renderHook(() => useUnreadChats());

    expect(result.current).toHaveLength(1);
    expect(result.current[0].contact.name).toBe('999');
    expect(result.current[0].contact.profilePicture).toBe(null);
  });

  it('returns empty array when no chats exist', () => {
    mockUseQuery.mockImplementation(() => createRealmCollection([]));
    const { result } = renderHook(() => useUnreadChats());
    expect(result.current).toEqual([]);
  });
});
