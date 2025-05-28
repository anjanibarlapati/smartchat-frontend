import { BASE_URL } from '../../utils/constants';
import { getTokens } from '../../utils/getTokens';

export const unblockUserChat = async(senderMobileNumber: string, receiverMobileNumber: string) => {
    try{
     const tokens = await getTokens(senderMobileNumber);
    const response = await fetch(`${BASE_URL}user/unblock/chat`, {
       method: 'PATCH',
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
        throw new Error('Error while unblocking chat');
    }
};
