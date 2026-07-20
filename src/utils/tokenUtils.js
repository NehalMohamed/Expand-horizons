// Module overview: tokenUtils feature logic and route-level wiring.
export const isTokenValid = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    return true;
  } catch {
    return false;
  }
};

// Clear tokens from storage
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get token from storage
export const getToken = () => {
  return localStorage.getItem('token');
};
