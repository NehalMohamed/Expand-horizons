import React, { useState, useEffect } from 'react';
import {
    FaStar,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaUsers,
    FaIdCard,
    FaMoneyBillWave,
    FaGift,
    FaShoppingCart,
    FaRegCalendarCheck,
    FaPlus,
    FaExchangeAlt
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getBookingSummary, clearRefresh } from '../../redux/Slices/bookingSummarySlice';
import LoadingPage from '../Loader/LoadingPage';
import PopUp from '../Shared/popup/PopUp';

const OrderSummary = ({ availabilityData }) => {
    const [showGiftCode, setShowGiftCode] = useState(false);
    const [giftCode, setGiftCode] = useState('');
    const { t } = useTranslation();

    const dispatch = useDispatch();
    // const currentLang = useSelector((state) => state.language.currentLang) || "en";
    const currentLang = localStorage.getItem("lang") || "en";
    const { summaryData, loading, error, shouldRefresh } = useSelector((state) => state.bookingSummary);

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState('alert');

    const fetchBookingSummary = () => {
        var bookingId = availabilityData?.idOut;
        if (bookingId) {
            const user = JSON.parse(localStorage.getItem("user"));
            const clientId = user?.id;

            dispatch(getBookingSummary({
                booking_id: bookingId,
                client_id: clientId,
                lang_code: currentLang
            }));
        }
    };

    useEffect(() => {
        fetchBookingSummary();
    }, [availabilityData, dispatch]);

    useEffect(() => {
        if (shouldRefresh) {
            fetchBookingSummary();
            dispatch(clearRefresh()); // Clear the refresh flag after fetching
        }
    }, [shouldRefresh, dispatch]);

    useEffect(() => {
        if (error) {
            setPopupMessage(error || t('bookings.summaryError'));
            setPopupType('alert');
            setShowPopup(true);
        }
    }, [error, t]);

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

    const handleGiftCodeClick = () => {
        setShowGiftCode(true);
    };

    const handleRedeem = () => {
        // Handle redeem logic here
        console.log('Redeeming gift code:', giftCode);
        setShowGiftCode(false);
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

    const getParticipantsText = () => {
        if (!summaryData) return '';

        let text = `${summaryData.total_pax || 0} ${t('bookings.adults')}`;
        if (summaryData.child_num > 0) {
            text += `, ${summaryData.child_num} ${t('bookings.children')}`;
        }
        if (summaryData.infant_num > 0) {
            text += `, ${summaryData.infant_num} ${t('bookings.infants')}`;
        }

        return text;
    };

    const renderExtras = () => {
        if (!summaryData?.extras || summaryData.extras.length === 0) {
            return null;
        }

        
        return (
            <>
                {summaryData.extras.map((extra, index) => (
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

    const renderObligatoryExtras = () => {
        if (!summaryData?.extras_obligatory || summaryData.extras_obligatory.length === 0) {
            return null;
        }

        return (
            <>
                {summaryData.extras_obligatory.map((extra, index) => (
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

    const isTwoWayTransfer = summaryData?.is_two_way === true && summaryData?.trip_type === 2;

    if (loading) {
        return <LoadingPage />;
    }

    if (!summaryData) {
        return (
            <div className="order-summary-card">
                <div className="order-header">
                    <h3>{t('bookings.orderSummary.title')}</h3>
                </div>
                <div className="order-summary-content">
                    <div className="text-center text-muted p-4">
                        {t('bookings.noSummaryData')}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="order-summary-card">
                <div className="order-header">
                    <h3>{t('bookings.orderSummary.title')}</h3>
                </div>

                <div className="order-summary-content">
                    <div className="summary-image">
                        <img
                            src={summaryData.default_img}
                            alt={summaryData.trip_name}
                            loading="lazy" 
                            decoding="async" 
                        />
                    </div>

                    <div className="summary-content">
                        <h4 className="summary-title">{summaryData.trip_name}</h4>

                        <div className="rating-section">
                            <div className="stars">
                                {renderStars(summaryData.review_rate)}
                            </div>
                            <span className="rating-value">{summaryData.review_rate}</span>
                        </div>

                        <div className="summary-details">
                            {summaryData.pickup_address && (
                                <div className="detail-item">
                                    <FaMapMarkerAlt className="detail-icon" />
                                    <p className="detail-text">{summaryData.pickup_address}</p>
                                </div>
                            )}

                            {/* Trip Date */}
                            <div className="detail-item">
                                <FaCalendarAlt className="detail-icon" />
                                <p className="detail-text">
                                    <strong>{t('bookings.tripDate')}:</strong> {summaryData.trip_datestr}
                                </p>
                            </div>

                            {/* Return Date - Only show if it exists */}
                            {summaryData.trip_return_datestr && (
                                <div className="detail-item">
                                    <FaCalendarAlt className="detail-icon" />
                                    <p className="detail-text">
                                        <strong>{t('bookings.returnDate')}:</strong> {summaryData.trip_return_datestr}
                                    </p>
                                </div>
                            )}

                            <div className="detail-item">
                                <FaUsers className="detail-icon" />
                                <p className="detail-text">{getParticipantsText()}</p>
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

                            {/* <div className="detail-item">
                                    <FaPencilAlt className="detail-icon" />
                                    <p className="detail-text link-text">{bookingData.changeDetails}</p>
                                </div> */}

                            <div className="detail-item">
                                <FaIdCard className="detail-icon" />
                                <p className="detail-text">
                                    {summaryData.booking_status}
                                </p>
                            </div>

                            {summaryData.cancelation_policy && (
                                <div className="detail-item">
                                    <FaRegCalendarCheck className="detail-icon" />
                                    <p className="detail-text">
                                        {summaryData.cancelation_policy}
                                    </p>
                                </div>
                            )}

                            {renderExtras()}

                            {renderObligatoryExtras()}

                            <div className="detail-item">
                                <FaMoneyBillWave className="detail-icon" />
                                <p className="detail-text">{t('bookings.resevePay')}</p>
                            </div>

                            {/* <div className="detail-item">
                                <FaGift className="detail-icon" />
                                <p className="detail-text link-text" onClick={handleGiftCodeClick}>
                                    {t('bookings.giftCode.enterCode')}
                                </p>
                            </div> */}
                        </div>

                        {/* {showGiftCode && (
                            <div className="gift-code-section">
                                <div className="gift-code-input-container">
                                    <div className="gift-code-input-wrapper">
                                        <input
                                            type="text"
                                            className="gift-code-input"
                                            value={giftCode}
                                            onChange={(e) => setGiftCode(e.target.value)}
                                            placeholder={t('bookings.giftCode.placeholder')}
                                        />
                                        <button className="redeem-button" onClick={handleRedeem}>
                                            {t('bookings.giftCode.redeem')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )} */}

                        <div className="total-section">
                            <div className="total-row">
                                <span className="total-label">{t('bookings.orderSummary.total')}</span>
                                <span className="total-price">
                                    {summaryData.total_price ? `${summaryData.total_price} €` : 0}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Error Popup */}
            {showPopup && (
                <PopUp
                    show={showPopup}
                    closeAlert={() => setShowPopup(false)}
                    msg={popupMessage}
                    type={popupType}
                    showConfirmButton={true}
                />
            )}
        </>
    );
};

export default OrderSummary;