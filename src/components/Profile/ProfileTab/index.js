import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, FloatingLabel } from 'react-bootstrap';
import PhoneInput from 'react-phone-number-input';
import { useTranslation } from 'react-i18next';

const ProfileTab = () => {
    const { t } = useTranslation();

    const [profileData, setProfileData] = useState({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            address: '',
            nationality: '',
            gender: '',
            day: '',
            month: '',
            year: ''
        });

    const handleProfileInputChange = (field, value) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="profile-tab">
            <h3>{t('profile.profile.title')}</h3>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder={t('profile.profile.firstName')}
                            value={profileData.firstName}
                            onChange={(e) => handleProfileInputChange('firstName', e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder={t('profile.profile.lastName')}
                            value={profileData.lastName}
                            onChange={(e) => handleProfileInputChange('lastName', e.target.value)}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <h3>{t('profile.profile.contactDetails')}</h3>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="email"
                            placeholder={t('profile.profile.email')}
                            value={profileData.email}
                            onChange={(e) => handleProfileInputChange('email', e.target.value)}
                            className="responsive-input"
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3 phone-input-container">
                        <div className="responsive-phone-input">
                        <PhoneInput
                            international
                            countryCallingCodeEditable={false}
                            defaultCountry="EG"
                            placeholder={t('profile.profile.phone')}
                            value={profileData.phone}
                            onChange={(value) => handleProfileInputChange('phone', value)}
                            className="phone-input-field"
                        />
                        </div>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder={t('profile.profile.address')}
                            value={profileData.address}
                            onChange={(e) => handleProfileInputChange('address', e.target.value)}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder={t('profile.profile.nationality')}
                            value={profileData.nationality}
                            onChange={(e) => handleProfileInputChange('nationality', e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Select
                            value={profileData.gender}
                            onChange={(e) => handleProfileInputChange('gender', e.target.value)}
                        >
                            <option value="">{t('profile.profile.gender')}</option>
                            <option value="male">{t('profile.profile.genderOptions.male')}</option>
                            <option value="female">{t('profile.profile.genderOptions.female')}</option>
                            <option value="other">{t('profile.profile.genderOptions.other')}</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <h3>{t('profile.profile.dateOfBirth')}</h3>

            <Row>
                <Col xs={4} md={4}>
                    <Form.Group className="mb-3">
                        <Form.Select
                            value={profileData.day}
                            onChange={(e) => handleProfileInputChange('day', e.target.value)}
                            className="responsive-select"
                            required
                        >
                            <option value="">{t("profile.profile.day")}</option>
                            {Array.from({ length: 31 }, (_, i) => (
                                <option key={i} value={String(i + 1).padStart(2, "0")}>
                                    {i + 1}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col xs={4} md={4}>
                    <Form.Group className="mb-3">
                        <Form.Select
                            value={profileData.month}
                            onChange={(e) => handleProfileInputChange('month', e.target.value)}
                            className="responsive-select"
                            required
                        >
                            <option value="">{t("profile.profile.month")}</option>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i} value={String(i + 1).padStart(2, "0")}>
                                    {new Date(0, i).toLocaleString(t("locale"), {
                                        month: "short",
                                    })}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col xs={4} md={4}>
                    <Form.Group className="mb-3">
                        <Form.Select
                            value={profileData.year}
                            onChange={(e) => handleProfileInputChange('year', e.target.value)}
                            className="responsive-select"
                            required
                        >
                            <option value="">{t("profile.profile.year")}</option>
                            {Array.from({ length: 100 }, (_, i) => (
                                <option key={i} value={new Date().getFullYear() - i}>
                                    {new Date().getFullYear() - i}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <Button className="primaryBtn mt-4">
                {t('profile.profile.save')}
            </Button>
        </div>
    );
};

export default ProfileTab;