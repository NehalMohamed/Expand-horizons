import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const PasswordInput = ({ placeholder, value, onChange, showPassword, onToggleVisibility }) => (
  <div className="password-input-wrapper">
    <Form.Control
      type={showPassword ? 'text' : 'password'}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="password-input"
    />
    <Button
      variant="link"
      className="password-toggle-btn"
      onClick={onToggleVisibility}
    >
      {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
    </Button>
  </div>
);

const PasswordTab = () => {
  const { t } = useTranslation();

  const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });

  const handlePasswordInputChange = (field, value) => {
        setPasswordData(prev => ({ ...prev, [field]: value }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };
  return (
    <div className="password-tab">
      <h3>{t('profile.password.title')}</h3>
      {/* <p className="notification-description mb-4">
        {t('profile.password.description')}
      </p> */}

      <Row>
        <Col md={8}>
          <Form.Group className="mb-3">
            <PasswordInput
              placeholder={t('profile.password.oldPassword')}
              value={passwordData.oldPassword}
              onChange={(value) => handlePasswordInputChange('oldPassword', value)}
              showPassword={showPasswords.old}
              onToggleVisibility={() => togglePasswordVisibility('old')}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <PasswordInput
              placeholder={t('profile.password.newPassword')}
              value={passwordData.newPassword}
              onChange={(value) => handlePasswordInputChange('newPassword', value)}
              showPassword={showPasswords.new}
              onToggleVisibility={() => togglePasswordVisibility('new')}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <PasswordInput
              placeholder={t('profile.password.confirmPassword')}
              value={passwordData.confirmPassword}
              onChange={(value) => handlePasswordInputChange('confirmPassword', value)}
              showPassword={showPasswords.confirm}
              onToggleVisibility={() => togglePasswordVisibility('confirm')}
            />
          </Form.Group>

          <Button className="primaryBtn">
            {t('profile.password.resetPassword')}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default PasswordTab;