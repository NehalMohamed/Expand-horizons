import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
    fetchTripsAll
} from "../../redux/Slices/tripsSlice";
import TourCard from "../TourCard";

const DestinationExcursions = () => {
    const { state } = useLocation(); // Get tripData passed from navigation
    const destinationId = state?.DestinationId;
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { trips, loading, error } = useSelector((state) => state.trips);
    const currentLang = useSelector((state) => state.language.currentLang) || "en";


    useEffect(() => {
        console.log("Dispatching fetchTripsAll");
        const params = {
            lang_code: currentLang,
            show_in_slider: false,
            show_in_top: false,
            destination_id: destinationId,
            currency_code: "USD"
        };
        dispatch(fetchTripsAll(params));
    }, [dispatch, currentLang]);

    console.log(destinationId)


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


    return (
        <section className="tours-section">
            <Container>
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

export default DestinationExcursions;