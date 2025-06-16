import { BASE_URL } from '../../utils/constants';
import { getTokens } from '../../utils/getTokens';

export const clearUserChat = async(senderMobileNumber: string, receiverMobileNumber: string, clearedChatAt?: Date) => {
    let response: Response;
    try{
     const tokens = await getTokens(senderMobileNumber);
     response = await fetch(`${BASE_URL}user/chat`, {
       method: 'DELETE',
         headers: {
          'Content-Type': 'application/json',
          'smart-chat-token-header-key': `Bearer ${tokens.access_token}`,
         },
        body: JSON.stringify({
            senderMobileNumber: senderMobileNumber,
            receiverMobileNumber: receiverMobileNumber,
            time: clearedChatAt,
        }),
    });
    return response;
    }catch(error){
        throw new Error('Error while clearing the chat');
    }
};
