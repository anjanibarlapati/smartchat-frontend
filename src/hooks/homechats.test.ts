import {renderHook} from '@testing-library/react-native';
import {useHomeChats} from './homechats';
import {useQuery} from '../contexts/RealmContext';
import {Chat} from '../realm-database/schemas/Chat';
import {Contact} from '../realm-database/schemas/Contact';
import {Message as RealmMessage} from '../realm-database/schemas/Message';

jest.mock('../contexts/RealmContext', () => ({
  useQuery: jest.fn(),
}));

const mockUseQuery = useQuery as jest.Mock;

type RealmCollection<T> = T[] & {
  filtered: (query: string, ...args: unknown[]) => RealmCollection<T>;
  sorted: (field: keyof T, descending: boolean) => RealmCollection<T>;
};

function createRealmCollection<T extends Record<string, any>>(
  items: T[],
): RealmCollection<T> {
  const collection = [...items] as RealmCollection<T>;

  collection.filtered = ((
    query: string,
    ...args: unknown[]
  ): RealmCollection<T> => {
    if (query === 'isSender == false AND status != "seen"') {
      return createRealmCollection(
        collection.filter((m: T) => !m.isSender && m.status !== 'seen'),
      );
    }

    if (query === 'chat.chatId == $0') {
      const chatId = args[0];
      return createRealmCollection(
        collection.filter((m: T) => m.chat?.chatId === chatId),
      );
    }

    if (query === 'mobileNumber == $0') {
      const mobile = args[0];
      return createRealmCollection(
        collection.filter((c: T) => c.mobileNumber === mobile),
      );
    }

    return createRealmCollection([]);
  }) as RealmCollection<T>['filtered'];

  collection.sorted = ((
    field: keyof T,
    descending: boolean,
  ): RealmCollection<T> => {
    const sorted = [...collection].sort((a, b) => {
      const aVal = new Date(a[field] as string).getTime();
      const bVal = new Date(b[field] as string).getTime();
      return descending ? bVal - aVal : aVal - bVal;
    });
    return createRealmCollection(sorted);
  }) as RealmCollection<T>['sorted'];

  return collection;
}
describe('should render useHomeChats', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return sorted chat list with unread count and contact info', () => {
    const chats = [{chatId: 'chat-1'}, {chatId: 'chat-2'}];
    const messages = [
      {
        chat: {chatId: 'chat-1'},
        message: 'Hello',
        sentAt: '2023-01-01T10:00:00Z',
        isSender: false,
        status: 'delivered',
      },
      {
        chat: {chatId: 'chat-1'},
        message: 'How are you?',
        sentAt: '2023-01-01T12:00:00Z',
        isSender: false,
        status: 'seen',
      },
      {
        chat: {chatId: 'chat-2'},
        message: 'Hi',
        sentAt: '2023-01-02T09:00:00Z',
        isSender: true,
        status: 'delivered',
      },
    ];
    const contacts = [
      {
        mobileNumber: 'chat-1',
        name: 'Alice',
        originalNumber: '001',
        profilePicture: 'pic1',
      },
      {
        mobileNumber: 'chat-2',
        name: 'Bob',
        originalNumber: '002',
        profilePicture: 'pic2',
      },
    ];

    mockUseQuery.mockImplementation(schema => {
      if (schema === Chat) {
        return createRealmCollection(chats);
      }
      if (schema === RealmMessage) {
        return createRealmCollection(messages);
      }
      if (schema === Contact) {
        return createRealmCollection(contacts);
      }
      return [];
    });

    const {result} = renderHook(() => useHomeChats());

    expect(result.current).toHaveLength(2);
    expect(result.current[0].lastMessage.message).toBe('Hi');
    expect(result.current[1].lastMessage.message).toBe('How are you?');
    expect(result.current[1].unreadCount).toBe(1);
  });

  it('should use fallback contact info if not found', () => {
    const chats = [{chatId: 'chat-3'}];
    const messages = [
      {
        chat: {chatId: 'chat-3'},
        message: 'Hey',
        sentAt: '2023-01-01T08:00:00Z',
        isSender: false,
        status: 'delivered',
      },
    ];

    mockUseQuery.mockImplementation(schema => {
      if (schema === Chat) {
        return createRealmCollection(chats);
      }
      if (schema === RealmMessage) {
        return createRealmCollection(messages);
      }
      if (schema === Contact) {
        return createRealmCollection([]);
      }
      return [];
    });

    const {result} = renderHook(() => useHomeChats());

    expect(result.current[0].contact.name).toBe('chat-3');
    expect(result.current[0].contact.profilePicture).toBe('');
  });

  it('should skip chat with no messages', () => {
    const chats = [{chatId: 'chat-4'}];
    const messages: Array<{
      chat: {chatId: string};
      message: string;
      sentAt: string;
      isSender: boolean;
      status: string;
    }> = [];
    const contacts = [
      {
        mobileNumber: 'chat-4',
        name: 'Someone',
        originalNumber: '004',
        profilePicture: 'img',
      },
    ];

    mockUseQuery.mockImplementation(schema => {
      if (schema === Chat) {
        return createRealmCollection(chats);
      }
      if (schema === RealmMessage) {
        return createRealmCollection(messages);
      }
      if (schema === Contact) {
        return createRealmCollection(contacts);
      }
      return [];
    });

    const {result} = renderHook(() => useHomeChats());

    expect(result.current).toHaveLength(0);
  });

  it('returns empty when no chats', () => {
    mockUseQuery.mockImplementation(() => createRealmCollection([]));
    const {result} = renderHook(() => useHomeChats());
    expect(result.current).toEqual([]);
  });
});
