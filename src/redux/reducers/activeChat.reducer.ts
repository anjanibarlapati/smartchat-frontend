import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ActiveChatState {
  currentChatMobileNumber: string | null;
}

const initialState: ActiveChatState = {
  currentChatMobileNumber: null,
};

const activeChatSlice = createSlice({
  name: 'activeChat',
  initialState,
  reducers: {
    setActiveChat(state, action: PayloadAction<string | null>) {
      state.currentChatMobileNumber = action.payload;
    },
    resetActiveChat(state) {
      state.currentChatMobileNumber = null;
    },
  },
});

export const { setActiveChat, resetActiveChat } = activeChatSlice.actions;
export const  activeChat = activeChatSlice.reducer;
