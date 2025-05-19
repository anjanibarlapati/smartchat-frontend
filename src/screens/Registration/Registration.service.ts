import { BASE_URL } from '../../utils/constants';

export const register = async(formData: FormData) => {
    const response = await fetch(`${BASE_URL}register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        body: formData,
    });
    return response;
};
