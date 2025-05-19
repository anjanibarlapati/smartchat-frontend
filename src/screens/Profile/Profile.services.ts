import { BASE_URL } from '../../utils/constants';

export const deleteAccount = async(mobileNumber: string, accessToken: string) => {
    const response = await fetch(`${BASE_URL}user`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'smart-chat-token-header-key': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            mobileNumber: mobileNumber,
        }),
    });
    return response;
};

export const removeProfilePic = async(profile: string, mobileNumber: string, accessToken: string) => {
    const response = await fetch(`${BASE_URL}user/profile`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'smart-chat-token-header-key': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            profilePicture: profile,
            mobileNumber: mobileNumber,
        }),
    });
    return response;
};

export const updateProfileDetails = async(property: string, value: string, mobileNumber: string, accessToken: string) => {
    const response = await fetch(`${BASE_URL}user`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'smart-chat-token-header-key': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            data: {
                [property]: value,
            },
            mobileNumber: mobileNumber,
        }),
    });
    return response;
};

export const updateProfilePic = async(form: FormData, accessToken: string) => {
    const response = await fetch(`${BASE_URL}user/profile`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'multipart/form-data',
            'smart-chat-token-header-key': `Bearer ${accessToken}`,
        },
        body: form,
    });
    return response;
};

