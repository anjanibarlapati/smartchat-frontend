import {renderHook} from '@testing-library/react-native';
import {useGroupedMessages} from './groupMessageByDate';
import * as RealmContext from '../contexts/RealmContext';
import {Message} from '../realm-database/schemas/Message';

jest.mock('../contexts/RealmContext', () => ({
  useQuery: jest.fn(),
}));
const mockUseQuery = RealmContext.useQuery as jest.Mock;
type MockMessage = {
  _id: number;
  sentAt: string;
  chat: {chatId: string};
  text: string;
};
const createMessage = (
  id: number,
  sentAt: string,
  chatId: string,
): MockMessage => ({
  _id: id,
  sentAt,
  chat: {chatId},
  text: `Message ${id}`,
});
describe('useGroupedMessages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('returns empty array if no messages', () => {
    mockUseQuery.mockReturnValue({
      filtered: jest.fn().mockReturnThis(),
      sorted: jest.fn().mockReturnValue([]),
    });
    const {result} = renderHook(() => useGroupedMessages('123'));
    expect(result.current.sections).toEqual([]);
    expect(result.current.flattenedMessages).toEqual([]);
  });

  it('groups and sorts messages by date and time descending', () => {
    const messages = [
      createMessage(1, '2024-06-01T08:00:00Z', '123'),
      createMessage(2, '2024-06-01T10:00:00Z', '123'),
      createMessage(3, '2024-06-02T09:00:00Z', '123'),
    ];
    mockUseQuery.mockReturnValue({
      filtered: () => ({
        sorted: () => messages,
      }),
    });
    const {result} = renderHook(() => useGroupedMessages('123'));
    expect(result.current.sections).toHaveLength(2);
    const [group1, group2] = result.current.sections;
    expect(group1.dateKey).toBe('2024-06-01');
    expect(group1.title).toBe('June 01, 2024');
    expect(group1.data.map((msg: Message) => msg._id)).toEqual([1, 2]);
    expect(group2.dateKey).toBe('2024-06-02');
    expect(group2.title).toBe('June 02, 2024');
    expect(group2.data.map((msg: Message) => msg._id)).toEqual([3]);
  });

  it('filters messages by chat.chatId', () => {
    const filteredMock = jest.fn(() => ({
      sorted: () => [],
    }));
    mockUseQuery.mockReturnValue({
      filtered: filteredMock,
    });
    renderHook(() => useGroupedMessages('789'));
    expect(filteredMock).toHaveBeenCalledWith('chat.chatId == $0', '789');
  });
  it('correctly handles multiple date groups and message sorting', () => {
    const messages = [
      createMessage(1, '2024-06-03T14:00:00Z', '321'),
      createMessage(2, '2024-06-03T09:00:00Z', '321'),
      createMessage(3, '2024-06-02T12:00:00Z', '321'),
      createMessage(4, '2024-06-01T08:00:00Z', '321'),
    ];
    mockUseQuery.mockReturnValue({
      filtered: () => ({
        sorted: () => messages,
      }),
    });
    const {result} = renderHook(() => useGroupedMessages('321'));
    expect(result.current.sections[0].dateKey).toBe('2024-06-01');
    expect(result.current.sections[0].data.map((m: Message) => m._id)).toEqual([
      4,
    ]);
    expect(result.current.sections[1].dateKey).toBe('2024-06-02');
    expect(result.current.sections[1].data.map((m: Message) => m._id)).toEqual([
      3,
    ]);
    expect(result.current.sections[2].dateKey).toBe('2024-06-03');
    expect(result.current.sections[2].data.map((m: Message) => m._id)).toEqual([
      2, 1,
    ]);
  });
});
