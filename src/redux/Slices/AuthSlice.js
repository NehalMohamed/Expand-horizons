import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL_AUTH = process.env.REACT_APP_AUTH_API_URL;

const NonAuthHeaders = () => {
  let lang = localStorage.getItem("lang");
  return {
    "Accept-Language": lang,
  };
};

const token = localStorage.getItem("token");

const initialState = {
  user: null,
  token: token || null,
  loading: false,
  error: null,
  success: null,
  message: null,
};

// Helper to extract error message from different response formats
const getErrorMessage = (error) => {
  console.log("error.response?.data ", error.response?.data);
  if (error.response?.data?.success === false) {
    return error.response.data.errors || "Operation failed";
  }
  if (error.response?.data?.errors) {
    return error.response.data.errors;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return "An error occurred";
};

//verify email
export const ConfirmOTP = createAsyncThunk(
  "ConfirmOTP",
  async (payload, thunkAPI) => {
    try {
      const response = await axios.post(BASE_URL_AUTH + "/ConfirmOTP", payload);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

///normal register && gmail Register (different on API path & payload)
export const RegisterUser = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        BASE_URL_AUTH + data.path, 
        data.payload, 
        { headers: NonAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

//normal login & gmail Login (different on API path & payload)
export const LoginUser = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        BASE_URL_AUTH + data.path, 
        data.payload, 
        { headers: NonAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.success = null;
      state.message = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Handle pending state for all async actions
    builder
      .addCase(RegisterUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.message = null;
      })
      .addCase(LoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.message = null;
      })
      .addCase(ConfirmOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.message = null;
      });

    // Handle fulfilled state for each action
    builder
      .addCase(RegisterUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.isSuccessed;
        state.message = action.payload?.message;
        
        if (action.payload.isSuccessed) {
          state.user = action.payload?.user;
          state.token = action.payload?.user?.accessToken;
          localStorage.setItem("token", action.payload?.user?.accessToken);
          localStorage.setItem("user", JSON.stringify(action.payload?.user));
        } else {
          state.error = action.payload?.message || "Registration failed";
        }
      })
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.isSuccessed;
        state.message = action.payload?.message;
        
        if (action.payload.isSuccessed) {
          state.user = action.payload?.user;
          state.token = action.payload?.user?.accessToken;
          localStorage.setItem("token", action.payload?.user?.accessToken);
          localStorage.setItem("user", JSON.stringify(action.payload?.user));
        } else {
          state.error = action.payload?.message || "Login failed";
        }
      })
      .addCase(ConfirmOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.isSuccessed;
        state.message = action.payload?.message;
        
        if (action.payload.isSuccessed) {
          state.user = action.payload?.user;
          state.token = action.payload?.user?.accessToken;
          localStorage.setItem("token", action.payload?.user?.accessToken);
          localStorage.setItem("user", JSON.stringify(action.payload?.user));
        } else {
          state.error = action.payload?.message || "OTP verification failed";
        }
      });

    // Handle rejected state for all async actions
    builder
      .addCase(RegisterUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.message = action.payload;
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.message = action.payload;
      })
      .addCase(ConfirmOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.message = action.payload;
      });
  },
});

export const { logout, clearAuthState } = authSlice.actions;
export default authSlice.reducer;