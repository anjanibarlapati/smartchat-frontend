import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/User';

const initialState: User = {
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    countryCode: '',
    profilePicture: '',
  };

  export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      setUserProperty: (
        state,
        action: PayloadAction<{ property: keyof User; value: string }>
      ) => {
       const { property, value } = action.payload;
        state[property] = value;
      },
      setUserDetails: (state, action: PayloadAction<User>) => {
        return action.payload;
      },
      resetUser: () => initialState,
    },
  });

  export const { setUserProperty, setUserDetails, resetUser } = userSlice.actions;
  export const userReducer = userSlice.reducer;
