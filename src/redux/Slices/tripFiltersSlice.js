// Redux slice for trip filter options (trip types and filter destinations).
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getCompanyCurrencyCode } from "../../utils/companyCurrency";

const BASE_URL = process.env.REACT_APP_CLIENT_API_URL;

const getNonAuthHeaders = () => ({
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": localStorage.getItem("lang") || "en",
  },
});

export const fetchTripTypes = createAsyncThunk(
  "tripFilters/fetchTripTypes",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/GetTripTypes`,
        null,
        getNonAuthHeaders()
      );
      return data;
    } catch (e) {
      return rejectWithValue(e?.response?.data || e?.message || "Fetch trip types failed");
    }
  }
);

export const fetchFilterDestinations = createAsyncThunk(
  "tripFilters/fetchFilterDestinations",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/getDestinations`,
        {
          lang_code: params.lang_code,
          currency_code: getCompanyCurrencyCode(),
          country_code: "",
          leaf: false,
          trip_type: 1,
          parent_id: 0,
        },
        getNonAuthHeaders()
      );
      return data;
    } catch (e) {
      return rejectWithValue(e?.response?.data || e?.message || "Fetch destinations failed");
    }
  }
);

const tripFiltersSlice = createSlice({
  name: "tripFilters",
  initialState: {
    types: [],
    destinations: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTripTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTripTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.types = action.payload;
      })
      .addCase(fetchTripTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFilterDestinations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilterDestinations.fulfilled, (state, action) => {
        state.loading = false;
        state.destinations = action.payload;
      })
      .addCase(fetchFilterDestinations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default tripFiltersSlice.reducer;
