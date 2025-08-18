import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TripContext } from '../contexts/TripContext';
import Gallery from "../components/Gallery";
import BookingInfo from "../components/BookingInfo";
import FlightItinerary from "../components/FlightItinerary";
import Reviews from "../components/Reviews";
import TourDetails from "../components/TourDetails";
import CityCarousel from "../components/CityCarousel";

const TripDetailsPage = () => {
  const { state } = useLocation(); // Get tripData passed from navigation
  const tripData = state?.tripData;
  return (
   <TripContext.Provider value={tripData}>
      <Gallery />
      <BookingInfo />
      <FlightItinerary />
      <Reviews />
      <TourDetails />
      <CityCarousel />
   </TripContext.Provider>
  );
};

export default TripDetailsPage;
