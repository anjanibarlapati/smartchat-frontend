import {BASE_URL} from './constants';
import {MessageToSend} from './storePendingMessages';

export const unsendMessages = async (
  senderMobileNumber: string,
  messages: MessageToSend[],
) => {
  try {
    const response = await fetch(`${BASE_URL}user/unsendMessages`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({senderMobileNumber, messages}),
    });
    return response;
  } catch (error) {
    throw new Error('Unable to sync messages');
  }
};
