import {groupMessagesByDate} from './groupMessagesByDate';
import {Message} from '../../types/message';
import {Message as MessageSchema} from '../schemas/Message';

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
      staticMessages as unknown as Realm.Results<MessageSchema>,
    );
    expect(Object.keys(grouped)).toHaveLength(3);
    expect(grouped['2025-06-04T08:00:00.000Z']).toHaveLength(2);
    expect(grouped['2025-06-03T10:15:00.000Z']).toHaveLength(1);
    expect(grouped['2025-06-02T09:30:00.000Z']).toHaveLength(1);
  });
});
