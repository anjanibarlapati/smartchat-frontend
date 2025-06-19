import {BASE_URL} from './constants';
import {MessageToSend} from './storePendingMessages';

export const unsendMessages = async (
  senderMobileNumber: string,
  messages: MessageToSend[],
  accessToken: string,
) => {
  try {
    const response = await fetch(`${BASE_URL}user/unsendMessages`, {
      method: 'POST',
      headers: {
            'Content-Type': 'application/json',
            'smart-chat-token-header-key': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({senderMobileNumber, messages}),
    });
    return response;
  } catch (error) {
    throw new Error('Unable to sync messages');
  }
};
