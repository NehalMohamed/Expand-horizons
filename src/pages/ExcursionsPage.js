import React, { useState, useEffect } from 'react';
import SliderSection from "../components/SliderSection";
import TopDestinations from "../components/TopDestinations";
import ToursSection from "../components/ToursSection";
import CityCarousel from "../components/CityCarousel";

const ExcursionsPage = () => {

   useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

  return (
   <>
      <SliderSection />
      <TopDestinations />
      <ToursSection />
      <CityCarousel />
   </>
  );
};

export default ExcursionsPage;
