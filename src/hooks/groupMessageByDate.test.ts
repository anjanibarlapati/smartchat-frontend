import { renderHook } from '@testing-library/react-native';
import { BSON } from 'realm';
import * as RealmContext from '../contexts/RealmContext';
import { useGroupedMessages } from './groupMessageByDate';
import { MessageStatus } from '../types/message';

jest.mock('../contexts/RealmContext', () => ({
  useQuery: jest.fn(),
}));

const mockUseQuery = RealmContext.useQuery as jest.Mock;

type MockMessage = {
  _id: BSON.ObjectId;
  sentAt: Date;
  chat: { chatId: string };
  message: string;
  isSender: boolean;
  status: MessageStatus;
};

const createMessage = (
  id: number,
  sentAt: string,
  chatId: string,
  isSender = false,
  status: MessageStatus = MessageStatus.SENT,
): MockMessage => ({
  _id: new BSON.ObjectId(),
  sentAt: new Date(sentAt),
  chat: { chatId },
  message: `Message ${id}`,
  isSender,
  status,
});

describe('Group messages by date', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should return an empty array when there are no messages', () => {
    mockUseQuery.mockReturnValue({
      filtered: jest.fn().mockReturnThis(),
      sorted: jest.fn().mockReturnValue({
        snapshot: () => [],
      }),
    });

    const { result } = renderHook(() => useGroupedMessages('123'));
    expect(result.current.groupedMessages).toEqual([]);
  });

  it('Should group messages by date and includes timestamp entries', () => {
    const messages = [
      createMessage(1, '2024-06-01T08:00:00Z', '123'),
      createMessage(2, '2024-06-01T10:00:00Z', '123'),
      createMessage(3, '2024-06-02T09:00:00Z', '123'),
    ];

    mockUseQuery.mockReturnValue({
      filtered: () => ({
        sorted: () => ({
          snapshot: () => messages,
        }),
      }),
    });

    const { result } = renderHook(() => useGroupedMessages('123'));

    const grouped = result.current.groupedMessages;

    expect(grouped.length).toBe(5);
    expect(grouped[0]).toMatchObject({
      type: 'timestamp',
      dateKey: '2024-06-01',
    });
    expect(grouped[1]).toMatchObject({
      type: 'message',
      message: 'Message 1',
    });
    expect(grouped[2]).toMatchObject({
      type: 'message',
      message: 'Message 2',
    });
    expect(grouped[3]).toMatchObject({
      type: 'timestamp',
      dateKey: '2024-06-02',
    });
    expect(grouped[4]).toMatchObject({
      type: 'message',
      message: 'Message 3',
    });
  });

  it('Should filter messages by chatId correctly', () => {
    const filteredMock = jest.fn(() => ({
      sorted: () => ({
        snapshot: () => [],
      }),
    }));

    mockUseQuery.mockReturnValue({
      filtered: filteredMock,
    });

    renderHook(() => useGroupedMessages('789'));
    expect(filteredMock).toHaveBeenCalledWith('chat.chatId == $0', '789');
  });

  it('Should only inserts one timestamp per unique date', () => {
    const messages = [
      createMessage(1, '2024-06-03T14:00:00Z', '321'),
      createMessage(2, '2024-06-03T09:00:00Z', '321'),
      createMessage(3, '2024-06-02T12:00:00Z', '321'),
      createMessage(4, '2024-06-01T08:00:00Z', '321'),
    ];

    mockUseQuery.mockReturnValue({
      filtered: () => ({
        sorted: () => ({
          snapshot: () => messages,
        }),
      }),
    });

    const { result } = renderHook(() => useGroupedMessages('321'));

    const grouped = result.current.groupedMessages;

    const timestamps = grouped.filter((item) => item.type === 'timestamp');
    expect(timestamps).toHaveLength(3);

    const dateKeys = timestamps.map((t) => t.dateKey);
    expect(dateKeys).toEqual(['2024-06-03', '2024-06-02', '2024-06-01']);
  });

  it('Should handles order of input messages and group them correctly', () => {
    const messages = [
      createMessage(1, '2024-06-02T09:00:00Z', '100'),
      createMessage(2, '2024-06-01T12:00:00Z', '100'),
      createMessage(3, '2024-06-01T08:00:00Z', '100'),
    ];

    mockUseQuery.mockReturnValue({
      filtered: () => ({
        sorted: () => ({
          snapshot: () => messages,
        }),
      }),
    });

    const { result } = renderHook(() => useGroupedMessages('100'));
    const grouped = result.current.groupedMessages;

    const expectedDates = ['2024-06-02', '2024-06-01'];
    const actualDates = grouped.filter((m) => m.type === 'timestamp').map((m) => m.dateKey);

    expect(actualDates).toEqual(expectedDates);
  });
});
