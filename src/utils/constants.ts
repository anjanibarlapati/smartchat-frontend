import { Platform } from 'react-native';
import { MessageStatus } from '../types/message';

export const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5050/' : 'http://localhost:5050/';

export const STATUS_ORDER: Record<MessageStatus, number> = {
  pending: 0,
  sent: 1,
  delivered: 2,
  seen: 3,
};
