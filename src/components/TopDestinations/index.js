import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDestinations } from '../../redux/Slices/destinationsSlice';

const TopDestinations = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [imageErrors, setImageErrors] = useState({});
  const { items: destinations, loading } = useSelector((state) => state.destinations);

  const currentLang = useSelector((state) => state.language.currentLang) || "en";

  useEffect(() => {
    dispatch(fetchDestinations(currentLang));
  }, [dispatch, currentLang]);

  const handleDestinationClick = (destination) => {
    navigate(`/excursions/${destination.route.toLowerCase().replace(/\s+/g, '-')}`, { 
                      state: { DestinationId: destination.destination_id } 
                    });
  };

  const handleImageError = (destinationId) => {
    setImageErrors(prev => ({
      ...prev,
      [destinationId]: true
    }));
  };

  const renderDestinationCard = (destination, index) => (
    <Col
      key={destination.destination_id}
      xs={12}
      sm={6}
      md={4}
      lg={3}
      className={`destination-col ${index >= 4 ? 'second-row' : 'first-row'}`}
    >
      <Card
        className="destination-card"
        onClick={() => handleDestinationClick(destination)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleDestinationClick(destination);
          }
        }}
      >
        <div className="card-image-wrapper">
          {imageErrors[destination.destination_id] ? (
            <div className="destination-fallback">
              <span className="destination-icon">📍</span>
            </div>
          ) : (
            <Card.Img
              variant="top"
              src={destination.img_path || '/images/default-destination.jpg'}
              alt={destination.dest_description}
              className="destination-image"
              onError={() => handleImageError(destination.destination_id)}
              loading="lazy"
            />
          )}
          <div className="card-overlay">
            <Card.Title className="destination-name">
              {destination.dest_name}
            </Card.Title>
          </div>
        </div>
      </Card>
    </Col>
  );

  if (loading) {
    return (
      <section className="top-destinations">
        <Container>
          <div className="section-header">
            <h2 className="section-title">
              {t('wishlist.topCities')}
            </h2>
            <p className="section-subtitle">
              {t('wishlist.topCitiesDescription')}
            </p>
          </div>
          <div className="loading-container">
            <Spinner animation="border" variant="primary" />
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="top-destinations">
      <Container>
        <div className="section-header">
          <h2 className="section-title">
            {t('wishlist.topCities')}
          </h2>
          <p className="section-subtitle">
            {t('wishlist.topCitiesDescription')}
          </p>
        </div>

        <Row className="destinations-grid">
          {destinations.map((destination, index) =>
            renderDestinationCard(destination, index)
          )}
        </Row>
      </Container>
    </section>
  );
};

export default TopDestinations;