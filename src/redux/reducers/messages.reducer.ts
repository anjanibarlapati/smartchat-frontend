import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
    id: string;
    sender: string;
    receiver: string;
    message: string;
    sentAt: string;
    isSender: boolean;
    status: 'sent' | 'delivered' | 'failed';
}

interface MessagesState {
    [chatId: string]: Message[];
}

const initialState: MessagesState = {};

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        addMessage(state, action: PayloadAction<{ chatId: string; message: Message }>) {
            const { chatId, message } = action.payload;
            if (!state[chatId]) { state[chatId] = []; }
            state[chatId].push(message);
        },
    },
});

export const { addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
