import { Credentials } from '../../types/Credentials';
import { BASE_URL } from '../../utils/constants';

export const login = async(credentials: Credentials) => {
    const response = await fetch(`${BASE_URL}login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    return response;
};
