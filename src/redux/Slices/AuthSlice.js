import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
//   checkAUTH,
//   isUserNotLoggedIn,
//   isTokenExpiredOnly,
import { createAuthError } from "../../utils/authError";
import api from "../../api/axios";

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
  isGoogleAcc: false,
  googleEmail: null,
};

// Helper to extract error message from different response formats
const getErrorMessage = (error) => {
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

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (
    { userId, oldPassword, newPassword, confirmNewPassword },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        BASE_URL_AUTH + "/changePassword",
        {
          userId,
          oldPassword,
          newPassword,
          confirmNewPassword,
        }
      );
      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        // ✅ controlled reject
        return rejectWithValue(err.response.data);
      }
      // fallback
      return rejectWithValue(err.message);
    }
  }
);

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
      if (error.response?.data?.isGoogleAcc === true) {
        // Return the error data with the flag so we can handle it
        return thunkAPI.rejectWithValue(error.response.data);
      }
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
      state.isGoogleAcc = false;
       state.googleEmail = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
      state.message = null;
      state.isGoogleAcc = false;
       state.googleEmail = null;
    },
     clearGoogleAccFlag: (state) => {
      state.isGoogleAcc = false;
      state.googleEmail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(RegisterUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.message = null;
        state.isGoogleAcc = false;
      })
      .addCase(LoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.message = null;
        state.isGoogleAcc = false;
      })
      .addCase(ConfirmOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.message = null;
        state.isGoogleAcc = false;
      });

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

    builder
      .addCase(RegisterUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.message = action.payload;
        state.isGoogleAcc = false;
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        
         if (action.payload && action.payload.isGoogleAcc === true) {
          state.isGoogleAcc = true;
          state.message = action.payload.message;
          state.googleEmail = action.payload.email || null;
          state.error = null;
        } else {
          state.isGoogleAcc = false;
          state.error = action.payload;
          state.message = action.payload;
        }
     
      })
      .addCase(ConfirmOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.message = action.payload;
        state.isGoogleAcc = false;
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.message = null;
      })
      // Password change successful
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload?.isSuccessed;
        state.message = action.payload?.message;
        if (action.payload.isSuccessed) {
          state.user = action.payload?.user;
          state.token = action.payload?.user?.accessToken;
        } else {
          state.error = action.payload?.message || "OTP verification failed";
        }
      })
      // Password change failed
      .addCase(changePassword.rejected, (state, action) => {

        state.loading = false;
        state.success = false;
        state.error = action?.payload;
        state.message = action?.payload;
      });
  },
});

export const { logout, clearAuthState, clearGoogleAccFlag } = authSlice.actions;
export default authSlice.reducer;
