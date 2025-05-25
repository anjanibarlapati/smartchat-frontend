import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { storeState } from '../store';
import {  createSelector } from 'reselect';

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

export const selectMessages = (state: storeState) => state.messages;

export const selectMessagesByChatId = (chatId: string) =>
  createSelector([selectMessages], (messages) => messages[chatId] || []);


export const { addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
