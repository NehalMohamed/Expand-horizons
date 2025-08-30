import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { BiSolidCard } from "react-icons/bi";
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
    fetchDestinationTrips
} from "../../redux/Slices/tripsSlice";
import TourCard from "../TourCard";
import LoadingPage from "../Loader/LoadingPage";
import PopUp from "../Shared/popup/PopUp";

const DestinationExcursions = () => {
    const { state } = useLocation(); // Get tripData passed from navigation
    const destinationId = state?.DestinationId;
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const currentLang = useSelector((state) => state.language.currentLang) || "en";
    const { user: stateUser } = useSelector((state) => state.auth); // Get user from auth state
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState('error');
    // Get user from localStorage as fallback
    const localStorageUser = JSON.parse(localStorage.getItem("user") || "null");
    const user = stateUser || localStorageUser;

    useEffect(() => {
        const params = {
            lang_code: currentLang,
            show_in_top: false,
            destination_id: destinationId,
            currency_code: "USD",
            client_id: user?.id || ""
        };
        dispatch(fetchDestinationTrips(params));
    }, [dispatch, currentLang, destinationId]);

    const { destinationTrips: trips, loading, error } = useSelector((state) => state.trips);

    useEffect(() => {
        if (error) {
          setPopupMessage(error);
          setPopupType('error');
          setShowPopup(true);    
        }
      }, [error]);

    return (  
       <>
            {/* Show loading page during data fetching */}
            {loading && <LoadingPage />}

            {/* Show empty state only when not loading and no trips */}
            {!loading && trips.length === 0 && (
                <section className="tours-section">
                    <Container>
                        <div className="tours-empty">
                            <BiSolidCard className="empty-icon" />
                            <h3 className="empty-title">{t('tours.empty_title')}</h3>
                            {/* <p className="empty-text">{t('tours.empty_text')}</p> */}
                        </div>
                    </Container>
                </section>
            )}

            {/* Show tours when available */}
            {!loading && trips.length > 0 && (
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
            )}

            {/* Show popup for error messages */}
            {showPopup && (
                <PopUp
                    show={showPopup}
                    closeAlert={() => setShowPopup(false)}
                    msg={popupMessage}
                    type={popupType}
                    autoClose={false}
                    showConfirmButton={false}
                />
            )}
        </>
    );
};

export default DestinationExcursions;