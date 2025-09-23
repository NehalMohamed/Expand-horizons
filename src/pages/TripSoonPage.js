import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTripDetails, clearTripDetails } from '../redux/Slices/tripDetailsSlice';
import TripSoonSection from "../components/TripSoonSection";
import CityCarousel from "../components/CityCarousel";
import LoadingPage from "../components/Loader/LoadingPage";
import PopUp from "../components/Shared/popup/PopUp";

const TripSoonPage = () => {
  const { route } = useParams();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('error');

  const { tripData, loading, error } = useSelector((state) => state.tripDetails);
  const currentLang = useSelector((state) => state.language.currentLang) || "en";

  const [user, setUser] = useState({});

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (error) {
      setPopupMessage(error);
      setPopupType('error');
      setShowPopup(true);

    }
  }, [error]);

  useEffect(() => {

    fetchTripDetailsData();

    return () => {
      dispatch(clearTripDetails());
    };
  }, [route, currentLang, user.id]);

  const fetchTripDetailsData = () => {
    const params = {
      trip_id: state?.tripId, // You'll need to implement this function
      lang_code: currentLang,
      currency_code: "EUR",
      client_id: user?.id || "",
      trip_type: state?.trip_type
    };

    dispatch(fetchTripDetails(params));
  };

  // Function to refresh trip details (call this after wishlist/review actions)
  const refreshTripDetails = () => {
    fetchTripDetailsData();
  };

  return (
    <>
      <TripSoonSection tripData={tripData} />
      <CityCarousel />

      {/* Show loading page during wishlist operation */}
      {loading && <LoadingPage />}

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

export default TripSoonPage;