import React, { useState, useEffect } from 'react';
import SliderSection from "../components/SliderSection";
import DestinationExcursions from "../components/DestinationExcursions";

const DestinationExcursionsPage = () => {

   useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);
    
  return (
   <>
      <SliderSection />
      <DestinationExcursions />
   </>
  );
};

export default DestinationExcursionsPage;
