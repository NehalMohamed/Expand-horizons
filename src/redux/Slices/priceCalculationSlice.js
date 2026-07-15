import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  checkAUTH,
  isUserNotLoggedIn,
  isTokenExpiredOnly,
} from "../../helper/helperFN";
import { createAuthError } from "../../utils/authError";

const BASE_URL = process.env.REACT_APP_CLIENT_API_URL;


const getNonAuthHeaders = () => {
  let lang = localStorage.getItem("lang") || "en";
  return {
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": lang,
    },
  };
};

// Async thunk for calculating booking price
export const calculateBookingPrice = createAsyncThunk(
  "priceCalculation/calculatePrice",
  async (calculationData, { rejectWithValue }) => {

    try {
      const response = await axios.post(
        `${BASE_URL}/CalculateBookingPrice`,
        calculationData,
        getNonAuthHeaders()
      );

      if (response.data.success === false) {
        return rejectWithValue(
          response.data.errors || "Failed to calculate price"
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

const priceCalculationSlice = createSlice({
  name: "priceCalculation",
  initialState: {
    loading: false,
    error: null,
    success: false,
    calculationData: null,
  },
  reducers: {
    resetCalculation: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.calculationData = null;
    },
    clearCalculationData: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.calculationData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(calculateBookingPrice.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(calculateBookingPrice.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.calculationData = action.payload;
      })
      .addCase(calculateBookingPrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetCalculation, clearCalculationData } =
  priceCalculationSlice.actions;
export default priceCalculationSlice.reducer;
