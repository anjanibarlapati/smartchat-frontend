import { configureStore } from '@reduxjs/toolkit';
import { activeChat } from './reducers/activeChat.reducer';
import { authReducer } from './reducers/auth.reducer';
import { themeReducer } from './reducers/theme.reducer';
import { userReducer } from './reducers/user.reducer';

export const store = configureStore({
    reducer: {
       user: userReducer,
       theme: themeReducer,
       auth: authReducer,
       activeChat: activeChat,
    },
});

export type storeState = ReturnType<typeof store.getState>;

