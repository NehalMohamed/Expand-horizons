import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import ProfileSidebar from '../components/Profile/ProfileSidebar';
import ProfileTab from '../components/Profile/ProfileTab';
import NotificationsTab from '../components/Profile/NotificationsTab';
import PasswordTab from '../components/Profile/PasswordTab';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <ProfileTab />
                );
            case 'notifications':
                return (
                    <NotificationsTab />
                );
            case 'password':
                return (
                    <PasswordTab />
                );
            default:
                return null;
        }
    };

    return (
        <div className="profile-page">
            <Container>
                <Row>
                    <Col lg={3} md={4}>
                        <ProfileSidebar
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    </Col>

                    <Col lg={9} md={8}>
                        <Card className="profile-card">
                            <Card.Body className="profile-content">
                                {renderTabContent()}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ProfilePage;