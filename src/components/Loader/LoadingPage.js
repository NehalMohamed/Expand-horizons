// Module overview: LoadingPage component and its UI interaction logic.
import React from "react";
import "./LoadingPage.scss";

// Component: renders loading page UI and related interactions.
const LoadingPage = () => {
  return (
    <div className="loading-page">
      <div className="loading-content">
        {/* Loading GIF to indicate loading progress */}
        <img
          src="/images/loading.gif"
          alt="Loading..."
          className="loading-gif"
          loading="lazy" 
          decoding="async" 
        />
        {/* Optional text shown under the loading animation */}
        <p className="loading-text">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingPage;
