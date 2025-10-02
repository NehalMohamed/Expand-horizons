import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  GetClient_Notification_Settings,
  SaveClientNotificationSetting,
} from "../../../redux/Slices/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import PopUp from "../../Shared/popup/PopUp";
import LoadingPage from "../../Loader/LoadingPage";
const CustomToggle = ({ checked, onChange }) => (
  <div
    className={`custom-toggle ${checked ? "checked" : ""}`}
    onClick={onChange}
  >
    <div className="toggle-thumb"></div>
  </div>
);

const NotificationItem = ({ title, description, checked, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className="notification-item">
      <div className="notification-content">
        <h3 className="notification-title">{title}</h3>
        <div className="notification-description">{description}</div>
        <div className="notification-method">
          {t("profile.notifications.email")}
          <CustomToggle checked={checked} onChange={onChange} />
        </div>
      </div>
    </div>
  );
};

const NotificationsTab = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { Notifications, loading, error, success, message } = useSelector(
    (state) => state.profile
  );
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("alert");
  const [notificationSettings, setNotificationSettings] = useState({
    review_reminder: true,
    recommendation_reminder: true,
    deals_reminder: true,
    travel_inspiration: true,
    travel_guide_reminder: true,
    profile_id: 0,
    id: 0,
  });

  useEffect(() => {
    if (Notifications != null && Notifications.length > 0) {
      const row = Notifications[0];
      setNotificationSettings({
        ...notificationSettings,
        review_reminder: row.review_reminder,
        recommendation_reminder: row.recommendation_reminder,
        deals_reminder: row.deals_reminder,
        travel_inspiration: row.travel_inspiration,
        travel_guide_reminder: row.travel_guide_reminder,
        id: row.id,
        profile_id: row.profile_id,
      });
    }
  }, [Notifications]);

  const handleNotificationToggle = (setting) => {
    setNotificationSettings((prev) => ({ ...prev, [setting]: !prev[setting] }));
  };

  useEffect(() => {
    dispatch(GetClient_Notification_Settings());
    return () => {};
  }, [dispatch]);

  const saveData = () => {
    dispatch(SaveClientNotificationSetting(notificationSettings)).then(
      (result) => {
        if (result.payload?.success == false) {
          setPopupMessage(error);
          setPopupType("alert");
          setShowPopup(true);
        } else {
          dispatch(GetClient_Notification_Settings());
        }
      }
    );
  };
  return (
    <div className="notifications-tab">
      <NotificationItem
        title={t("profile.notifications.types.reviews.title")}
        description={t("profile.notifications.types.reviews.description")}
        checked={notificationSettings.review_reminder}
        onChange={() => handleNotificationToggle("review_reminder")}
      />

      <NotificationItem
        title={t("profile.notifications.types.recommendations.title")}
        description={t(
          "profile.notifications.types.recommendations.description"
        )}
        checked={notificationSettings.recommendation_reminder}
        onChange={() => handleNotificationToggle("recommendation_reminder")}
      />

      <NotificationItem
        title={t("profile.notifications.types.deals.title")}
        description={t("profile.notifications.types.deals.description")}
        checked={notificationSettings.deals_reminder}
        onChange={() => handleNotificationToggle("deals_reminder")}
      />

      <NotificationItem
        title={t("profile.notifications.types.inspiration.title")}
        description={t("profile.notifications.types.inspiration.description")}
        checked={notificationSettings.travel_inspiration}
        onChange={() => handleNotificationToggle("travel_inspiration")}
      />

      <NotificationItem
        title={t("profile.notifications.types.guides.title")}
        description={t("profile.notifications.types.guides.description")}
        checked={notificationSettings.travel_guide_reminder}
        onChange={() => handleNotificationToggle("travel_guide_reminder")}
      />

      <div className="disclaimer-text">
        {t("profile.notifications.disclaimer")}
      </div>

      <Button className="primaryBtn mt-4" onClick={saveData}>
        {notificationSettings.id == 0
          ? t("profile.notifications.save")
          : t("profile.notifications.update")}
      </Button>
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
    </div>
  );
};

export default NotificationsTab;
