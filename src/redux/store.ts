import { configureStore } from '@reduxjs/toolkit';
import { contactsReducer } from './reducers/contacts.reducer';
import messagesReducer from './reducers/messages.reducer';
import { themeReducer } from './reducers/theme.reducer';
import { userReducer } from './reducers/user.reducer';



export const store = configureStore({
    reducer: {
        user: userReducer,
        theme: themeReducer,
        contacts: contactsReducer,
        messages: messagesReducer,
    },
});

export type storeState = ReturnType<typeof store.getState>;

