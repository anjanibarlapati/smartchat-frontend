import { store } from '../redux/store';

export type User = {
    firstName: string,
    lastName: string,
    email: string,
    mobileNumber: string,
    countryCode: string,
    profilePicture?: string
}
export type userState = ReturnType<typeof store.getState>
