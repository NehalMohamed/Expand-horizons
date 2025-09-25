import { Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const CityCard = (slide) => {
  const { t } = useTranslation();

  const renderStars = (count) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FaStar key={i} className={i < count ? "star-filled" : "star-empty"} />
      );
    }
    return stars;
  };
  const handleCardClick = () => {
    // if (!slide.is_comm_soon) {
    //   navigate(`/trip/${trip.route}`, {
    // state: {
    //   tripId: slide?.trip_id,
    //   trip_type: slide?.trip_type,
    // },
    //   });
    // } else {
    //   navigate("/trip/ComingSoon", {
    //     state: {
    //       tripId: slide.trip_id,
    //       trip_type: slide.trip_type,
    //     },
    //   });
    // }
  };
  return (
    <Link
      to={!slide.is_comm_soon ? `/trip/${slide.route}` : "/trip/ComingSoon"}
      state={{
        tripId: slide?.trip_id,
        trip_type: slide?.trip_type,
      }}
      style={{ textDecoration: "none" }}
    >
      {" "}
      <Card className="city-card">
        <div className="image-wrapper">
          <Card.Img
            src={slide.default_img}
            alt={slide.trip_name}
            width={180}
            height={150}
            className="card-image"
          />
        </div>
        <Card.Body className="card-body">
          <Card.Title className="card-title">{slide.trip_name}</Card.Title>
          <div className="card-details-grid">
            {/* <div className="reviews-row">
            <span className="reviews-text">   </span>
            <span className="reviews-text">{t("tripDetails.priceFrom")}</span>
          </div> */}
            <div className="reviews-row">
              <span className="reviews-text">
                {slide.total_reviews} {t("tripDetails.reviews")}
              </span>
              <span className="reviews-text">{t("tripDetails.priceFrom")}</span>
            </div>
            <div className="price-row">
              <div className="star-rating">
                {renderStars(slide.review_rate)}
              </div>
              <span className="new-price">
                <span className="reviews-text">{t("general.from")}</span>{" "}
                {slide.trip_min_price}{" "}
                {slide.currency_code.toUpperCase() === "EUR"
                  ? "€"
                  : ` ${slide.currency_code}`}
              </span>
              {/* <span className="new-price">
              <span className="reviews-text">{t("general.to")}</span> {slide.trip_max_price}  {slide.currency_code.toUpperCase() === "EUR" ? "€" : ` ${slide.currency_code}`}
            </span> */}
            </div>
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default CityCard;
