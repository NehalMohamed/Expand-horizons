// Redux slice for language: state, reducers, and async thunk lifecycle handling.
import { createSlice } from '@reduxjs/toolkit';

// Slice definition: contains local reducers and async thunk state transitions.
const languageSlice = createSlice({
  name: 'language',
  initialState: {
    currentLang: localStorage.getItem('lang') || 'en',
  },
    // Synchronous reducers for direct state updates from UI actions.
  reducers: {
    setLanguages: (state, action) => {
      state.currentLang = action.payload;
    },
  },
});

export const { setLanguages } = languageSlice.actions;
export default languageSlice.reducer;
