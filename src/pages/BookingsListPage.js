import React, { useEffect } from 'react';
import BookingSection from '../components/BookingSection';
import CityCarousel from '../components/CityCarousel';

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