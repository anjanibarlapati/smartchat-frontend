import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Message, Messages } from '../../types/message';
import { storeState } from '../store';

const initialState: Messages = {};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage(
      state,
      action: PayloadAction<{ chatId: string; message: Message }>,
    ) {
      const { chatId, message } = action.payload;

      if (!state[chatId]) {
        state[chatId] = [];
      }
      state[chatId].push(message);
    },
    updateMessageStatus(
      state,
      action: PayloadAction<{
        chatId: string;
        sentAt: string;
        status: 'sent' | 'delivered' | 'seen';
        updateAllBeforeSentAt?: boolean;
      }>,
    ) {
      const { chatId, sentAt, status, updateAllBeforeSentAt } = action.payload;
      const messages = state[chatId];
      if (!messages) {
        return;
      }

      if (updateAllBeforeSentAt) {
        for (let index = messages.length - 1; index >= 0; index--) {
          const message = messages[index];
          if (message.sentAt <= sentAt && message.status !== status) {
            message.status = status;
          } else {
            break;
          }

        }
      } else {
        const message = messages.find(m => m.sentAt === sentAt);
        if (message) {
          message.status = status;
        }
      }
    },
    clearUserMessages(state, action: PayloadAction<{ chatId: string }>) {
      const { chatId } = action.payload;
      if (state[chatId]) {
        state[chatId] = [];
      }
    },
    storeMessages(
      state,
      action: PayloadAction<{ chatMessages: Messages }>
    ) {
      return action.payload.chatMessages;
    },
  },
});

export const selectMessages = (state: storeState) => state.messages;

export const selectMessagesByChatId = (chatId: string) =>
  createSelector([selectMessages], messages => messages[chatId] || []);

export const { addMessage, clearUserMessages, updateMessageStatus, storeMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
