import { blockUserChat } from '../components/ChatOptionsModal/blockChat.service';
import { clearUserChat } from '../components/ChatOptionsModal/clearChat.service';
import { unblockUserChat } from '../components/ChatOptionsModal/unblockChat.service';
import { UserAction } from '../realm-database/schemas/UserAction';
import { getSocket } from './socket';
import Realm from 'realm';


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
    console.log('pending actions', pending);
    for (const action of pending) {
       const { type, payload } = action;
       let response: Response;
       let isActionSynced = false;
        console.log('action type ', type, payload);
        try {
        while(!isActionSynced){
            switch (type) {
                case SyncActionType.MESSAGE_SEEN :
                    const { sentAt } = payload as SyncPayLoad;
                    const socket = getSocket();
                    if (socket) {
                        socket.emit('messageRead', {
                            sentAt: sentAt,
                        });
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
            }
            realm.write(() => {
                if((response && response.ok) || type === SyncActionType.MESSAGE_SEEN){
                   realm.delete(action);
                   isActionSynced = true;
                }
            });
        }
        } catch (e) {
            console.log(`Sync failed for ${type}:`, e);
        }
    }
};
