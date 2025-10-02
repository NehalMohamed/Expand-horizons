import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { submitContactForm, resetContactForm } from '../../redux/Slices/contactSlice';
import LoadingPage from '../Loader/LoadingPage';
import PopUp from '../Shared/popup/PopUp';

const Contact = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { loading, success, error, submitted } = useSelector(state => state.contact);

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState('alert');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePhoneChange = (value) => {
        setFormData(prev => ({
            ...prev,
            phone: value || ''
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(submitContactForm(formData));
    };

    // Handle popup for success and error states
    useEffect(() => {
        if (success) {
            setPopupMessage(t('contact.successMessage'));
            setPopupType('alert');
            setShowPopup(true);

            // Reset form on successful submission
            setFormData({
                full_name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });

            // Auto reset form state after delay
            setTimeout(() => {
                dispatch(resetContactForm());
            }, 3000);
        }

        if (error) {
            setPopupMessage(typeof error === 'string' ? error : t('contact.errorMessage'));
            setPopupType('alert');
            setShowPopup(true);
        }
    }, [success, error, t, dispatch]);

    // Show loading page during initial form submission
    if (loading && !submitted) {
        return <LoadingPage />;
    }

    return (
        <>
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
                                            name="full_name"
                                            className="form-input"
                                            value={formData.full_name}
                                            onChange={handleInputChange}
                                            placeholder={t('contact.namePlaceholder')}
                                            required
                                            disabled={loading}
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
                                            disabled={loading}
                                        />
                                    </Form.Group>

                                    <Form.Group className="form-group">
                                        <div className="phone-input-wrapper">
                                            <PhoneInput
                                                international
                                                defaultCountry="EG"
                                                value={formData.phone}
                                                onChange={handlePhoneChange}
                                                placeholder={t('contact.phonePlaceholder')}
                                                disabled={loading}
                                                className="form-input" 
                                            />
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="form-group">
                                        <Form.Control
                                            type="text"
                                            name="subject"
                                            className="form-input"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            placeholder={t('contact.subjectPlaceholder')}
                                            required
                                            disabled={loading}
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
                                            disabled={loading}
                                        />
                                    </Form.Group>
                                    <div className="end-btn">
                                        <Button
                                            type="submit"
                                            className="submit-btn primaryBtn"
                                            disabled={loading}
                                        >
                                            {loading ? t('contact.sending') : t('contact.sendButton')}
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Success/Error Popup */}
            {showPopup && (
                <PopUp
                    show={showPopup}
                    closeAlert={() => {
                        setShowPopup(false);
                        if (success || error) {
                            dispatch(resetContactForm());
                        }
                    }}
                    msg={popupMessage}
                    type={popupType}
                    autoClose={true}
                    autoCloseTime={5000}
                    showConfirmButton={true}
                />
            )}
        </>
    );
};

export default Contact;