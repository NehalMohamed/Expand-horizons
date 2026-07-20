// Module overview: ContactPage feature logic and route-level wiring.
import React, { useState, useEffect } from 'react';
import Contact from "../components/Contact";
import ContactMap from "../components/ContactMap";
import Testimonial from "../components/Testimonial";
import ContactInfo from "../components/ContactInfo";
import Newsletter from "../components/Newsletter";

// Component entry point for ContactPage.
const ContactPage = () => {

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <Contact />
      <ContactMap />
      <Testimonial />
      <ContactInfo />
      <Newsletter />
    </>
  )
}

export default ContactPage;
