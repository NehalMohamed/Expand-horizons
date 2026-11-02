// Module overview: ToursSection component and its UI interaction logic.
import { useState, useEffect } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { BiSolidCard } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { fetchToursSectionTrips, fetchTopTrips } from "../../redux/Slices/tripsSlice";
import { resetWishlistOperation } from "../../redux/Slices/wishlistSlice";
import LoadingPage from "../Loader/LoadingPage";
import PopUp from "../Shared/popup/PopUp";
import TourCard from "../TourCard";
import { getCompanyCurrencyCode } from "../../utils/companyCurrency";

// Component: renders tours section UI and related interactions.
const ToursSection = (props) => {
  const dispatch = useDispatch();
  const tripCategory = props.tripCategory || 0;
  const { toursSectionTrips: trips, loading, error } = useSelector((state) => state.trips);
  const { operation } = useSelector((state) => state.wishlist);
  const currentLang = localStorage.getItem("lang") || "en";
  const { user: stateUser } = useSelector((state) => state.auth); // Get user from auth state
  
  // Get user from localStorage as fallback
  const localStorageUser = JSON.parse(localStorage.getItem("user") || "null");
  const user = stateUser || localStorageUser;

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('alert');
  const { t } = useTranslation();

  const filters = props.filters;

  useEffect(() => {
    const params = {
      lang_code: currentLang,
      show_in_top: true,
      currency_code: getCompanyCurrencyCode(),
      client_id: user?.id || "",
      trip_category: tripCategory,
      trip_type: 0,
      min_price: Number(filters?.minPrice) || 0,
      max_price: Number(filters?.maxPrice) || 0,
      trip_types: filters?.types || [],
      destination_lst: filters?.destinations || [],
    };
    dispatch(props.useTopTrips ? fetchTopTrips(params) : fetchToursSectionTrips(params));
  }, [dispatch, currentLang, refreshTrigger, tripCategory, filters, props.useTopTrips]);

  useEffect(() => {
    if (operation.success) {
      // Refetch trips after successful wishlist operation
      setRefreshTrigger(prev => prev + 1);
      dispatch(resetWishlistOperation());
    }
  }, [operation.success, dispatch]);

  useEffect(() => {
    // Handle errors in the parent component only
    if (operation.error) {
      setPopupMessage(operation.error);
      setPopupType('alert');
      setShowPopup(true);

      // Reset operation error after showing
      setTimeout(() => {
        dispatch(resetWishlistOperation());
      }, 100);
    }
  }, [operation.error, dispatch]);

  const { filtersSlot, showFilters } = props;
  const isEmpty = !loading && trips.length === 0;

  // Without a filters slot, keep the original full-page loading and empty states.
  if (!filtersSlot && loading) {
    return <LoadingPage />;
  }

  if (!filtersSlot && isEmpty) {
    return (
      <section className="tours-section">
        <Container>
          <div className="tours-empty">
            <BiSolidCard className="empty-icon" />
            <h3 className="empty-title">{t('tours.empty_title')}</h3>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <>
      <section className="tours-section" id="tours">
        <Container>
          {(!isEmpty || showFilters) && (
            <div className="section-header">
              <h2 className="section-title">{t('tours.top_offers')}</h2>
              <div className="section-divider"></div>
            </div>
          )}

          {/* Stays mounted during loading so the filter state is kept */}
          {filtersSlot}

          {loading && <LoadingPage />}

          {isEmpty && (
            <div className="tours-empty">
              <BiSolidCard className="empty-icon" />
              <h3 className="empty-title">{t('tours.empty_title')}</h3>
            </div>
          )}

          {!loading && !isEmpty && (
            <div className="tours-grid">
              <Row>
                {trips.map((trip) => (
                  <Col key={trip.trip_id} lg={4} md={6} className="d-flex">
                    <TourCard trip={trip} />
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Container>
      </section>

      {/* Single popup in the parent component */}
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

export default ToursSection;
