import React, { useRef, useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import "./TransferPage.scss";
function TransfersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const currentLang = localStorage.getItem("lang") || "en";
  const { user: stateUser } = useSelector((state) => state.auth); // Get user from auth state

  // Get user from localStorage as fallback
  const localStorageUser = JSON.parse(localStorage.getItem("user")) || null;
  const user = stateUser || localStorageUser;
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Event handler for loaded data.
    const handleLoadedData = () => {
      setIsLoading(false);
      setDuration(video.duration);
      video.play().catch((error) => console.log("Autoplay prevented:", error));
    };

    // Event handler for time update.
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);

      if (progressRef.current && video.duration) {
        const progressPercent = (video.currentTime / video.duration) * 100;
        progressRef.current.style.width = `${progressPercent}%`;
      }
    };

    // Event handler for error.
    const handleError = () => {
      console.error("Video loading error");
      setIsLoading(false);
    };

    // Event handler for can play through.
    const handleCanPlayThrough = () => {
      setIsLoading(false);
    };

    // Reset and reload video when route changes
    const resetVideo = () => {
      setIsLoading(true);
      video.load();
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("error", handleError);
    video.addEventListener("canplaythrough", handleCanPlayThrough);

    // Reset video on route change
    resetVideo();

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("error", handleError);
      video.removeEventListener("canplaythrough", handleCanPlayThrough);

      // Clean up video when component unmounts
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    };
  }, []); // Re-run effect when route changes
  const goToTransferBooking = () => {
    console.log("user ", user);
    if (user && user.accessToken) {
      navigate("/transfers/TransferBooking");
    } else {
      navigate("/signUp");
    }
  };
  return (
    <section className="transfer_section">
      <Container>
        <div className="section-header">
          <h2 className="section-title">{t("Transfer.TransferManagement")}</h2>
          <p>{t("Transfer.TransferSubTitle")}</p>
          <div className="section-divider"></div>
        </div>

        <div className="video_contain">
          {" "}
          <video
            controls
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
          <Button className="secondryBtn bk_btn" onClick={goToTransferBooking}>
            {t("Transfer.bookTransfer")}
          </Button>
        </div>
      </Container>
    </section>
  );
}

export default TransfersPage;
