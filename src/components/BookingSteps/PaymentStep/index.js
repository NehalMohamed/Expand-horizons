import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { FaPaypal } from 'react-icons/fa';

const PaymentStep = ({ onNext, paymentData, setPaymentData }) => {
  const navigate = useNavigate(); 
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [cardDetails, setCardDetails] = useState({
    country: 'Egypt',
    iban: '',
    swift: '',
    beneficiaryName: ''
  });

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setPaymentData(prev => ({ ...prev, method }));
  };

  const handleCardDetailChange = (field, value) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setPaymentData(prev => ({
      ...prev,
      method: paymentMethod,
      cardDetails: paymentMethod === 'card' ? cardDetails : null
    }));
    // onNext();
    navigate("/");
  };

  return (
    <div className="payment-step">
      <h2 className="payment-title">{t('bookings.payment.title')}</h2>
      
      <div className="payment-methods">
        <div 
          className={`payment-option ${paymentMethod === 'paypal' ? 'selected' : ''}`}
          onClick={() => handlePaymentMethodChange('paypal')}
        >
          <div className="payment-radio">
            <input
              type="radio"
              name="payment-method"
              checked={paymentMethod === 'paypal'}
              onChange={() => handlePaymentMethodChange('paypal')}
            />
            <span className="checkmark"></span>
          </div>
          <div className="payment-info">
            <FaPaypal className="paypal-icon" />
            <span className="payment-text">PayPal</span>
          </div>
        </div>

        <div 
          className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}
          onClick={() => handlePaymentMethodChange('card')}
        >
          <div className="payment-radio">
            <input
              type="radio"
              name="payment-method"
              checked={paymentMethod === 'card'}
              onChange={() => handlePaymentMethodChange('card')}
            />
            <span className="checkmark"></span>
          </div>
          <div className="payment-info">
            <div className="payment-icons">
              <div className="payment-icon mastercard">
                <div className="mc-circle red"></div>
                <div className="mc-circle yellow"></div>
              </div>
              <span className="visa-text">VISA</span>
            </div>
          </div>
        </div>
      </div>

      {paymentMethod === 'card' && (
        <div className="card-form">
          <Form.Group className="form-group">
            <Form.Label className="form-label">{t('bookings.payment.countryOfBank')}</Form.Label>
            <Form.Control
              as="select"
              value={cardDetails.country}
              onChange={(e) => handleCardDetailChange('country', e.target.value)}
              className="form-input"
            >
              <option value="Egypt">{t('bookings.payment.countries.egypt')}</option>
              <option value="United States">{t('bookings.payment.countries.unitedStates')}</option>
              <option value="United Kingdom">{t('bookings.payment.countries.unitedKingdom')}</option>
              <option value="Germany">{t('bookings.payment.countries.germany')}</option>
              <option value="France">{t('bookings.payment.countries.france')}</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label className="form-label">{t('bookings.payment.iban')}</Form.Label>
            <Form.Control
              type="text"
              value={cardDetails.iban}
              onChange={(e) => handleCardDetailChange('iban', e.target.value)}
              className="form-input"
            />
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label className="form-label">{t('bookings.payment.swift')}</Form.Label>
            <Form.Control
              type="text"
              value={cardDetails.swift}
              onChange={(e) => handleCardDetailChange('swift', e.target.value)}
              className="form-input"
            />
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label className="form-label">{t('bookings.payment.beneficiaryName')}</Form.Label>
            <Form.Control
              as="select"
              value={cardDetails.beneficiaryName}
              onChange={(e) => handleCardDetailChange('beneficiaryName', e.target.value)}
              className="form-input"
            >
              <option value="">{t('bookings.payment.selectBeneficiary')}</option>
              <option value="John Doe">John Doe</option>
              <option value="Jane Smith">Jane Smith</option>
            </Form.Control>
          </Form.Group>

          <div className="disclaimer">
            {t('bookings.payment.disclaimer')}
          </div>
        </div>
      )}

      <button
        type="button"
        className={`payment-btn ${paymentMethod === 'paypal' ? 'paypal-btn' : 'card-btn'}`}
        onClick={handleNext}
      >
        {paymentMethod === 'paypal' ? (
          <>
            <span>{t('bookings.payment.checkoutWith')}</span>
            <FaPaypal className="btn-paypal-icon" />
          </>
        ) : (
          <span>{t('bookings.payment.payNow')}</span>
        )}
      </button>
    </div>
  );
};

export default PaymentStep;