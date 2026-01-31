import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchDestinations, fetchDestChildren } from "../../redux/Slices/destinationsSlice";

const TopDestinations = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [imageErrors, setImageErrors] = useState({});
  const [selectedParent, setSelectedParent] = useState(null);
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false); // NEW: Track mobile state

  const carouselRef = useRef(null);
  const slideRefs = useRef([]);
  const carouselContainerRef = useRef(null);

  const {
    items: parentDestinations,
    childrenItems: childDestinations,
    loading
  } = useSelector((state) => state.destinations);

  const currentLang =
    useSelector((state) => state.language.currentLang) || "en";

  // NEW: Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Same as your sm breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const params = {
      lang_code: currentLang,
      leaf: false,
      parent_id: 0
    };
    dispatch(fetchDestinations(params));
  }, [dispatch, currentLang]);

  useEffect(() => {
    // Reset slide when children change
    setCurrentSlide(0);
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = 0;
    }
  }, [childDestinations]);

  useEffect(() => {
    if (selectedParent &&
      carouselContainerRef.current &&
      childDestinations &&
      childDestinations.length > 0 &&
      !loadingChildren) {

      const timer = setTimeout(() => {
        carouselContainerRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [selectedParent, childDestinations, loadingChildren]);

  const handleParentClick = async (parentDestination) => {
    if (selectedParent?.destination_id === parentDestination.destination_id) {
      setSelectedParent(null);
      return;
    }

    setSelectedParent(parentDestination);
    setLoadingChildren(true);

    try {
      const params = {
        lang_code: currentLang,
        leaf: true,
        parent_id: parentDestination.destination_id
      };

      await dispatch(fetchDestChildren(params));
    } catch (error) {
      console.error("Error fetching child destinations:", error);
    } finally {
      setLoadingChildren(false);
    }
  };

  const handleDestinationClick = (destination) => {
    navigate(
      `/excursions/${destination.route.toLowerCase().replace(/\s+/g, "-")}`,
      {
        state: { DestinationId: destination.destination_id },
      }
    );
  };

  const handleImageError = (destinationId) => {
    setImageErrors((prev) => ({
      ...prev,
      [destinationId]: true,
    }));
  };

  const goToSlide = (slideIndex) => {
    if (carouselRef.current && slideRefs.current[slideIndex]) {
      slideRefs.current[slideIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });
    }
    setCurrentSlide(slideIndex);
  };

  // UPDATED: Use dynamic items per slide
  const goToPrevSlide = () => {
    const itemsPerSlide = isMobile ? 2 : 3; // Dynamic calculation
    const totalSlides = Math.ceil(childDestinations?.length / itemsPerSlide) || 1;
    const newSlide = currentSlide > 0 ? currentSlide - 1 : totalSlides - 1;
    goToSlide(newSlide);
  };

  // UPDATED: Use dynamic items per slide
  const goToNextSlide = () => {
    const itemsPerSlide = isMobile ? 2 : 3; // Dynamic calculation
    const totalSlides = Math.ceil(childDestinations?.length / itemsPerSlide) || 1;
    const newSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0;
    goToSlide(newSlide);
  };

  const handleScroll = () => {
    if (!carouselRef.current || !slideRefs.current.length) return;

    const scrollLeft = carouselRef.current.scrollLeft;
    const containerWidth = carouselRef.current.offsetWidth;
    const newSlide = Math.round(scrollLeft / containerWidth);

    if (newSlide !== currentSlide) {
      setCurrentSlide(newSlide);
    }
  };

  const renderParentCard = (destination, index) => (
    <Col
      key={destination.destination_id}
      xs={12}
      sm={6}
      md={4}
      className={`destination-col ${index >= 3 ? "second-row" : "first-row"} ${selectedParent?.destination_id === destination.destination_id ? "active-parent" : ""
        }`}
    >
      <Card
        className="destination-card parent-card"
        onClick={() => handleParentClick(destination)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleParentClick(destination);
          }
        }}
      >
        <div className="card-image-wrapper">
          {imageErrors[destination.destination_id] ? (
            <div className="destination-fallback">
              <span className="destination-icon">📍</span>
            </div>
          ) : (
            <Card.Img
              variant="top"
              src={destination.img_path || "/images/default-destination.jpg"}
              alt={destination.dest_description}
              className="destination-image"
              onError={() => handleImageError(destination.destination_id)}
              loading="lazy"
              decoding="async"
            />
          )}
          <div className="card-overlay">
            <Card.Title className="destination-name">
              {destination.dest_name}
            </Card.Title>
          </div>
        </div>
      </Card>
    </Col>
  );

  const renderChildCard = (destination) => (
    <Card
      className="destination-card child-card"
      onClick={() => handleDestinationClick(destination)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleDestinationClick(destination);
        }
      }}
    >
      <div className="card-image-wrapper">
        {imageErrors[destination.destination_id] ? (
          <div className="destination-fallback">
            <span className="destination-icon">📍</span>
          </div>
        ) : (
          <Card.Img
            variant="top"
            src={destination.img_path || "/images/default-destination.jpg"}
            alt={destination.dest_description}
            className="destination-image"
            onError={() => handleImageError(destination.destination_id)}
            loading="lazy"
            decoding="async"
          />
        )}
        <div className="card-overlay">
          <Card.Title className="destination-name child-name">
            {destination.dest_name}
          </Card.Title>
          <div className="child-indicator">{t("destinations.explore")} →</div>
        </div>
      </div>
    </Card>
  );

  // UPDATED: Render slides with dynamic items per slide
  const renderCarouselSlides = () => {
    if (!childDestinations || childDestinations.length === 0) return null;

    const slides = [];
    const itemsPerSlide = isMobile ? 2 : 3; // Dynamic based on screen size
    const totalSlides = Math.ceil(childDestinations.length / itemsPerSlide);

    for (let slideIndex = 0; slideIndex < totalSlides; slideIndex++) {
      const startIndex = slideIndex * itemsPerSlide;
      const endIndex = startIndex + itemsPerSlide;
      const slideItems = childDestinations.slice(startIndex, endIndex);

      slides.push(
        <div
          key={slideIndex}
          className="carousel-slide"
          ref={el => slideRefs.current[slideIndex] = el}
        >
          <div className="slide-content">
            {slideItems.map((child) => (
              <div key={child.destination_id} className="child-card-wrapper">
                {renderChildCard(child)}
              </div>
            ))}
            {/* Add empty placeholders - dynamic count */}
            {slideItems.length < itemsPerSlide &&
              Array.from({ length: itemsPerSlide - slideItems.length }).map((_, idx) => (
                <div key={`empty-${idx}`} className="child-card-wrapper empty-wrapper">
                  <div className="empty-card"></div>
                </div>
              ))
            }
          </div>
        </div>
      );
    }

    return slides;
  };

  if (loading) {
    return (
      <section className="top-destinations">
        <Container>
          <div className="section-header">
            <h2 className="section-title">{t("wishlist.topCities")}</h2>
            <p className="section-subtitle">
              {t("wishlist.topCitiesDescription")}
            </p>
          </div>
          <div className="loading-container">
            <Spinner animation="border" variant="primary" />
          </div>
        </Container>
      </section>
    );
  }

  // UPDATED: Calculate total slides dynamically
  const itemsPerSlide = isMobile ? 2 : 3;
  const totalSlides = Math.ceil(childDestinations?.length / itemsPerSlide) || 0;

  return (
    <section className="top-destinations">
      <Container>
        <div className="section-header">
          <h2 className="section-title">{t("wishlist.topDestinations")}</h2>
          <p className="section-subtitle">
            {t("wishlist.topDestinationsDescription")}
          </p>
        </div>

        {/* Parent Destinations */}
        <Row className="destinations-grid parent-grid">
          {parentDestinations.map((destination, index) =>
            renderParentCard(destination, index)
          )}
        </Row>

        {/* Child Destinations Carousel */}
        {selectedParent && childDestinations && childDestinations.length > 0 && (
          <div
            className="children-carousel-container"
            ref={carouselContainerRef}
          >
            <div className="carousel-header">
              <h3 className="carousel-title">
                {t("destinations.explore")} {selectedParent.dest_name}
              </h3>
            </div>

            {loadingChildren ? (
              <div className="loading-children">
                <Spinner animation="border" variant="secondary" size="sm" />
                <span>{t("destinations.loading")}</span>
              </div>
            ) : (
              <>
                <div className="carousel-wrapper">
                  <div
                    className="carousel-track"
                    ref={carouselRef}
                    onScroll={handleScroll}
                  >
                    {renderCarouselSlides()}
                  </div>

                  {totalSlides > 1 && (
                    <>
                      <button
                        className="carousel-arrow prev-arrow"
                        onClick={goToPrevSlide}
                        aria-label={t("destinations.previousSlide")}
                      >
                        ‹
                      </button>
                      <button
                        className="carousel-arrow next-arrow"
                        onClick={goToNextSlide}
                        aria-label={t("destinations.nextSlide")}
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>

                {/* Dots Indicators */}
                {totalSlides > 1 && (
                  <div className="carousel-dots">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                      <button
                        key={index}
                        className={`dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`${t("destinations.goToSlide")} ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </Container>
    </section>
  );
};

export default TopDestinations;