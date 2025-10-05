import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTripDetails,
  clearTripDetails,
} from "../redux/Slices/tripDetailsSlice";
import Gallery from "../components/Gallery";
import BookingInfo from "../components/BookingInfo";
import BookingSelection from "../components/BookingSelection";
import FlightItinerary from "../components/FlightItinerary";
import Reviews from "../components/Reviews";
import TourDetails from "../components/TourDetails";
import CityCarousel from "../components/CityCarousel";
import LoadingPage from "../components/Loader/LoadingPage";
import PopUp from "../components/Shared/popup/PopUp";

const TripDetailsPage = () => {
  const { route } = useParams();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("error");

  const { tripData, loading, error } = useSelector(
    (state) => state.tripDetails
  );
  const currentLang =
    useSelector((state) => state.language.currentLang) || "en";

  const [user, setUser] = useState({});
  const [tripState, setTripState] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);
  }, []);

    // Store location state in localStorage when component mounts
    useEffect(() => {
      if (state) {
        localStorage.setItem("tripDetailsState", JSON.stringify(state));
        setTripState(state);
      } else {
        // If no state from location, try to get from localStorage
        const savedState = localStorage.getItem("tripDetailsState");
        if (savedState) {
          setTripState(JSON.parse(savedState));
        }
      }
    }, [state]);
  
    // Clean up localStorage when component unmounts
    useEffect(() => {
      return () => {
        localStorage.removeItem("tripDetailsState");
      };
    }, []);
  
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, [tripState]);

  useEffect(() => {
    if (error) {
      setPopupMessage(error);
      setPopupType("error");
      setShowPopup(true);
    }
  }, [error]);

  useEffect(() => {
    fetchTripDetailsData();

    return () => {
      dispatch(clearTripDetails());
    };
  }, [route, currentLang, user.id, tripState]);

  const fetchTripDetailsData = () => {
    if (!tripState) return;

    const params = {
      trip_id: tripState?.tripId, 
      lang_code: currentLang,
      currency_code: "EUR",
      client_id: user?.id || "",
      trip_type: tripState?.trip_type,
    };

    dispatch(fetchTripDetails(params));
  };

  // Function to refresh trip details (call this after wishlist/review actions)
  const refreshTripDetails = () => {
    fetchTripDetailsData();
  };

  return (
    <>
      <Gallery tripData={tripData} refreshTripDetails={refreshTripDetails} />
      <BookingInfo tripData={tripData} />
      <BookingSelection tripData={tripData} />
      <FlightItinerary tripData={tripData} />
      <Reviews tripData={tripData} refreshTripDetails={refreshTripDetails} />
      <TourDetails tripData={tripData} />
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

export default TripDetailsPage;