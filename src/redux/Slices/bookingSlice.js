import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  checkAUTH,
  isUserNotLoggedIn,
  isTokenExpiredOnly,
} from "../../helper/helperFN";
import { createAuthError } from "../../utils/authError";
import api from "../../api/axios";
const BOOKING_URL = process.env.REACT_APP_BOOKING_API_URL;
const BASE_URL = process.env.REACT_APP_CLIENT_API_URL;

export const checkAvailability = createAsyncThunk(
  "booking/checkAvailability",
  async (bookingData, { rejectWithValue }) => {

    try {
      const response = await api.post(
        `${BOOKING_URL}/SaveClientBooking`,
        bookingData
      );

      if (response.data.success === false) {
        return rejectWithValue(
          response.data.errors || "Failed to check availability"
        );
      }

      return response.data;
    } catch (error) {

      // Handle API error response format
      if (error.response?.data?.success === false) {
        return rejectWithValue(error.response.data.errors || error.message);
      }

      return rejectWithValue(error.response?.data?.errors || error.message);
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    loading: false,
    error: null,
    success: false,
    availabilityData: null,
  },
  reducers: {
    resetBookingOperation: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.availabilityData = null;
    },
    clearBookingData: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.availabilityData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check availability
      .addCase(checkAvailability.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(checkAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.availabilityData = action.payload;
      })
      .addCase(checkAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetBookingOperation, clearBookingData } = bookingSlice.actions;
export default bookingSlice.reducer;
