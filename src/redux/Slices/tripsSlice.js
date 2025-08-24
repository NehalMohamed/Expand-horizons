import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import axios from "axios";

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

// ---------- Thunks ----------
export const fetchTripsAll = createAsyncThunk(
  "trips/fetchTripsAll",
  async (params,{ rejectWithValue }
  ) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/GetTripsAll`, 
        params,
        getAuthHeaders()
    );
      return data;
    } catch (e) {
      return rejectWithValue(e?.message || "Fetch trips failed");
    }
  }
);

export const fetchPickupsForTrip = createAsyncThunk(
  "trips/fetchPickupsForTrip",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/GetPickupsForTrip`, 
       params,
      getAuthHeaders()
    );
      return data;
    } catch (e) {
      return rejectWithValue(e?.message || "Fetch pickups failed");
    }
  }
);

// ---------- Slice ----------
const tripsSlice = createSlice({
  name: "trips",
  initialState: {
    trips: [],
    pickupsByTrip: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchTripsAll.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchTripsAll.fulfilled, (state, action) => {
      state.loading = false;
      state.trips = action.payload;
    })
    .addCase(fetchTripsAll.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(fetchPickupsForTrip.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
     .addCase(fetchPickupsForTrip.fulfilled, (state, action) => {
      state.loading = false;
      state.pickupsByTrip = action.payload;
    })
    .addCase(fetchPickupsForTrip.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
  },
});

export default tripsSlice.reducer;