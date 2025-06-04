
import {groupMessagesByDate} from './groupMessagesByDate';
import {subDays} from 'date-fns';
import {Message} from '../schemas/Message';
import { ObjectId } from 'bson';

const createMockMessage = (id: number, sentAt: Date): Message => ({
 _id: new ObjectId(),
  sentAt,
}as Message);

describe('groupMessagesByDate', () => {
  test('should groups messages sent today', () => {
    const today = new Date();
    const messages = [createMockMessage(1, today), createMockMessage(2, today)];
    const grouped = groupMessagesByDate(messages as unknown as Realm.Results<Message>);
    expect(grouped.Today.length).toBe(2);
    expect(grouped.Today[0]._id).toBeInstanceOf(ObjectId);
  });

  test('should group messages sent Yesterday', () => {
    const yesterday = subDays(new Date(), 1);
    const messages = [createMockMessage(3, yesterday)];

    const grouped = groupMessagesByDate(messages as unknown as Realm.Results<Message>);

    expect(grouped.Yesterday.length).toBe(1);
  });
});
