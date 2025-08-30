import { configureStore } from "@reduxjs/toolkit";
import toursReducer from "./toursSlice";
import authReducer from "../Slices/AuthSlice";
import languageReducer from '../Slices/languageSlice';
import sliderReducer from '../Slices/sliderSlice';
import destinationReducer from '../Slices/destinationsSlice';
import tripsReducer from "../Slices/tripsSlice";
import reviewReducer from '../Slices/reviewSlice';
import wishListReducer from '../Slices/wishlistSlice';
import tripDetailsReducer from "../Slices/tripDetailsSlice";
import { authMiddleware } from '../../middleware/authMiddleware';

export const store = configureStore({
  reducer: {
    tours: toursReducer,
    auth: authReducer,
    language: languageReducer,
    slider: sliderReducer,
    destinations:destinationReducer,
    trips:tripsReducer,
    reviews: reviewReducer,
    wishlist: wishListReducer,
    tripDetails: tripDetailsReducer
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(authMiddleware),
});
