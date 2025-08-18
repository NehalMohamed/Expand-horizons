import { Card } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import { FaStar } from "react-icons/fa";

const CityCard = (slide) => {
  const { t } = useTranslation();
  const renderStars = (count) => {
    const stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(<FaStar key={i} className={i < count ? "star-filled" : "star-empty"} />)
    }
    return stars
  }

  return (
    <Card className="city-card">
      <div className="image-wrapper">
        <Card.Img src={slide.default_img} alt={slide.trip_name} width={180} height={150} className="card-image" />
      </div>
      <Card.Body className="card-body">
        <Card.Title className="card-title">{slide.trip_name}</Card.Title>
        <div className="card-details-grid">
          <div className="reviews-row">
            <span className="reviews-text">   </span>
            <span className="reviews-text">{t("tripDetails.priceFrom")}</span>
          </div>
          <div className="reviews-row">
            <span className="reviews-text">{slide.total_reviews} {t("tripDetails.reviews")}</span>
            {slide.trip_origin_price && <span className="old-price">{slide.trip_origin_price} {slide.currency_code}</span>}
          </div>
          <div className="price-row">
            <div className="star-rating">{renderStars(slide.review_rate)}</div>
            <span className="new-price">{slide.trip_sale_price} {slide.currency_code}</span>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

export default CityCard;
