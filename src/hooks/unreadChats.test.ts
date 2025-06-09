import {renderHook} from '@testing-library/react-native';
import {useUnreadChats} from './unreadChats';
import {useQuery} from '../contexts/RealmContext';
import {Chat} from '../realm-database/schemas/Chat';
import {Message} from '../realm-database/schemas/Message';
import {Contact} from '../realm-database/schemas/Contact';

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

describe('should render useUnreadChats', () => {
  afterEach(() => jest.clearAllMocks());
  it('should return unread chats with latest message and contact', () => {
    const chats = [{chatId: '1'}, {chatId: '2'}];
    const messages = [
      {
        chat: {chatId: '1'},
        message: 'Hi',
        sentAt: '2023-01-02T10:00:00Z',
        isSender: false,
        status: 'delivered',
      },
      {
        chat: {chatId: '1'},
        message: 'Seen msg',
        sentAt: '2023-01-01T10:00:00Z',
        isSender: false,
        status: 'seen',
      },
      {
        chat: {chatId: '2'},
        message: 'Hey',
        sentAt: '2023-01-03T08:00:00Z',
        isSender: false,
        status: 'delivered',
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
    mockUseQuery.mockImplementation(schema => {
      if (schema === Chat) {
        return createRealmCollection(chats);
      }
      if (schema === Message) {
        return createRealmCollection(messages);
      }
      if (schema === Contact) {
        return createRealmCollection(contacts);
      }
    });

    const {result} = renderHook(() => useUnreadChats());
    expect(result.current).toHaveLength(2);
    expect(result.current[0].contact.name).toBe('Bob');
    expect(result.current[1].contact.name).toBe('Alice');
    expect(result.current[0].unreadCount).toBe(1);
    expect(result.current[1].unreadCount).toBe(1);
    expect(result.current[0].lastMessage.message).toBe('Hey');
  });
});
