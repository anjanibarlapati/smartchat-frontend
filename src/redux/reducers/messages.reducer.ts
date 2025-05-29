import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {createSelector} from 'reselect';
import {storeState} from '../store';

export interface Message {
  id: string;
  sender: string;
  receiver: string;
  message: string;
  sentAt: string;
  isSender: boolean;
  status: 'sent' | 'delivered' | 'failed' | 'seen';
}

interface MessagesState {
  [chatId: string]: Message[];
}

const initialState: MessagesState = {};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage(
      state,
      action: PayloadAction<{chatId: string; message: Message}>,
    ) {
      const {chatId, message} = action.payload;

      if (!state[chatId]) {
        state[chatId] = [];
      }
      state[chatId].push(message);
    },

    updateMessageStatus(
      state,
      action: PayloadAction<{
        chatId: string;
        id: string;
        status: 'sent' | 'delivered' | 'failed' | 'seen';
      }>,
    ) {
      const {chatId, id, status} = action.payload;

      const messages = state[chatId];

      if (messages) {
        const msg = messages.find(m => m.id === id);
        if (msg) {
          msg.status = status;
        }
      }
    },
    clearUserMessages(state, action: PayloadAction<{ chatId: string}> ){
    const {chatId} = action.payload;
      if(state[chatId]){
        state[chatId] = []; }
    },
  },
});

export const selectMessages = (state: storeState) => state.messages;

export const selectMessagesByChatId = (chatId: string) =>
  createSelector([selectMessages], messages => messages[chatId] || []);

export const {addMessage,clearUserMessages, updateMessageStatus} = messagesSlice.actions;

export default messagesSlice.reducer;
