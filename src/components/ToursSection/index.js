import { useState, useEffect } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useSelector ,useDispatch} from "react-redux";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import {
  fetchTripsAll
} from "../../redux/Slices/tripsSlice";
import TourCard from "../TourCard";

const ToursSection = () => {
const dispatch = useDispatch();
 const { trips, loading, error } = useSelector((state) => state.trips);
const currentLang = useSelector((state) => state.language.currentLang) || "en";


 useEffect(() => {
   console.log("Dispatching fetchTripsAll"); 
   const params = {
     lang_code: currentLang,
     show_in_slider: true,
     show_in_top: false,
     destination_id: 0,
     currency_code: "USD"
   };
   dispatch(fetchTripsAll(params));
 }, [dispatch, currentLang]);


  const { t } = useTranslation();

  if (loading) {
    return (
      <section className="tours-section">
        <Container>
          <div className="tours-loading">
            <div>
              <Spinner animation="border" role="status" />
              <div className="loading-text">{t('tours.loading')}</div>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  if (trips.length === 0) {
    return (
      <section className="tours-section">
        <Container>
          <div className="tours-empty">
            <FaMapMarkerAlt className="empty-icon" />
            <h3 className="empty-title">{t('tours.empty_title')}</h3>
            <p className="empty-text">{t('tours.empty_text')}</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="tours-section" id="tours">
      <Container>
        <div className="section-header">
          <h2 className="section-title">{t('tours.top_offers')}</h2>
          <div className="section-divider"></div>
        </div>

        <div className="tours-grid">
          <Row>
            {trips.map((trip) => (
              <Col key={trip.trip_id} lg={4} md={6} className="d-flex">
                <TourCard trip={trip} />
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </section>
  );
};

export default ToursSection;
