import { BASE_URL } from '../../utils/constants';
import { getTokens } from '../../utils/getTokens';

type BlockChatProps = {
  senderMobileNumber: string;
  receiverMobileNumber: string;
};

export const blockUserChat = async ({
  senderMobileNumber,
  receiverMobileNumber,
}: BlockChatProps) => {
  const token = await getTokens(senderMobileNumber);

  const response = await fetch(`${BASE_URL}user/block/chat`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'smart-chat-token-header-key': `Bearer ${token.access_token}`,
    },
    body: JSON.stringify({
      senderMobileNumber,
      receiverMobileNumber,
    }),
  });

  return response;
};
