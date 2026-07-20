// src/redux/Slices/extrasSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  checkAUTH,
  isUserNotLoggedIn,
  isTokenExpiredOnly,
} from "../../helper/helperFN";
import { createAuthError } from "../../utils/authError";
import api from "../../api/axios";

// Base URL for all booking-related endpoints used by this slice.
const BOOKING_URL = process.env.REACT_APP_BOOKING_API_URL;

// Fetches all available extras for a trip. The component passes trip context
// (trip id/type/date, etc.) and the API returns available extra items.
export const getTripExtras = createAsyncThunk(
  "extras/getTripExtras",
  async (tripData, { rejectWithValue }) => {

    try {
      const response = await api.post(
        `${BOOKING_URL}/GetTrip_Extra_Mains`,
        tripData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Assigns a selected extra to the active booking. On success, the request
// payload (action.meta.arg) is appended to assignedExtras for quick local sync.
export const assignExtraToBooking = createAsyncThunk(
  "extras/assignExtraToBooking",
  async (extraData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `${BOOKING_URL}/AssignExtraToBooking`,
        extraData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice definition: contains local reducers and async thunk state transitions.
const extrasSlice = createSlice({
  name: "extras",
  // Slice state keeps both available extras (from trip) and applied extras
  // (user selections tied to a booking), plus UI loading/error flags.
  initialState: {
    loading: false,
    error: null,
    tripExtras: [],
    assignedExtras: [],
    pickupLocation: null,
  },
    // Synchronous reducers for direct state updates from UI actions.
  reducers: {
    // Persists pickup location selected in booking steps.
    setPickupLocation: (state, action) => {
      state.pickupLocation = action.payload;
    },
    // Resets extras-related state when a booking flow is restarted or closed.
    clearExtrasData: (state) => {
      state.loading = false;
      state.error = null;
      state.tripExtras = [];
      state.assignedExtras = [];
      state.pickupLocation = null;
    },
    // Clears only the error message while preserving current data.
    clearError: (state) => {
      state.error = null;
    },
  },
  // Async lifecycle reducers for pending/fulfilled/rejected thunk states.
  extraReducers: (builder) => {
    builder
      // getTripExtras lifecycle
      .addCase(getTripExtras.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTripExtras.fulfilled, (state, action) => {
        state.loading = false;
        state.tripExtras = action.payload;
      })
      .addCase(getTripExtras.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // assignExtraToBooking lifecycle
      .addCase(assignExtraToBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignExtraToBooking.fulfilled, (state, action) => {
        state.loading = false;
        // Server response includes success boolean; only store local assignment
        // when backend confirms the operation.
        if (action.payload.success) {
          state.assignedExtras.push(action.meta.arg);
        }
      })
      .addCase(assignExtraToBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPickupLocation, clearExtrasData, clearError } =
  extrasSlice.actions;
export default extrasSlice.reducer;
