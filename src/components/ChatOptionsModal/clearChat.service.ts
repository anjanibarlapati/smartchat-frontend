import { BASE_URL } from '../../utils/constants';
import { getTokens } from '../../utils/getTokens';

export const clearUserChat = async(senderMobileNumber: string, receiverMobileNumber: string) => {
    try{
     const tokens = await getTokens(senderMobileNumber);
    const response = await fetch(`${BASE_URL}user/chat`, {
       method: 'DELETE',
         headers: {
          'Content-Type': 'application/json',
          'smart-chat-token-header-key': `Bearer ${tokens.access_token}`,
         },
        body: JSON.stringify({
            senderMobileNumber: senderMobileNumber,
            receiverMobileNumber: receiverMobileNumber,
        }),
    });
    return response;
    }catch(error){
        throw new Error('Error while clearing the chat');
    }
};
