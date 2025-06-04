
import {groupMessagesByDate} from './groupMessagesByDate';
import {subDays} from 'date-fns';
import {Message} from '../schemas/Message';
import { ObjectId } from 'bson';

const createMockMessage = (id: number, sentAt: Date): Message => ({
 _id: new ObjectId(),
  sentAt,
}as Message);

