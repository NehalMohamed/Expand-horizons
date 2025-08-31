import React, { useState, useEffect } from 'react';
import WishlistSection from "../components/WishlistSection";
import CityCarousel from "../components/CityCarousel";
const WishlistPage = () => {

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      {/* <SliderSection /> */}
      <WishlistSection />
      <CityCarousel />

    </>
  );
};

export default WishlistPage;
