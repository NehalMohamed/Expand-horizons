// Module overview: DestinationExcursionsPage feature logic and route-level wiring.
import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import SliderSection from "../components/SliderSection";
import ExcursionFilters from "../components/ExcursionFilters";
import DestinationExcursions from "../components/DestinationExcursions";

// Component entry point for DestinationExcursionsPage.
const DestinationExcursionsPage = () => {
   const [filters, setFilters] = useState(null);
   const { destinationTrips: trips, loading } = useSelector((state) => state.trips);

   // Keep filters visible while one is active so the user can undo an empty result.
   const hasActiveFilter =
      !!filters &&
      (filters.minPrice !== "" ||
         filters.maxPrice !== "" ||
         filters.types.length > 0 ||
         filters.destinations.length > 0);
   const showFilters = loading || trips.length > 0 || hasActiveFilter;

   useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);
    
  return (
   <>
      <SliderSection />
      <div hidden={!showFilters}>
         <ExcursionFilters onChange={setFilters} />
      </div>
      <DestinationExcursions filters={filters} />
   </>
  );
};

export default DestinationExcursionsPage;
