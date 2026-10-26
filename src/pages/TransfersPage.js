// Module overview: TransfersPage feature logic and route-level wiring.
import React, { useState, useEffect } from 'react';
import SliderSection from "../components/SliderSection";
import ToursSection from "../components/ToursSection";

// Component entry point for TransfersPage.
const TransfersPage = () => {

     useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, []);

  return (
   <>
      <SliderSection />
      <ToursSection tripCategory={2} />
   </>
  );
};

export default TransfersPage;
