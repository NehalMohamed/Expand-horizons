// Module overview: helperFN feature logic and route-level wiring.
import { jwtDecode } from "jwt-decode";

// Helper for is token expired.
const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp < Date.now() / 1000; //decode.exp ->This is the expiration timestamp from the JWT payload (stored in seconds since Unix epoch)
  } catch (err) {
    return true;
  }
};

// Checks auth conditions for control flow.
export const checkAUTH = () => {
  const authToken = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (authToken && user && !isTokenExpired(authToken)) {
    return true;
  } else {
    console.log("User not logged in or token expired");
    return false;
  }
};

// Helper for is token expired only.
export const isTokenExpiredOnly = () => {
  const authToken = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  // If user exists but token is expired
  if (authToken && user && isTokenExpired(authToken)) {
    return true;
  }
  return false;
};

// Helper for is user not logged in.
export const isUserNotLoggedIn = () => {
  const authToken = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  // If no user data exists at all
  return !authToken && !user;
};

// Checks is login conditions for control flow.
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
