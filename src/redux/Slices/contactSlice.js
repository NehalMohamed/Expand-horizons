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

const contactSlice = createSlice({
  name: "contact",
  initialState: {
    loading: false,
    success: false,
    error: null,
    submitted: false,
  },
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
