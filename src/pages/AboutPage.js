import React, { useState, useEffect } from 'react';
import About from "../components/About";
import Features from "../components/Features";
import Testimonial from "../components/Testimonial";
import ContactInfo from "../components/ContactInfo";
import Newsletter from "../components/Newsletter";

const AboutPage = () => {

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <About />
      <Features />
      <Testimonial />
      <ContactInfo />
      <Newsletter />
    </>
  )
}

export default AboutPage;