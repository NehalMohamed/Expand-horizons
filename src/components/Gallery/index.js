import React, { useState } from 'react';
import { IoHeart, IoHeartOutline, IoShareSocial } from 'react-icons/io5';
import { CiExport } from "react-icons/ci";
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import Lightbox from 'react-image-lightbox';
import { useTranslation } from "react-i18next";
import 'react-image-lightbox/style.css';
import { useTripData } from '../../contexts/TripContext';
import { useSelector } from 'react-redux';

const Gallery = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const tripData = useTripData();
  const { t } = useTranslation();

  const images = tripData.imgs;

  const openLightbox = (index) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };
  
  // Create dynamic star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="star filled">★</span>);
    }
    
    // Half star
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    
    // Empty stars
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star">★</span>);
    }
    
    return stars;
  };

  return (
    <div className="gallery-section">
      <Container>
        {/* Header */}
        <div className="gallery-header">
          <h1 className="gallery-title">{tripData.trip_name}</h1>
          <div className="gallery-meta">
            <div className="rating-section">
              <div className="stars">
                {renderStars(tripData.review_rate)}
              </div>
              <span className="rating-text">{tripData.review_rate.toFixed(1)}</span>
              <a href="" className="reviews-link">
                {tripData.total_reviews} {t("tripDetails.reviews")}
                </a>
            </div>
            <div className="actions">
              <button 
                className={`action-btn wishlist-btn ${isWishlisted ? 'active' : ''}`}
                onClick={toggleWishlist}
              >
                {isWishlisted ? <IoHeart size={24} /> : <IoHeartOutline size={24} />}
                <span className="btn-text">{t("tripDetails.addToWishlist")}</span>
              </button>
              <button className="action-btn share-btn">
                <CiExport size={24} />
                <span className="btn-text">{t("tripDetails.share")}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          <div className="main-image">
            <img 
              src={images[0].img_path} 
              alt={images[0].img_name}
              onClick={() => openLightbox(0)}
            />
          </div>
          <div className="secondary-image">
            <img 
              src={images[1].img_path} 
              alt={images[1].img_name}
              onClick={() => openLightbox(1)}
            />
          </div>
          <div className="thumbnail-grid">
            {images.slice(2, 5).map((image, index) => (
              <div key={image.id} className="thumbnail">
                <img 
                  src={image.img_path} 
                  alt={image.img_name}
                  onClick={() => openLightbox(index + 2)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* React Image Lightbox */}
        {isOpen && (
          <Lightbox
            mainSrc={images[photoIndex].img_path}
            nextSrc={images[(photoIndex + 1) % images.length].img_path}
            prevSrc={images[(photoIndex + images.length - 1) % images.length].img_path}
            onCloseRequest={() => setIsOpen(false)}
            onMovePrevRequest={() =>
              setPhotoIndex((photoIndex + images.length - 1) % images.length)
            }
            onMoveNextRequest={() =>
              setPhotoIndex((photoIndex + 1) % images.length)
            }
            imageTitle={images[photoIndex].img_name}
            imageCaption={`${photoIndex + 1} / ${images.length}`}
            reactModalStyle={{
              overlay: {
                zIndex: 9999
              }
            }}
            // toolbarButtons={[
            //   <button
            //     key="wishlist"
            //     type="button"
            //     className="ril-toolbar__item__child lightbox-wishlist"
            //     onClick={toggleWishlist}
            //     title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            //   >
            //     {isWishlisted ? <IoHeart size={20} /> : <IoHeartOutline size={20} />}
            //   </button>
            // ]}
          />
        )}
      </Container>
    </div>
  );
};

export default Gallery;