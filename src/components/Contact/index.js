import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Contact = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
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
        console.log('Form submitted:', formData);
        // You can add your form submission logic here
        alert(t('contact.successMessage'));
    };

    return (
        <section className="contact-section">
            <Container>
                <Row className="contact-row">
                    {/* Content Column */}
                    <Col lg={6} className="contact-content-col">
                        <h1 className="contact-title">{t('contact.title')}</h1>
                        <div className="title-divider"></div>

                        <p className="contact-description">
                            {t('contact.description')}
                        </p>

                        <p className="contact-sub-text">
                            {t('contact.subText')}
                        </p>
                    </Col>

                    {/* Form Column */}
                    <Col lg={6} className="contact-form-col">
                        <div className="contact-form">
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="form-group">
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder={t('contact.namePlaceholder')}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="form-group">
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        className="form-input"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder={t('contact.emailPlaceholder')}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="form-group">
                                    <Form.Control
                                        type="tel"
                                        name="phone"
                                        className="form-input"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder={t('contact.phonePlaceholder')}
                                    />
                                </Form.Group>

                                <Form.Group className="form-group">
                                    <Form.Control
                                        as="textarea"
                                        name="message"
                                        className="form-input form-textarea"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        placeholder={t('contact.messagePlaceholder')}
                                        rows={5}
                                        required
                                    />
                                </Form.Group>
                                <div className="end-btn">
                                    <Button
                                        type="submit"
                                        className="submit-btn primaryBtn"
                                    >
                                        {t('contact.sendButton')}
                                    </Button>
                                </div>

                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Contact;
