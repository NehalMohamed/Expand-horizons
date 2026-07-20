// Module overview: ProfilePage feature logic and route-level wiring.
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import ProfileSidebar from '../components/Profile/ProfileSidebar';
import ProfileTab from '../components/Profile/ProfileTab';
import NotificationsTab from '../components/Profile/NotificationsTab';
import PasswordTab from '../components/Profile/PasswordTab';

// Component entry point for ProfilePage.
const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('profile');

    // Renders tab content output.
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
