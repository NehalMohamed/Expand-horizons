import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import MinimalLayout from "./layouts/MinimalLayout";
import Home from "./pages/HomePage";
import Wishlist from "./pages/WishlistPage";
import NotFound from "./components/NotFound";
import NoResults from "./components/NoResults";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ComingSoon from "./components/ComingSoon";
import Excursions from "./pages/ExcursionsPage";
import DivingPage from "./pages/DivingPage";
import TransfersPage from "./pages/TransfersPage";
import BookingPage from "./pages/BookingPage";
import BookingsListPage from "./pages/BookingsListPage";
import DestinationExcursionsPage from "./pages/DestinationExcursionsPage";
import TripDetailsPage from "./pages/TripDetailsPage";
import TripSoonPage from "./pages/TripSoonPage";
import ProfilePage from "./pages/ProfilePage";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-popup-alert/dist/index.css";
import "react-datepicker/dist/react-datepicker.css";
import "leaflet/dist/leaflet.css";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import "react-phone-number-input/style.css";
import "./styles/main.scss";
import OTPInput from "./components/AuthComp/OTP/OTPInput";
import { useAuthModal } from "./components/AuthComp/AuthModal";
import { setAuthModalFunction } from "./utils/showAlert";
import "./leafletIconsFix";

function App() {
  const { openAuthModal } = useAuthModal();

  useEffect(() => {
    // "Inject" the openAuthModal function into the utility file
    setAuthModalFunction(openAuthModal);
  }, [openAuthModal]);

  return (
    <div className="App">
      <Router>
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
            {/* <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} /> */}
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
