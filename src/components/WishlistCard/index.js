import { Card, Button } from "react-bootstrap";
import { FaCheck,FaHeart } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

const WishlistCard = ({ tour }) => {
  const { t } = useTranslation();

  return (
    <>

      <Card className="wish-card h-100">
        
        <div className="card-img-container">
          <Card.Img variant="top" src={tour.image} alt={tour.title} />
          <span
            className="wishlist-date"
            aria-label="Add to wishlist"
          >
            {t('wishlist.saved')} {tour.date}
          </span>

          <button
          className={`wishlist-heart ${tour.isLiked ? "liked" : ""}`}
          // onClick={handleWishlistToggle}
          aria-label="Add to wishlist"
        >
          <FaHeart />
        </button>
        </div>

        <Card.Body className="card-content">
          <Card.Title className="tour-title">{tour.title}</Card.Title>
          <Card.Text className="tour-description">{tour.description}</Card.Text>

          <ul className="feature-list flex-grow-1">
            {tour.features.map((feature, index) => (
              <li key={index} className="feature-item">
                <FaCheck className="check-icon" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="card-footer-content">
            <Button variant="outline-primary" className="book-btn">
              {t('general.show_more')}
            </Button>
            <div className="price-section">
              <span className="price-label">ab</span>
              <span className="price">{tour.price}</span>
              <span className="price-suffix">€ p.P.</span>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  )
}

export default WishlistCard;
