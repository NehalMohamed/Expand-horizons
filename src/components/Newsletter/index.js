import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Newsletter = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Newsletter subscription:', formData);
    // You can add your subscription logic here
    alert(t('newsletter.successMessage'));
    setFormData({ name: '', email: '' });
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-overlay">
        <Container>
          <Row className="align-items-center min-vh-100">
            <Col lg={6} md={12} className="content-col">
              <div className="newsletter-content">
                <h6 className="newsletter-label">{t('newsletter.label')}</h6>
                <div className="title-divider"></div>
                <h2 className="newsletter-title">{t('newsletter.title')}</h2>
                <p className="newsletter-description">
                  {t('newsletter.description')}
                </p>
              </div>
            </Col>
            <Col lg={6} md={12} className="form-col">
              <div className="newsletter-form-wrapper">
                <Form onSubmit={handleSubmit} className="newsletter-form">
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder={t('newsletter.namePlaceholder')}
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder={t('newsletter.emailPlaceholder')}
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </Form.Group>
                  <Button type="submit" className="subscribe-btn">
                    {t('newsletter.subscribeButton')}
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </section>
  );
};

export default Newsletter;
