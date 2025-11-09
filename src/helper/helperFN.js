import { jwtDecode } from "jwt-decode";

// const isTokenExpired = (token) => {
//   try {
//     const decoded = jwtDecode(token);
//     return decoded.exp < Date.now() / 1000; //decode.exp ->This is the expiration timestamp from the JWT payload (stored in seconds since Unix epoch)
//   } catch (err) {
//     //Date.now() / 1000 convert from milliseconds to seconds
//     return true;
//   }
// };

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    const clientTime = Date.now() / 1000;
    
    // Add 2-hour grace period for network delays and time sync issues
    const gracePeriod = 2 * 60 * 60; // 2 hours in seconds
    
    return (decoded.exp + gracePeriod) < clientTime;
  } catch (err) {
    return true;
  }
};

const testToken = (token) => {
  const decoded = jwtDecode(token);
  const now = Date.now() / 1000;
  
  console.log('Token expired at:', new Date(decoded.exp * 1000).toString());
  console.log('Current time:', new Date(now * 1000).toString());
  console.log('Minutes since expiration:', (now - decoded.exp) / 60);
  console.log('Should expire?', (now - decoded.exp) > (30 * 60)); // 30 min threshold
};

export const checkAUTH = () => {
  const authToken = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  // Check if user exists and has a valid token
  if (authToken && user && !isTokenExpired(authToken)) {
    return true;
  } else {
    console.log("User not logged in or token expired");
    return false;
  }
};

export const isTokenExpiredOnly = () => {
  const authToken = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  // If user exists but token is expired
  if (authToken && user && isTokenExpired(authToken)) {
    return true;
  }
  return false;
};

export const isUserNotLoggedIn = () => {
  const authToken = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  // If no user data exists at all
  return !authToken && !user;
};

export const checkIsLogin = () => {
  const authToken = localStorage.getItem("token");
  const userLocal = localStorage.getItem("user");
  if (authToken && userLocal) {
    return true;
  } else {
    console.log("there is no login user");
    return false;
  }
};
