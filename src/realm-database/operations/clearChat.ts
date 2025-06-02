import Realm from 'realm';

export const clearChatInRealm = (realm: Realm, chatId: string) => {
  realm.write(() => {
    const messages = realm.objects('Message').filtered('chat.chatId == $0', chatId);
    realm.delete(messages);
  });
};
