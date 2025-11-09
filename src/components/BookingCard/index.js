import React from 'react';
import { Card, Button } from 'react-bootstrap';
import {
    FaStar,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaUsers,
    FaCreditCard,
    FaRegCalendarCheck,
    FaPlus,
    FaIdCard,
    FaMoneyBillWave,
    FaQrcode,
    FaExchangeAlt
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const BookingCard = ({ booking, onCancelBooking }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const isTwoWayTransfer = booking?.is_two_way === true && booking?.trip_type === 2;

    const renderStars = (rating) => {
        if (!rating) return null;

        const stars = [];
        const fullStars = Math.floor(rating);

        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FaStar
                    key={i}
                    className={i <= fullStars ? 'star-filled' : 'star-empty'}
                />
            );
        }
        return stars;
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return t('bookings.dateToBeConfirmed');
        try {
            const date = new Date(dateTimeString);
            const formattedDate = date.toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            const formattedTime = date.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit'
            });
            return `${formattedDate} at ${formattedTime}`;
        } catch (error) {
            return dateTimeString;
        }
    };

    const getParticipantsText = (booking) => {
        if (!booking) return '';

        let text = `${booking.total_pax || 0} ${t('bookings.adults')}`;
        if (booking.child_num > 0) {
            text += `, ${booking.child_num} ${t('bookings.children')}`;
        }
        if (booking.infant_num > 0) {
            text += `, ${booking.infant_num} ${t('bookings.infants')}`;
        }

        return text;
    };

    const renderExtras = (extras) => {
        if (!extras || extras.length === 0) {
            return null;
        }

        return (
            <>
                {extras.map((extra, index) => (
                    <div key={extra.id || index} className="detail-item">
                        <FaPlus className="detail-icon" />
                        <p className="detail-text">
                            {extra.extra_count > 1 ? `${extra.extra_count} × ` : ''} {extra.extra_name}
                        </p>
                    </div>
                ))}
            </>
        );
    };

    const renderObligatoryExtras = (ObligatoryExtras) => {
        if (!ObligatoryExtras || ObligatoryExtras.length === 0) {
            return null;
        }

        return (
            <>
                {ObligatoryExtras.map((extra, index) => (
                    <div key={extra.id || index} className="detail-item">
                        <FaPlus className="detail-icon" />
                        <p className="detail-text">
                            {extra.extra_name}
                        </p>
                    </div>
                ))}
            </>
        );
    };

    const handleCancelClick = (e) => {
        e.stopPropagation();
        if (onCancelBooking) {
            onCancelBooking(booking);
        }
    };

    return (
        <Card className="booking-card h-100">
            <div className="card-img-container">
                <Card.Img
                    variant="top"
                    src={booking.default_img}
                    alt={booking.trip_name}
                    className="booking-image"
                />
                <div className="booking-badge">
                    {t('wishlist.saved')} {booking.booking_datestr}
                </div>
            </div>

            <Card.Body className="card-content">
                <Card.Title className="booking-title">{booking.trip_name}</Card.Title>

                {booking.review_rate && (
                    <div className="rating-section">
                        <div className="stars">
                            {renderStars(booking.review_rate)}
                        </div>
                        <span className="rating-value">{booking.review_rate}</span>
                    </div>
                )}

                <div className="booking-info">
                    {booking.pickup_address && (
                        <div className="detail-item">
                            <FaMapMarkerAlt className="detail-icon" />
                            <p className="detail-text">{booking.pickup_address}</p>
                        </div>
                    )}

                    {/* Trip Date */}
                    <div className="detail-item">
                        <FaCalendarAlt className="detail-icon" />
                        <p className="detail-text">
                            <strong>{t('bookings.tripDate')}:</strong> {booking.trip_datestr}
                        </p>
                    </div>

                    {/* Return Date - Only show if it exists */}
                    {booking.trip_return_datestr && (
                        <div className="detail-item">
                            <FaCalendarAlt className="detail-icon" />
                            <p className="detail-text">
                                <strong>{t('bookings.returnDate')}:</strong> {booking.trip_return_datestr}
                            </p>
                        </div>
                    )}

                    <div className="detail-item">
                        <FaUsers className="detail-icon" />
                        <p className="detail-text">{getParticipantsText(booking)}</p>
                    </div>

                    {/* Two-way Transfer Display */}
                    {isTwoWayTransfer && (
                        <div className="detail-item">
                            <FaExchangeAlt className="detail-icon" />
                            <p className="detail-text">
                                {t('booking.twoWayTransfer')}
                            </p>
                        </div>
                    )}

                    <div className="detail-item">
                        <FaIdCard className="detail-icon" />
                        <p className="detail-text">
                            {booking.booking_status}
                        </p>
                    </div>

                    {booking.cancelation_policy && (
                        <div className="detail-item">
                            <FaRegCalendarCheck className="detail-icon" />
                            <p className="detail-text">
                                {booking.cancelation_policy}
                            </p>
                        </div>
                    )}

                    {renderExtras(booking.extras)}

                    {renderObligatoryExtras(booking.extras_obligatory)}

                    <div className="detail-item">
                        <FaMoneyBillWave className="detail-icon" />
                        <p className="detail-text">{t('bookings.resevePay')}</p>
                    </div>

                    <div className="detail-item">
                        <FaQrcode className="detail-icon" />
                        <p className="detail-text">
                            {t('bookings.bookingCode')}: {booking.booking_code}
                        </p>
                    </div>
                </div>

                <div className="booking-total">
                    <div className="total-row">
                        <Button
                            variant="outline-primary"
                            className="cancel-btn"
                            onClick={handleCancelClick}
                        >
                            {t("general.cancel")}
                        </Button>
                        {/* <span className="total-label">{t('bookings.orderSummary.total')}</span> */}
                        <span className="total-price">
                            {booking.total_price ? `${booking.total_price} €` : `0 €`}
                        </span>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default BookingCard;