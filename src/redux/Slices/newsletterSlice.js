import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  checkAUTH,
  isUserNotLoggedIn,
  isTokenExpiredOnly,
} from "../../helper/helperFN";
import { createAuthError } from "../../utils/authError";
import api from "../../api/axios";
const CONTACT_URL = process.env.REACT_APP_CONTACT_API_URL;

// Helper function to get client ID from user data
const getClientId = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.id || null;
};

// Async thunk for subscribing to the newsletter
export const subscribeNewsletter = createAsyncThunk(
  "newsletter/subscribeNewsletter",
  async (subscriptionData, { rejectWithValue }) => {

    try {
      const payload = {
        client_email: subscriptionData.email,
        client_name: subscriptionData.name,
        is_confirmed: true,
        subscribed_at: null,
        language_code: subscriptionData.language_code,
        id: 0,
        client_id: getClientId(),
      };

      const response = await api.post(
        `${CONTACT_URL}/SubscribeNewSletter`,
        payload
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const newsletterSlice = createSlice({
  name: "newsletter",
  initialState: {
    loading: false,
    success: false,
    error: null,
    subscribed: false,
    message: null,
  },
  reducers: {
    resetNewsletter: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.subscribed = false;
      state.message = null;
    },
    clearNewsletterError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Subscribe to newsletter
      .addCase(subscribeNewsletter.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.subscribed = false;
        state.message = null;
      })
      .addCase(subscribeNewsletter.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.subscribed = action.payload.success;
        state.message = action.payload.msg;
        state.error = action.payload.errors;
      })
      .addCase(subscribeNewsletter.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.subscribed = false;
        state.error = action.payload;
        state.message = null;
      });
  },
});

export const { resetNewsletter, clearNewsletterError } =
  newsletterSlice.actions;
export default newsletterSlice.reducer;
