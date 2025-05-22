import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  successMessage: string | null;
}

const initialState: AuthState = {
  successMessage: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSuccessMessage: (state, action: PayloadAction<string>) => {
      state.successMessage = action.payload;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
});

export const { setSuccessMessage, clearSuccessMessage } = authSlice.actions;
export const authReducer = authSlice.reducer;
