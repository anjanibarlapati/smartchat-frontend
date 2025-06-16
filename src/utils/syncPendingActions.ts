import Realm from 'realm';
import { blockUserChat } from '../components/ChatOptionsModal/blockChat.service';
import { clearUserChat } from '../components/ChatOptionsModal/clearChat.service';
import { unblockUserChat } from '../components/ChatOptionsModal/unblockChat.service';
import { UserAction } from '../realm-database/schemas/UserAction';
import { getSocket } from './socket';


type SyncPayLoad = {
    sentAt?: string;
    senderMobileNumber?: string;
    receiverMobileNumber?: string;
    clearedChatAt? : Date;
    blockedAt?: Date;
    unblockedAt?: Date;
}

export enum SyncActionType {
  MESSAGE_SEEN = 'message_seen',
  CLEAR_CHAT = 'clear_chat',
  BLOCK_USER = 'block_user',
  UNBLOCK_USER = 'unblock_user',
}

export const syncPendingActions = async (realm: Realm) => {
    const pending = realm.objects<UserAction>('UserAction').filtered('status = "pending"');
    for (const action of pending) {
       const { type, payload } = action;
       let response: Response;
       let isActionSynced = false;
        try {
        while(!isActionSynced ){
            switch (type) {
                case SyncActionType.MESSAGE_SEEN :
                    const { sentAt } = payload as SyncPayLoad;
                    const socket = getSocket();
                    if (socket) {
                        socket.emit('messageRead', {
                            sentAt: sentAt,
                        });
                         isActionSynced = true;
                    }
                    break;

                case SyncActionType.CLEAR_CHAT: {
                    const { senderMobileNumber, receiverMobileNumber, clearedChatAt } = payload as SyncPayLoad;
                    if (senderMobileNumber && receiverMobileNumber) {
                        response = await clearUserChat(senderMobileNumber, receiverMobileNumber, clearedChatAt);
                    }
                    break;
                }


                case SyncActionType.BLOCK_USER: {
                    const { senderMobileNumber, receiverMobileNumber, blockedAt} = payload as SyncPayLoad;
                    if (senderMobileNumber && receiverMobileNumber) {
                        response = await blockUserChat({ senderMobileNumber, receiverMobileNumber, blockedAt });
                    }
                    break;
                }

                case SyncActionType.UNBLOCK_USER: {
                    const { senderMobileNumber, receiverMobileNumber, unblockedAt } = payload as SyncPayLoad;
                    if (senderMobileNumber && receiverMobileNumber) {
                        response = await unblockUserChat(senderMobileNumber, receiverMobileNumber, unblockedAt);
                    }
                    break;
                }
                   default:
                      isActionSynced = true;
                      break;
            }
            realm.write(() => {
                if((response && response.ok) || type === SyncActionType.MESSAGE_SEEN){
                   realm.delete(action);
                   isActionSynced = true;
                }
            });
              break;
        }
        } catch (error) {
            console.log(`Sync failed for ${type}:`, error);
        }
    }
};
