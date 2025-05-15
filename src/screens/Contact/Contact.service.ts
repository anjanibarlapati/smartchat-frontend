import { BASE_URL } from '../../utils/constants';

export const fetchContacts = async(phoneNumbers: string[], accessToken: string) => {
    const response = await fetch(`${BASE_URL}user/contacts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'smart-chat-token-header-key': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({phoneNumbers}),
    });
    return response;
};
