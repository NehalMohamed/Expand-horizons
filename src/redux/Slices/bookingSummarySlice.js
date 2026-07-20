// Redux slice for bookingSummary: state, reducers, and async thunk lifecycle handling.
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  checkAUTH,
  isUserNotLoggedIn,
  isTokenExpiredOnly,
} from "../../helper/helperFN";
import { createAuthError } from "../../utils/authError";
import api from "../../api/axios";
const BOOKING_URL = process.env.REACT_APP_BOOKING_API_URL;

// Async thunk to get booking summary
export const getBookingSummary = createAsyncThunk(
  "bookingSummary/getBookingSummary",
  async (bookingData, { rejectWithValue }) => {

    try {
      const response = await api.post(
        `${BOOKING_URL}/GetBookingSummary`,
        bookingData
      );

      return response.data;
    } catch (error) {

      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice definition: contains local reducers and async thunk state transitions.
const bookingSummarySlice = createSlice({
  name: "bookingSummary",
  initialState: {
    loading: false,
    error: null,
    summaryData: null,
    shouldRefresh: false,
  },
    // Synchronous reducers for direct state updates from UI actions.
  reducers: {
    clearBookingSummary: (state) => {
      state.loading = false;
      state.error = null;
      state.summaryData = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    triggerRefresh: (state) => {
      state.shouldRefresh = true; // Add this flag to your initialState
    },
    clearRefresh: (state) => {
      state.shouldRefresh = false;
    },
  },
  // Async lifecycle reducers for pending/fulfilled/rejected thunk states.
  extraReducers: (builder) => {
    builder
      // Get Booking Summary
      .addCase(getBookingSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summaryData = action.payload;
      })
      .addCase(getBookingSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBookingSummary, clearError, triggerRefresh, clearRefresh } =
  bookingSummarySlice.actions;
export default bookingSummarySlice.reducer;
