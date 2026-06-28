import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n";
import { Provider } from "react-redux";
import { store } from "./redux/store/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthModalProvider } from "./components/AuthComp/AuthModal";
import App from "./App";
import { initCompanyCurrency } from "./utils/companyCurrency";

var createHistory = require("history").createBrowserHistory;
export const history = createHistory();
const root = ReactDOM.createRoot(document.getElementById("root"));

const renderApp = () => {
  root.render(
    <Provider store={store}>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
        <AuthModalProvider>
          <App />
        </AuthModalProvider>
      </GoogleOAuthProvider>
    </Provider>
  );
};

initCompanyCurrency().finally(renderApp);
