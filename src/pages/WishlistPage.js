// Module overview: WishlistPage feature logic and route-level wiring.
import React, { useState, useEffect } from 'react';
import WishlistSection from "../components/WishlistSection";
import CityCarousel from "../components/CityCarousel";
// Component entry point for WishlistPage.
const WishlistPage = () => {

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <WishlistSection />
      <CityCarousel />

    </>
  );
};

export default WishlistPage;
