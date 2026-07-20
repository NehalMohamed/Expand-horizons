// Redux slice for contact: state, reducers, and async thunk lifecycle handling.
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  checkAUTH,
  isUserNotLoggedIn,
  isTokenExpiredOnly,
} from "../../helper/helperFN";
import { createAuthError } from "../../utils/authError";
import api from "../../api/axios";
const CONTACT_URL = process.env.REACT_APP_CONTACT_API_URL;

// Async thunk: submitContactForm performs the API request for this slice.
export const submitContactForm = createAsyncThunk(
  "contact/submitContactForm",
  async (contactData, { rejectWithValue }) => {

    try {
      const response = await api.post(
        `${CONTACT_URL}/SendContactMail`,
        contactData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice definition: contains local reducers and async thunk state transitions.
const contactSlice = createSlice({
  name: "contact",
  initialState: {
    loading: false,
    success: false,
    error: null,
    submitted: false,
  },
    // Synchronous reducers for direct state updates from UI actions.
  reducers: {
    resetContactForm: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.submitted = false;
    },
    clearContactError: (state) => {
      state.error = null;
    },
  },
  // Async lifecycle reducers for pending/fulfilled/rejected thunk states.
  extraReducers: (builder) => {
    builder
      // Submit contact form
      .addCase(submitContactForm.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.submitted = false;
      })
      .addCase(submitContactForm.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.submitted = true;
        state.error = null;
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.submitted = true;
        state.error = action.payload;
      });
  },
});

export const { resetContactForm, clearContactError } = contactSlice.actions;
export default contactSlice.reducer;
