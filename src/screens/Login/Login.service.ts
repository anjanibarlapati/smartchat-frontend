import { getDeviceId } from 'react-native-device-info';
import { Credentials } from '../../types/Credentials';
import { Chat, Messages } from '../../types/message';
import { BASE_URL } from '../../utils/constants';
import { decryptMessage } from '../../utils/decryptMessage';

export const login = async(credentials: Credentials) => {
    const response = await fetch(`${BASE_URL}login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({...credentials, deviceId: getDeviceId()}),
    });
    return response;
};

export const fetchChats = async(mobileNumber: string, accessToken: string) => {
    const response = await fetch(`${BASE_URL}user/chats`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'smart-chat-token-header-key': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({mobileNumber: mobileNumber}),
    });
    return response;
};

export const formatMessages = async(chats: Chat[], accessToken: string) => {
  const chatMessages: Messages = {};
  for (const chat of chats) {
    const { chatId, messages } = chat;
    const formattedMessages = [];
    for (const message of messages) {
      const actualMessage = await decryptMessage(
        chatId,
        message.message,
        message.nonce,
        accessToken
      );
      formattedMessages.push({
        message: actualMessage,
        sentAt: message.sentAt,
        isSender: message.isSender,
        status: message.status,
      });
    }
    chatMessages[chatId] = formattedMessages;
  }
  return chatMessages;
};
