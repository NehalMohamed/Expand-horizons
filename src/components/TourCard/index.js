import { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { FaCheck, FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import { addToWishlist } from "../../redux/Slices/wishlistSlice";

const TourCard = ({ trip }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentLang = useSelector((state) => state.language.currentLang) || "en";
 

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    const user = JSON.parse(localStorage.getItem("user"));

    const wishlistData = {
      id:trip.wish_id,
      trip_id: trip.trip_id,
      client_id: user? user.id : 0,
      created_at: null,
      trip_type: 1,
      delete: trip.isfavourite // true to remove, false to add
    };
    dispatch(addToWishlist(wishlistData));
  };

  const handleCardClick = () => {
    localStorage.setItem('currentTripData', JSON.stringify(trip));
    navigate(`/trip/${trip.route}`, {
      state: { tripId: trip.trip_id }
    });
  };

  return (
      <Card className="tour-card h-100">
        <div className="card-img-container">
          <Card.Img variant="top" src={trip.default_img} alt={trip.trip_name} />
          <button
            className={`wishlist-heart ${trip.isfavourite ? "liked" : ""}`}
            onClick={handleWishlistToggle}
            aria-label={trip.isfavourite ? t("tripDetails.removeFromWishlist"): t("tripDetails.addToWishlist")}
          >
            <FaHeart />
          </button>
        </div>

        <Card.Body className="card-content">
          <Card.Title className="tour-title">{trip.trip_name}</Card.Title>
          <Card.Text className="tour-description">{trip.trip_description}</Card.Text>

          <ul className="feature-list flex-grow-1">
            {trip.facilities?.map((facility, index) => (
              <li key={index} className="feature-item">
                <FaCheck className="check-icon" />
                <span>{facility.facility_name}</span>
              </li>
            ))}
          </ul>

          <div className="card-footer-content">
            <Button
              variant="outline-primary"
              className="book-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}>

              {t("general.show_more")}
            </Button>
            <div className="price-section">
              <span className="price-label">ab</span>
              <span className="price">{trip.trip_origin_price}</span>
              <span className="price-suffix">{trip.currency_code} p.P.</span>
            </div>
          </div>
        </Card.Body>
      </Card>
  );
};

export default TourCard;