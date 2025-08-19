import { useRef, useEffect, useState } from "react";

const VideoSlider = () => {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    
    const handleLoadedData = () => {
      setIsLoading(false);
      setDuration(video.duration);
      video.play().catch(error => console.log("Autoplay prevented:", error));
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      const progressPercent = (video.currentTime / video.duration) * 100;
      progressRef.current.style.width = `${progressPercent}%`;
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  return (
    <section className="video-slider">
      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar" ref={progressRef}></div>
      </div>

      <div className="video-container">
        {isLoading && <div className="loading-spinner"></div>}
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/IntrooLogo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
};

export default VideoSlider;