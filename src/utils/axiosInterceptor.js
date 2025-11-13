import axios from "axios";

const BASE_URL_AUTH = process.env.REACT_APP_AUTH_API_URL;

// Store all your API base URLs
const API_BASE_URLS = {
  auth: process.env.REACT_APP_AUTH_API_URL,
  client: process.env.REACT_APP_CLIENT_API_URL,
  booking: process.env.REACT_APP_BOOKING_API_URL,
  contact: process.env.REACT_APP_CONTACT_API_URL,
};

// Create separate axios instances for each API
export const authApi = axios.create({
  baseURL: API_BASE_URLS.auth,
});

export const clientApi = axios.create({
  baseURL: API_BASE_URLS.client,
});

export const bookingApi = axios.create({
  baseURL: API_BASE_URLS.booking,
});

export const contactApi = axios.create({
  baseURL: API_BASE_URLS.contact,
});

// Store all API instances for easy interceptor application
const apiInstances = [authApi, clientApi, bookingApi, contactApi];

// Common request interceptor
const requestInterceptor = (config) => {
  let lang = localStorage.getItem("lang") || "en";
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.accessToken;

  // Set headers
  config.headers["Accept-Language"] = lang;
  
  if (config.isFormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

// Refresh token logic
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Common response interceptor
const responseInterceptor = async (error) => {
  const originalRequest = error.config;

  // Check if it's a 401 error and we haven't already retried
  if (error.response?.status === 401 && !originalRequest._retry) {
    
    if (isRefreshing) {
      // Queue other 401 requests until refresh completes
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          // Return the request using the original axios instance
          return axios(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const refreshToken = user?.refreshToken;

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      // Call refresh endpoint - use standalone axios for auth calls
      const refreshResponse = await axios.post(
        `${BASE_URL_AUTH}/refresh`,
        {
          refreshToken: refreshToken
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept-Language": localStorage.getItem("lang") || "en"
          }
        }
      );

      if (refreshResponse.data.isSuccessed) {
        const newUserData = refreshResponse.data.user;
        
        // Update localStorage with new tokens
        localStorage.setItem("user", JSON.stringify(newUserData));
        localStorage.setItem("token", newUserData.accessToken);

        const newToken = newUserData.accessToken;

        // Update all axios instances with new token
        apiInstances.forEach(instance => {
          instance.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        });

        // Process queued requests with new token
        processQueue(null, newToken);

        // Update the original request and retry
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalRequest);

      } else {
        throw new Error(refreshResponse.data.message || "Token refresh failed");
      }

    } catch (refreshError) {
      console.error("Token refresh failed:", refreshError);
      
      // Process queued requests with error
      processQueue(refreshError, null);
      
      // Clear storage and redirect to login
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      
      // Use setTimeout to avoid React state updates during render
      setTimeout(() => {
        window.location.href = "/login";
      }, 0);

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  return Promise.reject(error);
};

// Apply interceptors to all API instances
apiInstances.forEach(instance => {
  instance.interceptors.request.use(requestInterceptor);
  instance.interceptors.response.use(
    response => response,
    responseInterceptor
  );
});

// Helper function to check if token refresh is in progress
export const isRefreshingToken = () => isRefreshing;

// Helper function to manually trigger token refresh
export const manualTokenRefresh = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const refreshToken = user?.refreshToken;

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.post(
      `${BASE_URL_AUTH}/refresh`,
      { refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": localStorage.getItem("lang") || "en"
        }
      }
    );

    if (response.data.isSuccessed) {
      const newUserData = response.data.user;
      localStorage.setItem("user", JSON.stringify(newUserData));
      localStorage.setItem("token", newUserData.accessToken);
      
      // Update all instances
      const newToken = newUserData.accessToken;
      apiInstances.forEach(instance => {
        instance.defaults.headers.common.Authorization = `Bearer ${newToken}`;
      });
      
      return newUserData;
    } else {
      throw new Error(response.data.message || "Manual token refresh failed");
    }
  } catch (error) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    throw error;
  }
};

export { authApi, clientApi, bookingApi, contactApi };
export default { authApi, clientApi, bookingApi, contactApi };