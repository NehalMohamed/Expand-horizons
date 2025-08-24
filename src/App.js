import React from "react";
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
import DestinationExcursionsPage from "./pages/DestinationExcursionsPage";
import TripDetailsPage from "./pages/TripDetailsPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/main.scss";
import OTPInput from "./components/AuthComp/OTP/OTPInput";

function App() {
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
            <Route path="/excursions/:location" element={<DestinationExcursionsPage />} />
            <Route path="/trip/:tripName" element={<TripDetailsPage />} />
        

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
