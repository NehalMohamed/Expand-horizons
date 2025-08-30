import React, { useEffect, useState } from 'react';
import { Container, Spinner, Modal } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import LoadingPage from "../Loader/LoadingPage";
import PopUp from "../Shared/popup/PopUp";
import { fetchClientsReviews, submitReview, resetReviewSubmission } from "../../redux/Slices/reviewSlice";

const Reviews = ({ tripData , refreshTripDetails}) => {
    const { t } = useTranslation();
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [hoverRating, setHoverRating] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState('error');
    const [showAllReviewsModal, setShowAllReviewsModal] = useState(false);

    const tripId = tripData?.trip_id;
    const dispatch = useDispatch();

    // Get state from the review slice
    const { reviewsByTrip, loading, error, submission } = useSelector((state) => state.reviews);
    const currentLang = useSelector((state) => state.language.currentLang) || "en";

    // Get user data from localStorage
    const [user, setUser] = useState({});
    
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);
    }, []);

    useEffect(() => {
        if (tripId) {
        const params = {
            trip_id: tripId,
            trip_type: 1,
            pageNumber: 1,
            pageSize: 10 
        };
        dispatch(fetchClientsReviews(params));
    }
    }, [dispatch, tripId]);

    // Handle errors from fetching reviews
    useEffect(() => {
        if (error) {
                setPopupMessage(error.message || t("tripDetails.reviewsLoadError"));
                setPopupType('error');
                setShowPopup(true);
            }
    }, [error, t]);

