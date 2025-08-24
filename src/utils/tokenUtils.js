// src/utils/tokenUtils.js
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // Decode the token payload (middle part between the dots)
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Check if token has expired
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // If we can't decode, assume expired
  }
};

export const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token || isTokenExpired(token)) {
    // Clear expired token
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
  return token;
};

export const getTokenPayload = (token) => {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    return null;
  }
};