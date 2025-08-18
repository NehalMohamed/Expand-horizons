import { createContext, useContext } from 'react';


export const TripContext = createContext();


export const useTripData = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripData must be used within a TripProvider');
  }
  return context;
};