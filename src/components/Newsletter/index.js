import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { subscribeNewsletter, resetNewsletter } from '../../redux/Slices/newsletterSlice';
import LoadingPage from '../Loader/LoadingPage';
import PopUp from '../Shared/popup/PopUp';

const Newsletter = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading, success, error, message } = useSelector(state => state.newsletter);
  
  const [formData, setFormData] = useState({
    name: '',
    email: ''
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

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(subscribeNewsletter(formData));
  };

  // Handle popup for success and error states
  useEffect(() => {
    if (success && message) {
      setPopupMessage(message);
      setPopupType('alert');
      setShowPopup(true);
      
      // Reset form on successful submission
      setFormData({ name: '', email: '' });
      
      // Auto reset form state after delay
      setTimeout(() => {
        dispatch(resetNewsletter());
      }, 3000);
    }
    
    if (error) {
      setPopupMessage(typeof error === 'string' ? error : t('newsletter.errorMessage'));
      setPopupType('alert');
      setShowPopup(true);
    }
  }, [success, error, message, t, dispatch]);

  // Show loading page during initial subscription
  if (loading && !success && !error) {
    return <LoadingPage />;
  }

  return (
    <>
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
                        disabled={loading}
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
                        disabled={loading}
                      />
                    </Form.Group>
                    <Button 
                      type="submit" 
                      className="subscribe-btn"
                      disabled={loading}
                    >
                      {loading ? t('newsletter.subscribing') : t('newsletter.subscribeButton')}
                    </Button>
                  </Form>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </section>

      {/* Success/Error Popup */}
      {showPopup && (
        <PopUp
          show={showPopup}
          closeAlert={() => {
            setShowPopup(false);
            if (success || error) {
              dispatch(resetNewsletter());
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

export default Newsletter;