import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Contact, Contacts } from '../../types/Contacts';

const initialState: Contacts = {
  contacts: [],
};

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setContacts: (state, action: PayloadAction<Contact[]>) => {
      state.contacts = action.payload;
    },
  },
});

export const { setContacts } = contactsSlice.actions;
export const contactsReducer = contactsSlice.reducer;
