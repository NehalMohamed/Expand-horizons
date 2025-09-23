import React from 'react';
import { Container } from 'react-bootstrap';
import { useTranslation } from "react-i18next";

const TripSoonSection = ({ tripData }) => {
  const { t } = useTranslation();

  return (
    <div className="trip-info-section">
      <Container>
        {/* Trip Name - Gallery Style */}
        <div className="trip-info-header">
          <h1 className="trip-info-title">
            {tripData?.trip_name }
          </h1>
        </div>

        {/* Trip Description - BookingInfo Style (Before Image) */}
        <div className="trip-info-content">
          <p className="trip-description">
            {tripData?.trip_description}
          </p>
        </div>

        {/* Coming Soon Image */}
        <div className="coming-soon-image-container">
          <div className="coming-soon-image">
            <img 
              src="/images/coming.png" 
              alt={t("tripDetails.comingSoonAlt")}
              width={480}
              height={480}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TripSoonSection;