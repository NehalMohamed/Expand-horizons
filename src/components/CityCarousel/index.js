import { useRef ,useState, useEffect} from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTripsAll } from '../../redux/Slices/tripsSlice';
import CityCard from "../CityCard";

const CityCarousel = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const scrollContainerRef = useRef(null)
  const currentLang = useSelector((state) => state.language.currentLang) || "en";
  const { trips: slides = [], loading, error } = useSelector((state) => state.trips);

  useEffect(() => {
  const params = {
    lang_code: currentLang,
    show_in_slider: true,
    show_in_top: false,
    destination_id: 0,
    currency_code: "USD"
  };
  dispatch(fetchTripsAll(params));
}, [dispatch, currentLang]);
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300 // Adjust as needed
      if (direction === "left") {
        scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
      } else {
        scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
      }
    }
  }


  return (
    <section className="carousel-section" id="cities">
    <Container>
        <div className="section-header">
            <h2 className="section-title">{t('tours.top_offers')}</h2>
            {/* <p className="section-subtitle">
               {t('wishlist.topCitiesDescription')}
            </p> */}
        </div>
      
      <div className="carousel-wrapper">
        <Button
          variant="light"
          className="nav-button nav-button-left"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          <FaChevronLeft />
        </Button>
        <div className="cards-container" ref={scrollContainerRef}>
          <Row className="flex-nowrap g-3">
            {slides.map((slide) => (
              <Col key={slide.trip_id} xs={12} sm={6} md={4} lg={3} className="card-col">
                <CityCard {...slide} />
              </Col>
            ))}
          </Row>
        </div>
        <Button
          variant="light"
          className="nav-button nav-button-right"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          <FaChevronRight />
        </Button>
      </div>
    </Container>
    </section>
  );
};


export default CityCarousel;