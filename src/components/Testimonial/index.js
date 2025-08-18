import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Testimonial = () => {
  const { t } = useTranslation();

  return (
    <section className="testimonial-section">
      <Container>
        <Row className="align-items-left">
          <Col lg={6} md={12} className="title-col">
            <div className="title-content">
              <h2 className="main-title">
                {t('testimonial.title')}
              </h2>
              <div className="title-divider"></div>
              <p className="subtitle">
                {t('testimonial.subtitle')}
              </p>
            </div>
          </Col>
          <Col lg={6} md={12} className="content-col">
            <div className="testimonial-content">
              <p className="content-text">
                {t('testimonial.content1')}
              </p>
              <p className="content-text">
                {t('testimonial.content2')}
              </p>
              <p className="content-text">
                {t('testimonial.content3')}
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Testimonial;
