import { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { FaCheck, FaHeart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import { addToWishlist } from "../../redux/Slices/wishlistSlice";

const WishlistCard = ({ trip, onWishlistUpdate }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);

  // Check if description needs truncation
  useEffect(() => {
    if (trip?.trip_description && trip.trip_description.length > 70) {
      setNeedsTruncation(true);
    }
  }, [trip?.trip_description]);

  // Get truncated text
  const truncatedText = needsTruncation
    ? trip?.trip_description?.slice(0, 70) + '...'
    : trip?.trip_description;

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    const user = JSON.parse(localStorage.getItem("user"));

    const wishlistData = {
      id: trip.wish_id,
      trip_id: trip.trip_id,
      client_id: user ? user.id : 0,
      created_at: null,
      trip_type: trip?.trip_type,
      delete: trip.isfavourite // true to remove, false to add
    };
    dispatch(addToWishlist(wishlistData))
      .unwrap()
      .then((result) => {
        if (result.success && onWishlistUpdate) {
          onWishlistUpdate(); // Call refresh callback
        }
      })
      .catch((error) => {
        // Error is handled in the slice and will be shown in WishlistSection
      });
  };

  const handleCardClick = () => {
    if (!trip.is_comm_soon) {
      navigate(`/trip/${trip.route}`, {
        state: {
          tripId: trip.trip_id,
          trip_type: trip.trip_type
        }
      });
    } else {
      navigate('/trip/ComingSoon', {
        state: {
          tripId: trip.trip_id,
          trip_type: trip.trip_type
        }
      });
    }
  };

  // Function to format price display based on trip type
  const renderPrice = () => {
    const currencySymbol = trip?.currency_code.toUpperCase() === "EUR" ? "€" : trip?.currency_code;

    return (
      <div className="price-section">
        <div className="price-range">
          <span className="price-label">{t("general.from")}   <span className="price"> {trip?.trip_min_price} {currencySymbol}</span> </span>
        </div>
        {/* <div className="price-range">
            <span className="price-label">{t("general.to")}  <span className="price"> {trip?.trip_max_price} {currencySymbol}</span> </span>
          </div> */}
      </div>
    );
  };

  return (
    <>

      <Card className="wish-card h-100">

        <div className="card-img-container">
          <Card.Img variant="top" src={trip.default_img} alt={trip.trip_name} />
          <span
            className="wishlist-date"
            aria-label="Add to wishlist"
          >
            {t('wishlist.saved')} {trip.wsh_created_at}
          </span>

          <button
            className={`wishlist-heart ${trip.isfavourite ? "liked" : ""}`}
            onClick={handleWishlistToggle}
            aria-label={trip.isfavourite ? t("tripDetails.removeFromWishlist") : t("tripDetails.addToWishlist")}
          >
            <FaHeart />
          </button>
        </div>

        <Card.Body className="card-content">
          <Card.Title className="tour-title">{trip.trip_name}</Card.Title>
          {/* <Card.Text className="tour-description">{trip.trip_description}</Card.Text> */}

          {/* Description with truncation */}
          <Card.Text className="tour-description">
            {showFullDescription ? trip?.trip_description : truncatedText}
            {needsTruncation && (
              <button
                className="show-more-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullDescription(!showFullDescription);
                }}
              >
                {showFullDescription ? t("general.show_less") : t("general.show_more")}
              </button>
            )}
          </Card.Text>
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
              }}
            >
              {t("general.show_more")}
            </Button>
            {renderPrice()}
            {/* <div className="price-section">
              {/* <span className="price-label">ab</span> 
              <span className="price">{trip.currency_code.toUpperCase() === "EUR" ? "€" : ` ${trip.currency_code}`} {trip.trip_origin_price} </span>
              <span className="price-suffix">
                p.P.</span>
            </div>*/}
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default WishlistCard;