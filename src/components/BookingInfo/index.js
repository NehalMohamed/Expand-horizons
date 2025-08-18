import React from 'react';
import { IoCalendarOutline, IoCashOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';
import { Container } from 'react-bootstrap';
import { useTripData } from '../../contexts/TripContext';
import { useTranslation } from "react-i18next";

const BookingInfo = () => {
    const { t } = useTranslation();
    const tripData = useTripData();

  return (
    <div className="booking-info-section">
      <Container>
        <div className="booking-info-content">
          <p className="intro-text">
           {tripData.trip_description}
          </p>
          
          <h2 className="section-title">{t("tripDetails.aboutTrip")}</h2>
          
          <div className="info-items">
            <div className="info-item">
              <div className="info-icon">
                <IoCalendarOutline size={24} />
              </div>
              <div className="info-content">
                <p className="info-text">
                  {t("tripDetails.bookNowPayLater")}
                </p>
                <p className="info-subtext">{t("tripDetails.duration")}</p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">
                <IoCashOutline size={24} />
              </div>
              <div className="info-content">
                <p className="info-text">
                 {t("tripDetails.paymentMethods")}
                </p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="info-icon">
                <IoCheckmarkCircleOutline size={24} />
              </div>
              <div className="info-content">
                <p className="info-text">
                 {t("tripDetails.paymentNote")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BookingInfo;