import React from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
const NoBookings = () => {
  const navigate = useNavigate(); // React Router hook to navigate between pages
  const { t } = useTranslation(); // Hook for multilingual translations
  return (
    <>
      <Container className="bookingsPageContainer">
        <div className="contentWrapper">
          <img 
          src="/images/booking.png" 
          alt="booking Illustration" 
          className="illustration"
          loading="lazy" 
          decoding="async" 
           />
           <span className="mainTitle">{t("bookings.noBookings")}</span>
           <span className="subTitle">{t("bookings.noBookingsText")}</span>
          <Button onClick={() => navigate("/")} variant="primary" className="goBackButton">
            {t("bookings.BackBtn")}
          </Button>
        </div>
      </Container>    
    </>
  );
};

export default NoBookings;
