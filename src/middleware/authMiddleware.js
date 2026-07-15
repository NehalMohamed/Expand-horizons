import { history } from "../index";
import { createAuthError } from "../utils/authError";
import { showAuthPopup } from "../utils/showAlert";

export const authMiddleware = (store) => (next) => (action) => {
  if (action.type.endsWith('/rejected')) {
    const error = action.payload;
    
    if (error?.isAuthError) {
      showAuthPopup(
       error.message,
       error.scenario || 'expired'      );

      // Clear the error state
      return next({
        ...action,
        payload: null,
        error: null
      });
    }
  }
  
  return next(action);
};