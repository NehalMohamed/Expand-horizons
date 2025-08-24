import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n";
import { Provider } from "react-redux";
import { store } from "./redux/store/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthModalProvider } from "./components/AuthComp/AuthModal";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
      <AuthModalProvider>
        <App />
      </AuthModalProvider>
    </GoogleOAuthProvider>
  </Provider>
);
