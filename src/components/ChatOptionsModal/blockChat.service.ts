import {BASE_URL} from '../../utils/constants';
import {getTokens} from '../../utils/getTokens';

export const blockUserChat = async (
  senderMobileNumber: string,
  receiverMobileNumber: string,
) => {
  const token = await getTokens(senderMobileNumber);

  const response = await fetch(`${BASE_URL}/user/block/chat`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      senderMobileNumber,
      receiverMobileNumber,
    }),
  });

  return response;
};
