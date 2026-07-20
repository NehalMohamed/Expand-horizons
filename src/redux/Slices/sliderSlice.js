// Redux slice for slider: state, reducers, and async thunk lifecycle handling.
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { getCompanyCurrencyCode } from "../../utils/companyCurrency";
const BASE_URL = process.env.REACT_APP_CLIENT_API_URL;

// Async thunk: fetchSliderTrips performs the API request for this slice.
export const fetchSliderTrips = createAsyncThunk(
  "slider/fetchSliderTrips",
  async (lang_code = "en", { rejectWithValue }) => {
    try {
      const response = await api.post(
        BASE_URL + "/GetTripsForSlider",
        {
          destination_id: 0,
          lang_code: lang_code,
          show_in_top: false,
          currency_code: getCompanyCurrencyCode(),
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice definition: contains local reducers and async thunk state transitions.
const sliderSlice = createSlice({
  name: "slider",
  initialState: {
    slides: [],
    loading: false,
    error: null,
  },
  reducers: {},
  // Async lifecycle reducers for pending/fulfilled/rejected thunk states.
  extraReducers: (builder) => {
    builder
      .addCase(fetchSliderTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSliderTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.slides = action.payload.map((trip) => ({
          id: trip.trip_id,
          image: trip.default_img,
          title: trip.trip_name,
          subtitle: trip.trip_description,
        }));
      })
      .addCase(fetchSliderTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default sliderSlice.reducer;
