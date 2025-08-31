import React, { useState, useEffect } from 'react';
import SliderSection from "../components/SliderSection";
import ToursSection from "../components/ToursSection";

const HomePage = () => {

   useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

  return (
    <>
      <SliderSection />
      <ToursSection />
    </>
  )
}

export default HomePage;