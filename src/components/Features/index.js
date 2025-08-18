import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Features = () => {
    const { t } = useTranslation();

    const featuresData = [
        {
            id: 1,
            icon: 'images/deadline.png',
            title: t('features.punctual.title'),
            features: [
                t('features.punctual.feature1'),
                t('features.punctual.feature2'),
                t('features.punctual.feature3')
            ]
        },
        {
            id: 2,
            icon: 'images/check.png',
            title: t('features.safe.title'),
            features: [
                t('features.safe.feature1'),
                t('features.safe.feature2'),
                t('features.safe.feature3')
            ]
        },
        {
            id: 3,
            icon: 'images/handshake.png',
            title: t('features.trustworthy.title'),
            features: [
                t('features.trustworthy.feature1'),
                t('features.trustworthy.feature2'),
                t('features.trustworthy.feature3')
            ]
        },
        {
            id: 4,
            icon: 'images/award.png',
            title: t('features.highQuality.title'),
            features: [
                t('features.highQuality.feature1'),
                t('features.highQuality.feature2'),
                t('features.highQuality.feature3')
            ]
        }
    ];

    return (
        <section className="features-section">
            <Container>
                <Row className="g-4">
                    {featuresData.map((feature) => (
                        <Col lg={3} md={6} sm={12} key={feature.id}>
                            <Card className="feature-card h-100">
                                <Card.Body className="text-center">
                                    <div className="feature-icon">
                                        <img
                                            src={feature.icon || "/placeholder.svg"}
                                            alt="logo alt"
                                        />
                                    </div>
                                    <h4 className="feature-title">{feature.title}</h4>
                                    <div className="feature-divider"></div>
                                    <ul className="feature-list">
                                        {feature.features.map((item, index) => (
                                            <li key={index} className="feature-item">
                                                <span className="check-icon">✓</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </section>
    );
};

export default Features;
