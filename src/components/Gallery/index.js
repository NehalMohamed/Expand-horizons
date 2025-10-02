import React, { useState, useEffect } from 'react';
import { IoHeart, IoHeartOutline, IoShareSocial } from 'react-icons/io5';
import { CiExport } from "react-icons/ci";
import { Container, Spinner } from 'react-bootstrap';
import Lightbox from 'react-image-lightbox';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import 'react-image-lightbox/style.css';
import { addToWishlist, resetWishlistOperation } from '../../redux/Slices/wishlistSlice';
import LoadingPage from "../Loader/LoadingPage";
import PopUp from "../Shared/popup/PopUp";

const Gallery = ({ tripData , refreshTripDetails }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('alert');
  
  const dispatch = useDispatch();
  // const tripData = useTripData();
  const { t } = useTranslation();
  const currentLang = useSelector((state) => state.language.currentLang) || "en";
  const { operation } = useSelector((state) => state.wishlist);

  const images = tripData?.imgs || [];
  const hasImages = images.length > 0;

  // Handle operation errors and successes
    useEffect(() => {
      if (operation.error) {
        setPopupMessage(operation.error);
        setPopupType('alert');
        setShowPopup(true);
        
        // Reset operation error after showing
        setTimeout(() => {
          dispatch(resetWishlistOperation());
        }, 100);
      }
    }, [operation.error, dispatch]);
  
    // Handle successful operation silently
    useEffect(() => {
      if (operation.success) {
        // Reset operation success after a delay
        refreshTripDetails();

        setTimeout(() => {
          dispatch(resetWishlistOperation());
        }, 100);
      }
    }, [operation.success, dispatch, refreshTripDetails]);
  
    // Cleanup on unmount
    useEffect(() => {
      return () => {
        dispatch(resetWishlistOperation());
      };
    }, [dispatch]);

  const openLightbox = (index) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };
  
  const handleWishlistToggle = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (!tripData) return;
  
        const user = JSON.parse(localStorage.getItem("user"));
        const wishlistData = {
          id: tripData.wish_id,
          trip_id: tripData.trip_id,
          client_id: user?.id || 0,
          created_at: null,
          trip_type: tripData?.trip_type,
          delete: tripData.isfavourite // true to remove, false to add
        };
  
      dispatch(addToWishlist(wishlistData));
    };

  // Create dynamic star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;

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
    <>
    <div className="gallery-section">
      <Container>
        {/* Header */}
        <div className="gallery-header">
          <h1 className="gallery-title">{tripData?.trip_name || ''}</h1>
          <div className="gallery-meta">
            <div className="rating-section">
              <div className="stars">
                {renderStars(tripData?.review_rate ||0)}
              </div>
              <span className="rating-text">{(tripData?.review_rate || 0).toFixed(1)}</span>
              <a href="" className="reviews-link">
                {tripData?.total_reviews || 0} {t("tripDetails.reviews")}
                </a>
            </div>
            <div className="actions">
              <button 
                className={`action-btn wishlist-btn ${tripData?.isfavourite ? 'active' : ''}`}
                 onClick={handleWishlistToggle}
                  disabled={operation.loading}
              >
                {tripData?.isfavourite ? 
                <IoHeart size={24} /> : 
                <IoHeartOutline size={24} />}
                {tripData?.isfavourite ? 
                <span className="btn-text">{t("tripDetails.removeFromWishlist")}</span> : 
                <span className="btn-text">{t("tripDetails.addToWishlist")}</span>
                }
              </button>
              <button className="action-btn share-btn">
                <CiExport size={24} />
                <span className="btn-text">{t("tripDetails.share")}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {hasImages ?(
        <div className="gallery-grid">
          <div className="main-image">
            <img 
              src={images[0].img_path} 
              alt={images[0].img_name}
              onClick={() => openLightbox(0)}
            />
          </div>
          {images.length > 1 && (
          <div className="secondary-image">
            <img 
              src={images[1].img_path} 
              alt={images[1].img_name}
              onClick={() => openLightbox(1)}
            />
          </div>
          )}
          {images.length > 2 && (
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
           )}
            </div>
          ) : (
            <div className="no-images-message">
              <p>{t("tripDetails.noImagesAvailable")}</p>
            </div>
          )}

        {/* React Image Lightbox */}
        {isOpen && hasImages && (
          <Lightbox
            mainSrc={images[photoIndex].img_path}
            nextSrc={images[(photoIndex + 1) % images.length]?.img_path}
            prevSrc={images[(photoIndex + images.length - 1) % images.length]?.img_path}
            onCloseRequest={() => setIsOpen(false)}
            onMovePrevRequest={() =>
              setPhotoIndex((photoIndex + images.length - 1) % images.length)
            }
            onMoveNextRequest={() =>
              setPhotoIndex((photoIndex + 1) % images.length)
            }
            imageTitle={images[photoIndex]?.img_name || ''}
            imageCaption={`${photoIndex + 1} / ${images.length}`}
            reactModalStyle={{
              overlay: {
                zIndex: 9999
              }
            }}
          />
        )}
      </Container>
    </div>

    {/* Show loading page during wishlist operation */}
      {operation.loading && <LoadingPage />}

      {/* Show popup for error messages */}
      {showPopup && (
        <PopUp
          show={showPopup}
          closeAlert={() => setShowPopup(false)}
          msg={popupMessage}
          type={popupType}
          autoClose={false}
          showConfirmButton={false}
        />
      )}
    </>
  );
};

export default Gallery;