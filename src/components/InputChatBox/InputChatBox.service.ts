import { BASE_URL } from '../../utils/constants';
import { encryptMessage } from '../../utils/encryptMessage';
import { getTokens } from '../../utils/getTokens';


export const sendMessage = async (senderMobileNumber: string, receiverMobileNumber: string, message: string, sentAt: string) => {
  try {
    const tokens = await getTokens(senderMobileNumber);

    const { ciphertext, nonce } = await encryptMessage(receiverMobileNumber, message, tokens.access_token);
    const response = await fetch(`${BASE_URL}user/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'smart-chat-token-header-key': `Bearer ${tokens.access_token}`,
      },
      body: JSON.stringify({
        senderMobileNumber: senderMobileNumber,
        receiverMobileNumber: receiverMobileNumber,
        message: ciphertext,
        sentAt: sentAt,
        nonce: nonce,
      }),
    });
    return response;

  } catch (error) {
    throw new Error('Unable to send message');
  }
};
