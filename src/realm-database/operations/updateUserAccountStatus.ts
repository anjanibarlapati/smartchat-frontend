import { Chat } from '../schemas/Chat';
import { getRealmInstance } from '../connection';

export const updateUserAccountStatusInRealm = ( chatId: string, isAccountDeleted: boolean) => {
  const realm = getRealmInstance();
  try {
    realm.write(() => {
    let chat = realm.objectForPrimaryKey<Chat>('Chat', chatId);
    if(chat) {
       chat.isAccountDeleted = isAccountDeleted;
    }
    });
  } catch (error) {
    console.error('Error while updating message status:', error);
  }
};
