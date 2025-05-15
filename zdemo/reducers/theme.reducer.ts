
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeMode, ThemeState } from '../../types/Theme';


const initialState: ThemeState = {
  mode: 'system',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
  },
});

export const { setThemeMode } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;

