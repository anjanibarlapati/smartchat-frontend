import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/User';

const initialUserState: User = {
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    countryCode: '',
    profilePicture: '',
  };

  export const userSlice = createSlice({
    name: 'user',
    initialState: initialUserState,
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
      resetUser: () => initialUserState,
    },
  });

  export const { setUserProperty, setUserDetails, resetUser } = userSlice.actions;
  export const userReducer = userSlice.reducer;
