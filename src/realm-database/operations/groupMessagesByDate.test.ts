import { Message } from '../../types/message';
import { groupMessagesByDate } from './groupMessagesByDate';

describe('groupMessagesByDate', () => {
  const staticMessages: Message[] = [
    {
      message: 'Hello!',
      sentAt: '2025-06-04T08:00:00.000Z',
      isSender: true,
      status: 'sent',
    },
    {
      message: 'Hi there!',
      sentAt: '2025-06-04T08:00:00.000Z',
      isSender: false,
      status: 'delivered',
    },
    {
      message: 'Good morning',
      sentAt: '2025-06-03T10:15:00.000Z',
      isSender: true,
      status: 'seen',
    },
    {
      message: 'Check this out',
      sentAt: '2025-06-02T09:30:00.000Z',
      isSender: false,
      status: 'sent',
    },
  ];

  it('should groups messages by their sentAt property', () => {
    const grouped = groupMessagesByDate(
      staticMessages ,
    );
    expect(Object.keys(grouped)).toHaveLength(3);
    expect(grouped['2025-06-04T08:00:00.000Z']).toHaveLength(2);
    expect(grouped['2025-06-03T10:15:00.000Z']).toHaveLength(1);
    expect(grouped['2025-06-02T09:30:00.000Z']).toHaveLength(1);
  });
  it('should correctly groups the messages content', () => {
    const grouped = groupMessagesByDate(
      staticMessages ,
    );
    expect(grouped['2025-06-04T08:00:00.000Z'][0].message).toBe('Hello!');
    expect(grouped['2025-06-04T08:00:00.000Z'][1].message).toBe('Hi there!');
    expect(grouped['2025-06-03T10:15:00.000Z'][0].message).toBe('Good morning');
    expect(grouped['2025-06-02T09:30:00.000Z'][0].message).toBe(
      'Check this out',
    );
  });
  it('should return an empty object when passed an empty array', () => {
    const grouped = groupMessagesByDate(
      []
    );
    expect(grouped).toEqual({});
  });
});
