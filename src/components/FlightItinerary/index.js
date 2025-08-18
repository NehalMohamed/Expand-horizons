import { useState, useEffect } from "react";
import { Container, Row, Col, Card } from 'react-bootstrap';
import { IoLocationOutline } from 'react-icons/io5';
import { useTripData } from '../../contexts/TripContext';
import { useSelector, useDispatch } from "react-redux";
import {
    fetchPickupsForTrip
} from "../../redux/Slices/tripsSlice";
import { useTranslation } from "react-i18next";

const FlightItinerary = () => {
    const { t } = useTranslation();
    const tripData = useTripData();
    const tripId = tripData.trip_id;
    const dispatch = useDispatch();
    const { pickupsByTrip, loading, error } = useSelector((state) => state.trips);
    const currentLang = useSelector((state) => state.language.currentLang) || "en";

   console.log(pickupsByTrip)

    useEffect(() => {
        console.log("Dispatching fetchPickupsForTrip");
        const params = {
            trip_id: tripId,
            trip_type: 1,
            lang_code: currentLang
        };
        dispatch(fetchPickupsForTrip(params));
    }, [dispatch, currentLang,tripId]);

    if (!pickupsByTrip || pickupsByTrip.length === 0) return null;

    return (
        <div className="flight-itinerary-section">
            <Container>
                <Row>
                    <Col lg={8} md={10}>
                        <Card className="itinerary-card">
                            <Card.Body >
                                <h2 className="section-title mb-4">{t("tripDetails.itinerary")}</h2>

                                <div className="timeline-container">
                                    {pickupsByTrip.map((pickup, index) => (
                                        <div key={pickup.trip_pickup_id} className="timeline-step">
                                            <div className="timeline-marker-wrapper">
                                                <div className="timeline-marker">
                                                    <IoLocationOutline size={16} />
                                                </div>
                                                {index < pickupsByTrip.length - 1 && (
                                                    <div className="timeline-connector"></div>
                                                )}
                                            </div>

                                            <div className="timeline-content">
                                                <h5 className="step-title mb-1">{pickup.pickup_name}</h5>
                                                <p className="step-description mb-0">{pickup.pickup_description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default FlightItinerary;