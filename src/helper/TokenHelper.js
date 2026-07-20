// Module overview: TokenHelper feature logic and route-level wiring.
let inMemoryToken = null;

export const getAccessToken = () =>
  inMemoryToken || localStorage.getItem("accessToken");
// Helper for set access token.
export const setAccessToken = (token) => {
  inMemoryToken = token;
  localStorage.setItem("accessToken", token);
};
// Helper for clear access token.
export const clearAccessToken = () => {
  inMemoryToken = null;
  localStorage.removeItem("accessToken");
};
