import Realm from 'realm';
import { Message } from '../realm-database/schemas/Message';
import { getTokens } from './getTokens';
import { MessageStatus } from '../types/message';
import { BASE_URL } from './constants';

export const syncMessagesStatusFromRemote = async (
    senderMobileNumber: string,
    realm: Realm,
) => {
    try {
        const relevantMessages = realm
            .objects<Message>('Message')
            .filtered('status IN { $0, $1 } AND isSender == true', MessageStatus.SENT, MessageStatus.DELIVERED);

        const messagesPayload = relevantMessages.map(msg => ({
            sentAt: msg.sentAt,
            status: msg.status,
        }));

        if (messagesPayload.length === 0) {return;}

        const tokens = await getTokens(senderMobileNumber);
        if (!tokens) {return;}

        const response = await fetch(`${BASE_URL}user/messages/status`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'smart-chat-token-header-key': `Bearer ${tokens.access_token}`,
            },
            body: JSON.stringify({ senderMobileNumber, messages: messagesPayload }),
        });

        if (response.ok) {
            const result = await response.json();
            realm.write(() => {
                result.messagesToUpdate.forEach((msg: { sentAt: string, status: MessageStatus }) => {
                    const message = realm.objects<Message>('Message').filtered('sentAt == $0', msg.sentAt)[0];
                    if (message) {
                        message.status = msg.status;
                    }
                });
            });
        }
    } catch (error) {
        console.error('Failed to sync messages status:', error);
    }
};
