import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './reducers/auth.reducer';
import { contactsReducer } from './reducers/contacts.reducer';
import { themeReducer } from './reducers/theme.reducer';
import { userReducer } from './reducers/user.reducer';


export const store = configureStore({
    reducer: {
       user: userReducer,
       theme: themeReducer,
       contacts: contactsReducer,
       auth: authReducer,
    },
});

export type storeState = ReturnType<typeof store.getState>;


