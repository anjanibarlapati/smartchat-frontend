import { Chat } from '../realm-database/schemas/Chat';
import { getPublicKey } from './keyPairs';
import Realm from 'realm';


export const getUserPublicKey = async (realm: Realm, mobileNumber: string, accessToken: string) => {
    let chat = realm.objectForPrimaryKey<Chat>('Chat', mobileNumber);
    let publicKey: string | null = (chat && chat.publicKey) ? chat.publicKey : null;
    if (!publicKey) {
        const response = await getPublicKey(mobileNumber, accessToken);
        if (!response.ok) {
            throw new Error('Failed to fetch public key');
        }
        const result = await response.json();
        publicKey = result.publicKey;

        realm.write(() => {
            if (chat) {
                chat.publicKey = publicKey;
            } else {
                chat = realm!.create<Chat>('Chat', {
                    chatId: mobileNumber,
                    isBlocked: false,
                    publicKey,
                });
            }
        });
    }
    if (!publicKey) {
        throw new Error('Public key is missing for decrypting message');
    }
    return publicKey;
};
