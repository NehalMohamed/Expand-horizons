import React from 'react';
import { Card, Nav } from 'react-bootstrap';
import { FaUser, FaBell, FaLock ,FaImage } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const ProfileSidebar = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();

  return (
    <Card className="profile-card profile-sidebar">
      <Card.Body>
        <div className="profile-avatar">
          <div className="avatar-circle">
            <FaImage />
          </div>
        </div>
        
        <Nav className="flex-column profile-nav">
          <Nav.Link
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            <FaUser /> {t('profile.nav.profile')}
          </Nav.Link>
          <Nav.Link
            className={activeTab === 'notifications' ? 'active' : ''}
            onClick={() => setActiveTab('notifications')}
          >
            <FaBell /> {t('profile.nav.notifications')}
          </Nav.Link>
          <Nav.Link
            className={activeTab === 'password' ? 'active' : ''}
            onClick={() => setActiveTab('password')}
          >
            <FaLock /> {t('profile.nav.password')}
          </Nav.Link>
        </Nav>
      </Card.Body>
    </Card>
  );
};

export default ProfileSidebar;