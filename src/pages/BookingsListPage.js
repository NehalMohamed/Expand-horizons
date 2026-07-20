// Module overview: BookingsListPage feature logic and route-level wiring.
import React, { useEffect } from 'react';
import BookingSection from '../components/BookingSection';
import CityCarousel from '../components/CityCarousel';

// Component entry point for BookingsListPage.
const BookingsListPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <BookingSection />
      <CityCarousel />
    </>
  );
};

export default BookingsListPage;
