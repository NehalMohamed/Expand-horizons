// src/redux/Slices/reviewSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getToken, isTokenExpired } from "../../utils/tokenUtils"; // Import utility functions

const BASE_URL = process.env.REACT_APP_CLIENT_API_URL;
const BOOKING_URL = process.env.REACT_APP_BOOKING_API_URL;

// Create axios instance with interceptors
const apiClient = axios.create();

// Request interceptor to add auth token and handle expiration
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.requiresAuth) {
      // Token is expired or missing for an auth-required request
      throw new axios.Cancel('Token expired or missing');
    }
    
    const lang = localStorage.getItem("lang") || "en";
    config.headers["Accept-Language"] = lang;
    config.headers["Content-Type"] = "application/json";
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.message === 'Token expired or missing') {
      // Clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Dispatch event to notify components
      window.dispatchEvent(new CustomEvent('authError', { detail: 'Token expired' }));
    }
    return Promise.reject(error);
  }
);

const getAuthHeaders = () => {
  return { requiresAuth: true }; // Flag to indicate auth is required
};

// Async thunk for fetching reviews
export const fetchClientsReviews = createAsyncThunk(
  "reviews/fetchClientsReviews",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post(
        `${BASE_URL}/GetClientsReviews`,
        params,
        getAuthHeaders()
      );
      return data;
    } catch (e) {
      if (e.message === 'Token expired or missing' || e.response?.status === 401) {
        return rejectWithValue({ 
          message: "Unauthorized - Please login again",
          status: 401 
        });
      }
      return rejectWithValue({ 
        message: e.response?.data?.message || "Fetch reviews failed",
        status: e.response?.status 
      });
    }
  }
);

// Async thunk for submitting a review
export const submitReview = createAsyncThunk(
  "reviews/submitReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      // Check token before making the request
      const token = getToken();
      if (!token) {
        return rejectWithValue({ 
          message: "Unauthorized - Please login again",
          status: 401,
          errors: ["Authentication required"]
        });
      }
      
      const { data } = await apiClient.post(
        `${BOOKING_URL}/SaveReviewForTrip`,
        reviewData,
        getAuthHeaders()
      );
      
      // Check if the response indicates a duplicate submission
      if (data.success === false) {
        return rejectWithValue({
          message: data.msg || data.errors || "Duplicate review submission",
          status: 400,
          errors: [data.errors || "Duplicate data"],
          isDuplicate: true
        });
      }
      
      return data;
    } catch (e) {
      if (e.message === 'Token expired or missing' || e.response?.status === 401) {
        return rejectWithValue({ 
          message: "Unauthorized - Please login again",
          status: 401,
          errors: ["Authentication required"]
        });
      }
      
      // Handle case where server returns error with success: false in response data
      if (e.response?.data?.success === false) {
        return rejectWithValue({
          message: e.response.data.msg || e.response.data.errors || "Duplicate review submission",
          status: e.response.status,
          errors: [e.response.data.errors || "Duplicate data"],
          isDuplicate: true
        });
      }
      
      return rejectWithValue({ 
        message: e.response?.data?.message || "Submit review failed",
        status: e.response?.status,
        errors: e.response?.data?.errors || ["Submission failed"]
      });
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    reviewsByTrip: {},
    loading: false,
    error: null,
    submission: {
      loading: false,
      error: null,
      success: false,
      isDuplicate: false // New flag to track duplicate submissions
    }
  },
  reducers: {
    resetReviewSubmission: (state) => {
      state.submission.loading = false;
      state.submission.error = null;
      state.submission.success = false;
      state.submission.isDuplicate = false;
    },
    clearReviews: (state) => {
      state.reviewsByTrip = {};
      state.loading = false;
      state.error = null;
    },
    clearAuthError: (state) => {
      if (state.error?.status === 401) {
        state.error = null;
      }
      if (state.submission.error?.status === 401) {
        state.submission.error = null;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch reviews
      .addCase(fetchClientsReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientsReviews.fulfilled, (state, action) => {
        state.loading = false;
        const { trip_id } = action.meta.arg;
        state.reviewsByTrip[trip_id] = action.payload;
      })
      .addCase(fetchClientsReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit review
      .addCase(submitReview.pending, (state) => {
        state.submission.loading = true;
        state.submission.error = null;
        state.submission.success = false;
        state.submission.isDuplicate = false;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.submission.loading = false;
        state.submission.error = null;
        state.submission.success = true;
        state.submission.isDuplicate = false;
        
        // Add the new review to the state if possible
        if (action.payload.review) {
          const tripId = action.meta.arg.trip_id;
          if (!state.reviewsByTrip[tripId]) {
            state.reviewsByTrip[tripId] = { reviews: [] };
          }
          state.reviewsByTrip[tripId].reviews.unshift(action.payload.review);
        }
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.submission.loading = false;
        state.submission.error = action.payload;
        state.submission.success = false;
        state.submission.isDuplicate = action.payload?.isDuplicate || false;
      });
  }
});

export const { resetReviewSubmission, clearReviews, clearAuthError } = reviewSlice.actions;
export default reviewSlice.reducer;