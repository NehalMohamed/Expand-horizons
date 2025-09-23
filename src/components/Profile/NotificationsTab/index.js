import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const CustomToggle = ({ checked, onChange }) => (
  <div className={`custom-toggle ${checked ? 'checked' : ''}`} onClick={onChange}>
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
            {t('profile.notifications.email')}
            <CustomToggle checked={checked} onChange={onChange} />
        </div>
      </div>
      
    </div>
  );
};

const NotificationsTab = () => {
  const { t } = useTranslation();


  const [notificationSettings, setNotificationSettings] = useState({
        reviews: true,
        recommendations: true,
        deals: true,
        inspiration: true,
        guides: true
    });


    const handleNotificationToggle = (setting) => {
        setNotificationSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
    };

  return (
    <div className="notifications-tab">
      <NotificationItem
        title={t('profile.notifications.types.reviews.title')}
        description={t('profile.notifications.types.reviews.description')}
        checked={notificationSettings.reviews}
        onChange={() => handleNotificationToggle('reviews')}
      />

      <NotificationItem
        title={t('profile.notifications.types.recommendations.title')}
        description={t('profile.notifications.types.recommendations.description')}
        checked={notificationSettings.recommendations}
        onChange={() => handleNotificationToggle('recommendations')}
      />

      <NotificationItem
        title={t('profile.notifications.types.deals.title')}
        description={t('profile.notifications.types.deals.description')}
        checked={notificationSettings.deals}
        onChange={() => handleNotificationToggle('deals')}
      />

      <NotificationItem
        title={t('profile.notifications.types.inspiration.title')}
        description={t('profile.notifications.types.inspiration.description')}
        checked={notificationSettings.inspiration}
        onChange={() => handleNotificationToggle('inspiration')}
      />

      <NotificationItem
        title={t('profile.notifications.types.guides.title')}
        description={t('profile.notifications.types.guides.description')}
        checked={notificationSettings.guides}
        onChange={() => handleNotificationToggle('guides')}
      />

      <div className="disclaimer-text">
        {t('profile.notifications.disclaimer')}
      </div>

      <Button className="primaryBtn mt-4">
        {t('profile.notifications.save')}
      </Button>
    </div>
  );
};

export default NotificationsTab;