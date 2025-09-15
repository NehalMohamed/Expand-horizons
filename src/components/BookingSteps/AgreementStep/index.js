import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Button } from 'react-bootstrap';
import DivingAgreementEN from './DivingAgreementEN';
import DivingAgreementDE from './DivingAgreementDE';

const AgreementStep = ({ onNext, tripData }) => {
  const { t, i18n } = useTranslation();
  const [agreed, setAgreed] = useState(false);

  const handleAgreementChange = (e) => {
    setAgreed(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (agreed) {
      onNext();
    }
  };

  // Render agreement based on current language
  const renderAgreementText = () => {
    if (i18n.language === 'de') {
      return <DivingAgreementDE />;
    } else {
      return <DivingAgreementEN />;
    }
  };

  return (
    <div className="agreement-step">
      <h2 className="agreement-title">{t('bookings.agreement.title')}</h2>
      
      <div className="agreement-content">
        <div className="agreement-text">
          {renderAgreementText()}
        </div>
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="agreement-checkbox">
            <Form.Check
              type="checkbox"
              id="diving-agreement"
              label={t('bookings.agreement.confirm')}
              checked={agreed}
              onChange={handleAgreementChange}
              className={!agreed ? 'text-danger' : ''}
            />
          </Form.Group>
          
          <Button
            type="submit"
            variant="primary"
            className="agreement-button"
            disabled={!agreed}
          >
            {t('bookings.agreement.continueButton')}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default AgreementStep;