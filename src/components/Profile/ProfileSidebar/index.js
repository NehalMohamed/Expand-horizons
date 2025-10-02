import React, { useEffect, useState, useRef } from "react";
import { Card, Nav } from "react-bootstrap";
import { FaUser, FaBell, FaLock, FaImage } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import defaultProfileImg from "../../../imgs/profileImg.png";
import {
  uploadProfileImage,
  fetchProfileImage,
} from "../../../redux/Slices/profileSlice";
import { MdOutlineCameraAlt, MdOutlinePayment } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import PopUp from "../../Shared/popup/PopUp";
import LoadingPage from "../../Loader/LoadingPage";
import { FaTimesCircle } from "react-icons/fa";
const ProfileSidebar = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null); // Reference for hidden file input
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("alert");
  const [popupIcon, setPopupIcon] = useState(null);
  // Get state from Redux store
  const { profileImage, loading, error, success, message } = useSelector(
    (state) => state.profile
  );

  useEffect(() => {
    dispatch(fetchProfileImage());
  }, [dispatch]);
  // Handle profile image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match("image.*")) {
      setPopupMessage(t("profile.select_image_file"));
      setPopupType("alert");
      setPopupIcon(<FaTimesCircle className="error-icon" size={24} />);
      setShowPopup(true);
      return;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      setPopupMessage(t("profile.image_size_limit"));
      setPopupType("alert");
      setShowPopup(true);
      return;
    }

    try {
      // Dispatch upload action and wait for completion
      await dispatch(uploadProfileImage(file)).unwrap();
      // Refresh the image from server after successful upload
      dispatch(fetchProfileImage());
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };
  // Trigger file input click when camera icon is clicked
  const handleCameraClick = () => {
    fileInputRef.current.click();
  };
  return (
    <>
      <Card className="profile-card profile-sidebar">
        <Card.Body>
          {/* <div className="profile-avatar"> */}
          <div className="profile-picture">
            <div className="avatar-container">
              <img
                src={
                  profileImage?.url || // Newly uploaded images (local blob)
                  profileImage || // Fetched images (server URL)
                  defaultProfileImg // Fallback
                }
                alt="Profile"
                className="avatar-image"
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop if default image fails
                  e.target.src = defaultProfileImg;
                }}
              />
              {/* Hidden file input for image upload */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: "none" }}
              />
              {/* Camera icon to trigger file input */}
              <div className="camera">
                <MdOutlineCameraAlt
                  className="camera-icon"
                  onClick={handleCameraClick}
                />
              </div>
            </div>
            {/* <div className="avatar-circle">
              <FaImage />
            </div> */}
          </div>

          <Nav className="flex-column profile-nav">
            <Nav.Link
              className={activeTab === "profile" ? "active" : ""}
              onClick={() => setActiveTab("profile")}
            >
              <FaUser /> {t("profile.nav.profile")}
            </Nav.Link>
            <Nav.Link
              className={activeTab === "notifications" ? "active" : ""}
              onClick={() => setActiveTab("notifications")}
            >
              <FaBell /> {t("profile.nav.notifications")}
            </Nav.Link>
            <Nav.Link
              className={activeTab === "password" ? "active" : ""}
              onClick={() => setActiveTab("password")}
            >
              <FaLock /> {t("profile.nav.password")}
            </Nav.Link>
          </Nav>
        </Card.Body>
      </Card>
      {loading && <LoadingPage />}
      {/* Error Popup */}
      {showPopup && (
        <PopUp
          show={showPopup}
          closeAlert={() => setShowPopup(false)}
          msg={popupMessage}
          type={popupType}
          showConfirmButton={true}
        />
      )}
    </>
  );
};

export default ProfileSidebar;
