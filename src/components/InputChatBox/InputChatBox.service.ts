import { BASE_URL } from '../../utils/constants';
import { encryptMessage } from '../../utils/encryptMessage';
import { normalizeNumber } from '../../utils/getContactsDetails';
import { getTokens } from '../../utils/getTokens';


export const sendMessage = async (senderMobileNumber: string, receiverMobileNumber: string, message: string) => {
  try {
    const tokens = await getTokens(senderMobileNumber);
    const receiverMobile = receiverMobileNumber;
    const normalizedreceiverMobileNumber = normalizeNumber(receiverMobile);
    if (!normalizedreceiverMobileNumber) {
      throw new Error('Invalid mobile number');
    }
    const { ciphertext, nonce } = await encryptMessage(normalizedreceiverMobileNumber, message, tokens.access_token);

    const response = await fetch(`${BASE_URL}user/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'smart-chat-token-header-key': `Bearer ${tokens.access_token}`,
      },
      body: JSON.stringify({
        senderMobileNumber: senderMobileNumber,
        receiverMobileNumber: normalizedreceiverMobileNumber,
        message: ciphertext,
        nonce: nonce,
      }),
    });
    const result = await response.json();
    return result;

  } catch (error) {
    throw new Error('Unable to send message');
  }
};
