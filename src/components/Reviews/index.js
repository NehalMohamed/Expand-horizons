import React, { useEffect, useState } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useTripData } from '../../contexts/TripContext';
import { fetchClientsReviews } from "../../redux/Slices/tripsSlice";

const Reviews = () => {
    const { t } = useTranslation();
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [hoverRating, setHoverRating] = useState(0);
    const tripData = useTripData();
    const tripId = tripData.trip_id;
    const dispatch = useDispatch();
    const { reviewsByTrip = [], loading, error } = useSelector((state) => state.trips);
    const currentLang = useSelector((state) => state.language.currentLang) || "en";

    console.log(reviewsByTrip)

    useEffect(() => {
        const params = {
            trip_id: tripId,
            trip_type: 1,
            pageNumber: 1,
            pageSize: 5
        };
        dispatch(fetchClientsReviews(params));
    }, [dispatch, tripId]);

    // Wait for data to load
    if (loading) {
        return (
            <div className="reviews-section">
                <Container>
                    <div className="text-center py-5">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                </Container>
            </div>
        );
    }

    const reviews = reviewsByTrip?.reviews || [];

    const handleAddReviewClick = () => {
        setShowReviewForm(!showReviewForm);
    };

    const handleRatingClick = (rating) => {
        setUserRating(rating === userRating ? 0 : rating); // Toggle rating if same star clicked
    };

    const handleSubmitReview = () => {
        if (userRating === 0 || reviewText.trim() === '') return;

        // Prepare review data
        const newReview = {
            review_rate: userRating,
            review_description: reviewText,
            review_title: "New Review", // You might want to collect this from user
            entry_dateStr: new Date().toLocaleDateString()
        };

        // Here you would typically dispatch an action to save the review
        console.log('Submitting review:', newReview);

        // Reset form
        setShowReviewForm(false);
        setUserRating(0);
        setHoverRating(0);
        setReviewText('');
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



    return (
        <div className="reviews-section">
            <Container>
                <div className="row">
                    <div className="col-lg-10">
                        <div className="reviews-container">
                            <h3 className="section-title">{t("tripDetails.reviewsFromTravelers")}</h3>

                            <div className="row">
                                {reviews.map((review) => (
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
                                ))}
                            </div>

                            <div className="reviews-actions mt-4">
                                <div className="row align-items-center">
                                    <div className="col-md-6">
                                        <button
                                            className="btn btn-link add-reviews-btn p-0"
                                            onClick={handleAddReviewClick}
                                        >
                                            {t("tripDetails.addReviews")}
                                        </button>
                                    </div>
                                    <div className="col-md-6 text-md-end">
                                        <button className="btn btn-link see-more-btn p-0">
                                            {t("tripDetails.seeMoreReviews")}
                                        </button>
                                    </div>
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
                                        />
                                    </div>

                                    <div className="form-actions">
                                        <button
                                            className="btn secondryBtn me-2"
                                            onClick={handleSubmitReview}
                                            disabled={userRating === 0 || reviewText.trim() === ''}
                                        >
                                            {t("tripDetails.add")}
                                        </button>
                                        <button
                                            className="btn btn-outline-secondary"
                                            onClick={() => {
                                                setShowReviewForm(false);
                                                setUserRating(0);
                                                setHoverRating(0);
                                            }}
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
    );
};

export default Reviews;