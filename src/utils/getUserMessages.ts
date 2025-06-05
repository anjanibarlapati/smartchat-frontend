import { BASE_URL } from './constants';

export const getUserMessages = async (
  mobileNumber: string,
  access_token: string,
) => {
  const response = await fetch(`${BASE_URL}user/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'smart-chat-token-header-key': `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      mobileNumber: mobileNumber,
    }),
  });
  return response;
};
