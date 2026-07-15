import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  checkAUTH,
  isUserNotLoggedIn,
  isTokenExpiredOnly,
} from "../../helper/helperFN";
import { createAuthError } from "../../utils/authError";
import api from "../../api/axios";
const BOOKING_URL = process.env.REACT_APP_BOOKING_API_URL;

export const cancelBooking = createAsyncThunk(
  "bookingCancel/cancelBooking",
  async (bookingId, { rejectWithValue }) => {

    try {
      const response = await api.post(
        `${BOOKING_URL}/CancelBooking?booking_id=${bookingId}`
      );

      if (response.data.success === false) {
        return rejectWithValue(
          response.data.errors || "Failed to cancel booking"
        );
      }

      return { bookingId, response: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.errors || error.message);
    }
  }
);

const bookingCancelSlice = createSlice({
  name: "bookingCancel",
  initialState: {
    loading: false,
    error: null,
    success: false,
    canceledBookingId: null,
  },
  reducers: {
    clearCancelState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.canceledBookingId = null;
    },
    resetCancelStatus: (state) => {
      state.success = false;
      state.canceledBookingId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.canceledBookingId = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.canceledBookingId = action.payload.bookingId;
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.canceledBookingId = null;
      });
  },
});

export const { clearCancelState, resetCancelStatus } =
  bookingCancelSlice.actions;
export default bookingCancelSlice.reducer;
