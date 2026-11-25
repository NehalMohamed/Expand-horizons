// Redux slice for language: state, reducers, and async thunk lifecycle handling.
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/axios';

const ADMIN_URL = process.env.REACT_APP_ADMIN_API_URL;

// Async thunk: fetchLanguages loads the available languages (flag + code).
export const fetchLanguages = createAsyncThunk(
  'language/fetchLanguages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post(`${ADMIN_URL}/Get_Languages`, null, {
        skipAuth: true,
        headers: { 'Accept-Language': 'en' },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Slice definition: contains local reducers and async thunk state transitions.
const languageSlice = createSlice({
  name: 'language',
  initialState: {
    currentLang: localStorage.getItem('lang') || 'en',
    languages: [],
    loading: false,
  },
    // Synchronous reducers for direct state updates from UI actions.
  reducers: {
    setLanguages: (state, action) => {
      state.currentLang = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLanguages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLanguages.fulfilled, (state, action) => {
        state.loading = false;
        state.languages = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchLanguages.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setLanguages } = languageSlice.actions;
export default languageSlice.reducer;
