import { renderHook } from '@testing-library/react-native';
import { useUnreadChatsCount } from './unreadChatsCount';
import { useQuery } from '../contexts/RealmContext';
import { Message } from '../realm-database/schemas/Message';

jest.mock('../contexts/RealmContext', () => ({
  useQuery: jest.fn(),
}));

const mockUseQuery = useQuery as jest.Mock;

type RealmCollection<T> = T[] & {
  filtered: (query: string) => RealmCollection<T>;
};

function createRealmCollection<T extends Record<string, any>>(items: T[]): RealmCollection<T> {
  const collection = [...items] as RealmCollection<T>;

  collection.filtered = ((query: string): RealmCollection<T> => {
    if (query === 'isSender == false AND status != "seen"') {
      return createRealmCollection(
        collection.filter((m:T) => !m.isSender && m.status !== 'seen')
      );
    }
    return createRealmCollection([]);
  }) as RealmCollection<T>['filtered'];

  return collection;
}
describe('shoud render useUnreadChatsCount', () => {
  afterEach(() => jest.clearAllMocks());

  it('should returns 0 when there are no unread messages', () => {
    const messages: Message[] = [];
    mockUseQuery.mockReturnValue(createRealmCollection(messages));

    const { result } = renderHook(() => useUnreadChatsCount());
    expect(result.current).toBe(0);
  });

  it('should return correct number of unique chat IDs', () => {
    const messages = [
      { chat: { chatId: '1' }, isSender: false, status: 'delivered' },
      { chat: { chatId: '2' }, isSender: false, status: 'delivered' },
      { chat: { chatId: '1' }, isSender: false, status: 'delivered' },
    ];
    mockUseQuery.mockReturnValue(createRealmCollection(messages));

    const { result } = renderHook(() => useUnreadChatsCount());
    expect(result.current).toBe(2);
  });

  it('should ignores messages marked as seen or sent by self', () => {
    const messages = [
      { chat: { chatId: '1' }, isSender: false, status: 'seen' },
      { chat: { chatId: '2' }, isSender: true, status: 'delivered' },
      { chat: { chatId: '3' }, isSender: false, status: 'delivered' },
    ];
    mockUseQuery.mockReturnValue(createRealmCollection(messages));

    const { result } = renderHook(() => useUnreadChatsCount());
    expect(result.current).toBe(1);
  });
});
