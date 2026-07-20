// Module overview: DivingPage feature logic and route-level wiring.
import React, { useState, useEffect } from 'react';
import SliderSection from "../components/SliderSection";
import ToursSection from "../components/ToursSection";

// Component entry point for DivingPage.
const DivingPage = () => {

     useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, []);

  return (
   <>
      <SliderSection />
      <ToursSection tripType={3} />
   </>
  );
};

export default DivingPage;
