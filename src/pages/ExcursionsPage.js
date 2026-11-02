// Module overview: ExcursionsPage feature logic and route-level wiring.
import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import SliderSection from "../components/SliderSection";
import TopDestinations from "../components/TopDestinations";
import ToursSection from "../components/ToursSection";
import CityCarousel from "../components/CityCarousel";
import ExcursionFilters from "../components/ExcursionFilters";

// Component entry point for ExcursionsPage.
const ExcursionsPage = () => {
   const [filters, setFilters] = useState(null);
   const { toursSectionTrips: trips, loading } = useSelector((state) => state.trips);

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
      <TopDestinations />
      <ToursSection
         filters={filters}
         showFilters={showFilters}
         filtersSlot={
            <div hidden={!showFilters}>
               <ExcursionFilters onChange={setFilters} />
            </div>
         }
      />
      <CityCarousel />
   </>
  );
};

export default ExcursionsPage;
