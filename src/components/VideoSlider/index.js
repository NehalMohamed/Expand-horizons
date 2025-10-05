import { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // If using React Router

const VideoSlider = () => {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const location = useLocation(); // Track route changes

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoading(false);
      setDuration(video.duration);
      video.play().catch(error => console.log("Autoplay prevented:", error));
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      
      if (progressRef.current && video.duration) {
        const progressPercent = (video.currentTime / video.duration) * 100;
        progressRef.current.style.width = `${progressPercent}%`;
      }
    };

    const handleError = () => {
      console.error("Video loading error");
      setIsLoading(false);
    };

    const handleCanPlayThrough = () => {
      setIsLoading(false);
    };

    // Reset and reload video when route changes
    const resetVideo = () => {
      setIsLoading(true);
      video.load();
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('error', handleError);
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    
    // Reset video on route change
    resetVideo();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      
      // Clean up video when component unmounts
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    };
  }, [location.pathname]); // Re-run effect when route changes

  return (
    <section className="video-slider">
      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar" ref={progressRef}></div>
      </div>

      <div className="video-container">
        {isLoading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="auto"
          className="video-element"
        >
          <source src="/IntrooLogo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
};

export default VideoSlider;