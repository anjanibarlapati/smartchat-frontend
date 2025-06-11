import { renderHook } from '@testing-library/react-native';
import { useQuery } from '../contexts/RealmContext';
import { useUnreadChatsCount } from './unreadChatsCount';
import { MessageStatus } from '../types/message';

jest.mock('../contexts/RealmContext', () => ({
  useQuery: jest.fn(),
}));

const mockUseQuery = useQuery as jest.Mock;

type RealmCollection<T> = T[] & {
  filtered: (query: string, ...args: unknown[]) => RealmCollection<T>;
};

function createRealmCollection<T extends Record<string, any>>(items: T[]): RealmCollection<T> {
  const collection = [...items] as RealmCollection<T>;

  collection.filtered = ((query: string, ...args: unknown[]): RealmCollection<T> => {
    if (query === 'isSender == false AND status != $0') {
      const excludedStatus = args[0];
      return createRealmCollection(
        collection.filter((item: T) => !item.isSender && item.status !== excludedStatus)
      );
    }
    return createRealmCollection([]);
  }) as RealmCollection<T>['filtered'];

  return collection;
}

describe('useUnreadChatsCount', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns 0 when there are no unread messages', () => {
    mockUseQuery.mockReturnValue(createRealmCollection([]));
    const { result } = renderHook(() => useUnreadChatsCount());
    expect(result.current).toBe(0);
  });

  it('returns correct count of unique chat IDs with unread messages', () => {
    const messages = [
      { chat: { chatId: '1' }, isSender: false, status: MessageStatus.DELIVERED },
      { chat: { chatId: '2' }, isSender: false, status: MessageStatus.DELIVERED },
      { chat: { chatId: '1' }, isSender: false, status: MessageStatus.DELIVERED },
    ];
    mockUseQuery.mockReturnValue(createRealmCollection(messages));

    const { result } = renderHook(() => useUnreadChatsCount());
    expect(result.current).toBe(2);
  });

  it('ignores messages marked as seen or sent by self', () => {
    const messages = [
      { chat: { chatId: '1' }, isSender: false, status: MessageStatus.SEEN },
      { chat: { chatId: '2' }, isSender: true, status: MessageStatus.DELIVERED },
      { chat: { chatId: '3' }, isSender: false, status: MessageStatus.DELIVERED },
    ];
    mockUseQuery.mockReturnValue(createRealmCollection(messages));

    const { result } = renderHook(() => useUnreadChatsCount());
    expect(result.current).toBe(1);
  });

  it('returns 0 when all messages are either seen or sent by self', () => {
    const messages = [
      { chat: { chatId: '1' }, isSender: false, status: MessageStatus.SEEN },
      { chat: { chatId: '2' }, isSender: true, status: MessageStatus.DELIVERED },
    ];
    mockUseQuery.mockReturnValue(createRealmCollection(messages));

    const { result } = renderHook(() => useUnreadChatsCount());
    expect(result.current).toBe(0);
  });

  it('handles multiple chats with mixed statuses correctly', () => {
    const messages = [
      { chat: { chatId: '1' }, isSender: false, status: MessageStatus.SEEN },
      { chat: { chatId: '2' }, isSender: false, status: MessageStatus.DELIVERED },
      { chat: { chatId: '3' }, isSender: true, status: MessageStatus.DELIVERED },
      { chat: { chatId: '4' }, isSender: false, status: MessageStatus.DELIVERED },
      { chat: { chatId: '2' }, isSender: false, status: MessageStatus.DELIVERED },
    ];
    mockUseQuery.mockReturnValue(createRealmCollection(messages));

    const { result } = renderHook(() => useUnreadChatsCount());
    expect(result.current).toBe(2);
  });
});
