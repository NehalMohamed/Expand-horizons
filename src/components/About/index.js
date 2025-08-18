import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <section className="about-section">
      <Container>
        <Row className="align-items-center">
          <Col lg={6} md={6} sm={12} className="logo-col">
            <div className="logo-container">
              <img 
                src="/images/black & blue logo.png" 
                alt="Horizons Company Logo" 
                className="travel-logo"
              />
            </div>
          </Col>
          <Col lg={6} md={6} sm={12} className="content-col">
            <div className="about-content">
              <h2 className="about-title">
                {t('about.title')}
              </h2>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default About;
