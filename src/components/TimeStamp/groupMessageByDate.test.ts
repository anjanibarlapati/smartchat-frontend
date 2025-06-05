import {renderHook} from '@testing-library/react-native';
import { useGroupedMessages } from './groupMessagesByDate';
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
})