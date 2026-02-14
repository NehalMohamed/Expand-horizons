import React, { useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import MinimalLayout from "./layouts/MinimalLayout";
import NotFound from "./components/NotFound";
import NoResults from "./components/NoResults";
import ComingSoon from "./components/ComingSoon";
import LoadingPage from "./components/Loader/LoadingPage";
import OTPInput from "./components/AuthComp/OTP/OTPInput";
import AuthComp from "./components/AuthComp/AuthComp";
import { useAuthModal } from "./components/AuthComp/AuthModal";
import { setAuthModalFunction } from "./utils/showAlert";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-popup-alert/dist/index.css";
import "react-datepicker/dist/react-datepicker.css";
import "leaflet/dist/leaflet.css";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-phone-number-input/style.css";
import "./styles/main.scss";
import "./leafletIconsFix";


// Lazy load all page components
const Home = lazy(() => import("./pages/HomePage"));
const Wishlist = lazy(() => import("./pages/WishlistPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const Excursions = lazy(() => import("./pages/ExcursionsPage"));
const DivingPage = lazy(() => import("./pages/DivingPage"));
const TransfersPage = lazy(() => import("./pages/TransfersPage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const BookingsListPage = lazy(() => import("./pages/BookingsListPage"));
const DestinationExcursionsPage = lazy(() => import("./pages/DestinationExcursionsPage"));
const TripDetailsPage = lazy(() => import("./pages/TripDetailsPage"));
const TripSoonPage = lazy(() => import("./pages/TripSoonPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

function App() {
  const { openAuthModal } = useAuthModal();

  useEffect(() => {
    // "Inject" the openAuthModal function into the utility file
    setAuthModalFunction(openAuthModal);
  }, [openAuthModal]);

  return (
    <div className="App">
      <Router>
        <Suspense fallback={<LoadingPage />}>
          <Routes>
            {/* Routes with navbar and footer */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/Wishlist" element={<Wishlist />} />
              <Route path="/NoResults" element={<NoResults />} />
              <Route path="/Contact" element={<ContactPage />} />
              <Route path="/AboutUs" element={<AboutPage />} />
              <Route path="/VerifyEmail" element={<OTPInput />} />
              <Route path="/excursions" element={<Excursions />} />
              <Route
                path="/excursions/:location"
                element={<DestinationExcursionsPage />}
              />
              <Route path="/diving" element={<DivingPage />} />
              <Route
                path="/diving/:location"
                element={<DestinationExcursionsPage />}
              />
              <Route path="/transfers" element={<TransfersPage />} />
              <Route
                path="/transfers/:location"
                element={<DestinationExcursionsPage />}
              />
              <Route path="/trip/:tripName" element={<TripDetailsPage />} />
              <Route path="/trip/ComingSoon" element={<TripSoonPage />} />
              <Route path="/checkout" element={<BookingPage />} />
              <Route path="/cart" element={<BookingsListPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/ComingSoon" element={<ComingSoon />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Routes without navbar and footer */}
            <Route element={<MinimalLayout />}>
             <Route path="/signUp" element={<AuthComp />} />
              {/* <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} /> */}
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;