// Handle submission errors only
    useEffect(() => {
        if (submission.error) {
            setPopupMessage(submission.error.message || t("tripDetails.reviewSubmissionError"));
            setPopupType('error');
            setShowPopup(true);
            
            // Reset submission error after showing
            setTimeout(() => {
                dispatch(resetReviewSubmission());
            }, 100);
        }
    }, [submission.error, dispatch, t]);

    // Handle successful submission silently
    useEffect(() => {
        if (submission.success) {
            // Refetch reviews to include the new one
           refreshTripDetails();
      
      // Reset form and fetch reviews
      setShowReviewForm(false);
      setUserRating(0);
      setHoverRating(0);
      setReviewText('');

      if (tripId) {
        const params = {
          trip_id: tripId,
          trip_type: 1,
          pageNumber: 1,
          pageSize: 10
        };
        dispatch(fetchClientsReviews(params));
      }

      setTimeout(() => {
        dispatch(resetReviewSubmission());
      }, 100);
    }
  }, [submission.success, dispatch, tripId, refreshTripDetails]);

    // Reset review submission state when component unmounts
    useEffect(() => {
        return () => {
            dispatch(resetReviewSubmission());
        };
    }, [dispatch]);

    // Get reviews for this specific trip
    const reviews = reviewsByTrip[tripId]?.reviews || [];
    
    // Show only first 2 reviews in the main view
    const displayedReviews = reviews.slice(0, 2);

    const handleAddReviewClick = () => {
        setShowReviewForm(!showReviewForm);
    };

    const handleRatingClick = (rating) => {
        setUserRating(rating === userRating ? 0 : rating);
    };

    const handleSubmitReview = () => {
        if (userRating === 0) {
            setPopupMessage(t("tripDetails.pleaseSelectRating"));
            setPopupType('error');
            setShowPopup(true);
            return;
        }

        if (reviewText.trim() === '') {
            setPopupMessage(t("tripDetails.pleaseWriteReview"));
            setPopupType('error');
            setShowPopup(true);
            return;
        }

        // Prepare review data
        const reviewData = {
            id: 0,
            client_id: user.id,
            review_title: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous',
            review_description: reviewText,
            entry_date: null,
            review_rate: userRating,
            trip_id: tripId,
            trip_type: 1
        };

        // Dispatch the submitReview action
        dispatch(submitReview(reviewData));
    };

    const renderStars = (rating, interactive = false) => {
        return (
            <div className="stars-container mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`star ${star <= rating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
                        onClick={interactive ? () => handleRatingClick(star) : undefined}
                        onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
                        onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
                    >
                        {star <= (hoverRating || userRating) ? '★' : '☆'}
                    </span>
                ))}
            </div>
        );
    };

    const AllReviewsModal = () => (
        <Modal 
            show={showAllReviewsModal} 
            onHide={() => setShowAllReviewsModal(false)}
            size="lg"
            centered
            className="reviews-section"
        >
            <Modal.Header closeButton>
                <Modal.Title className="review-header">{t("tripDetails.allReviews")}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                <div className="row">
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div className="col-12 mb-3" key={review.id}>
                                <div className="card review-card h-100">
                                    <div className="card-body">
                                        <div className="review-header mb-3">
                                            <div className="d-flex align-items-center mb-2">
                                                {renderStars(review.review_rate)}
                                                <span className="rating-number ms-2">{review.review_rate}</span>
                                            </div>
                                            <div className="reviewer-info">
                                                <div className="reviewer-avatar">
                                                    <span>{review.review_title.charAt(0)}</span>
                                                </div>
                                                <div className="reviewer-details">
                                                    <div className="reviewer-name">{review.review_title}</div>
                                                    <div className="review-date">{review.entry_dateStr}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="review-text">{review.review_description}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12">
                            <p className="text-muted text-center">{t("tripDetails.noReviewsYet")}</p>
                        </div>
                    )}
                </div>
            </Modal.Body>
        </Modal>
    );

    return (
        <>
            <div className="reviews-section">
                <Container>
                    <div className="row">
                        <div className="col-lg-10">
                            <div className="reviews-container">
                                <h3 className="section-title">{t("tripDetails.reviewsFromTravelers")}</h3>

                                <div className="row">
                                    {displayedReviews.length > 0 ? (
                                        displayedReviews.map((review) => (
                                            <div className="col-md-6 mb-3" key={review.id}>
                                                <div className="card review-card h-100">
                                                    <div className="card-body">
                                                        <div className="review-header mb-3">
                                                            <div className="d-flex align-items-center mb-2">
                                                                {renderStars(review.review_rate)}
                                                                <span className="rating-number ms-2">{review.review_rate}</span>
                                                            </div>
                                                            <div className="reviewer-info">
                                                                <div className="reviewer-avatar">
                                                                    <span>{review.review_title.charAt(0)}</span>
                                                                </div>
                                                                <div className="reviewer-details">
                                                                    <div className="reviewer-name">{review.review_title}</div>
                                                                    <div className="review-date">{review.entry_dateStr}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="review-text">{review.review_description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-12">
                                            <p className="text-muted text-center">{t("tripDetails.noReviewsYet")}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="reviews-actions mt-4">
                                    <div className="row align-items-center">
                                        <div className="col-md-6">
                                            <button
                                                className="btn btn-link add-reviews-btn p-0"
                                                onClick={handleAddReviewClick}
                                                disabled={submission.loading}
                                            >
                                                {t("tripDetails.addReviews")}
                                            </button>
                                        </div>
                                        {reviews.length > 2 && (
                                            <div className="col-md-6 text-md-end">
                                                <button 
                                                    className="btn btn-link see-more-btn p-0"
                                                    onClick={() => setShowAllReviewsModal(true)}
                                                >
                                                    {t("tripDetails.seeMoreReviews")}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Review Form - Hidden by default */}
                                {showReviewForm && (
                                    <div className="review-form mt-4">
                                        <div className="rating-section mb-3">
                                            <p className="rating-text">{t("tripDetails.rateTour")}</p>
                                            <div className="d-flex align-items-center">
                                                {renderStars(userRating, true)}
                                                <span className="ms-2 rating-value mb-3">
                                                    {userRating > 0 ? `${userRating} ${t("tripDetails.stars")}` : t("tripDetails.notRated")}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <textarea
                                                className="form-control"
                                                rows={4}
                                                value={reviewText}
                                                onChange={(e) => setReviewText(e.target.value)}
                                                placeholder={t("tripDetails.writeReview")}
                                                disabled={submission.loading}
                                            />
                                        </div>

                                        <div className="form-actions">
                                            <button
                                                className="btn secondryBtn me-2"
                                                onClick={handleSubmitReview}
                                                disabled={submission.loading}
                                            >
                                               
                                                {t("tripDetails.add")}
                                            </button>
                                            <button
                                                className="btn btn-outline-secondary"
                                                onClick={() => {
                                                    setShowReviewForm(false);
                                                    setUserRating(0);
                                                    setHoverRating(0);
                                                    setReviewText('');
                                                    dispatch(resetReviewSubmission());
                                                }}
                                                disabled={submission.loading}
                                            >
                                                {t("tripDetails.cancel")}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
            
            {/* Show loading page when fetching reviews */}
            {loading && <LoadingPage />}
            
            {/* Show popup for errors */}
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
            
            {/* All Reviews Modal */}
            <AllReviewsModal />
        </>
    );
};

export default Reviews;