import React from "react";
import "./LoadingPage.scss";

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
