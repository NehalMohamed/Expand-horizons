import { configureStore } from "@reduxjs/toolkit";
import toursReducer from "./toursSlice";
import authReducer from "../Slices/AuthSlice";
import languageReducer from '../Slices/languageSlice';
import sliderReducer from '../Slices/sliderSlice';
import destinationReducer from '../Slices/destinationsSlice';
import tripsReducer from "../Slices/tripsSlice";

export const store = configureStore({
  reducer: {
    tours: toursReducer,
    auth: authReducer,
    language: languageReducer,
    slider: sliderReducer,
    destinations:destinationReducer,
    trips:tripsReducer
  },
});
