// features/destinations/destinationsSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_CLIENT_API_URL;

const getAuthHeaders = () => {
  let lang = localStorage.getItem("lang");
  return {
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": lang
    },
  };
};

export const fetchDestinations = createAsyncThunk(
  'destinations/fetchDestinations',
  async (lang_code, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        BASE_URL + '/getDestinations',
        {
          lang_code:lang_code,
          currency_code: "USD",
          country_code: ""
        },
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const destinationsSlice = createSlice({
  name: 'destinations',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDestinations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDestinations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDestinations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default destinationsSlice.reducer;