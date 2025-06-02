import { encryptMessage } from '../../utils/encryptMessage';
import { getTokens } from '../../utils/getTokens';
import { getSocket } from '../../utils/socket';


export const sendMessage = async (senderMobileNumber: string, receiverMobileNumber: string, message: string, sentAt: string, status: 'sent' | 'delivered' | 'seen')=> {
  try{
    const tokens = await getTokens(senderMobileNumber);
    const { ciphertext, nonce } = await encryptMessage(receiverMobileNumber, message, tokens.access_token);
      const socket = getSocket();
      if(!socket){
        return false;
      }
    socket.emit('store-message',{
        senderMobileNumber: senderMobileNumber,
        receiverMobileNumber,
        message: ciphertext,
        nonce,
        sentAt,
        status,
    });
  }catch(error){
      throw new Error('Unable to emit message to server');
  }
};
