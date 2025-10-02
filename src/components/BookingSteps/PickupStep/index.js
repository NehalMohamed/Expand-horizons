import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaMinus, FaPlus } from 'react-icons/fa';
import PickupLocation from "./PickupLocation";
import { useDispatch, useSelector } from 'react-redux';
import { setPickupLocation } from '../../../redux/Slices/extrasSlice';
import { checkAvailability, resetBookingOperation } from '../../../redux/Slices/bookingSlice';
import { calculateBookingPrice, resetCalculation } from '../../../redux/Slices/priceCalculationSlice';
import { getTripExtras, assignExtraToBooking } from '../../../redux/Slices/extrasSlice';
import { triggerRefresh } from '../../../redux/Slices/bookingSummarySlice';
import PopUp from '../../Shared/popup/PopUp';
import LoadingPage from '../../Loader/LoadingPage';

const PickupStep = ({ onNext, tripData, availabilityData , childAges }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    // const { availabilityData } = useSelector((state) => state.booking);
    const { loading: extrasLoading, error: extrasError, tripExtras } = useSelector((state) => state.extras);
    const { loading: bookingLoading, error: bookingError } = useSelector((state) => state.booking);
    const { loading: calculationLoading, error: calculationError, success: calculationSuccess } = useSelector((state) => state.priceCalculation);

    const currentLang = useSelector((state) => state.language.currentLang) || "en";
    const { summaryData } = useSelector((state) => state.bookingSummary);

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState('alert');
    const [extraCounts, setExtraCounts] = useState({});
    const [isProcessingExtras, setIsProcessingExtras] = useState(false);
    const [pickupLocation, setPickupLocation] = useState({
        enabled: false,
        address: '',
        latitude: null,
        longitude: null
    });

    // Fetch available extras when component mounts
    useEffect(() => {
        if (tripData?.trip_id) {
            dispatch(getTripExtras({
                trip_id: tripData.trip_id,
                lang_code: currentLang,
                isExtra: true
            }));
        }
    }, [tripData, currentLang, dispatch]);

    // Handle errors
    useEffect(() => {
        if (extrasError || bookingError || calculationError) {
            setPopupMessage(extrasError || bookingError || calculationError || t("bookings.generalError"));
            setPopupType('alert');
            setShowPopup(true);
        }
    }, [extrasError, bookingError, calculationError, t]);

    useEffect(() => {
        if (tripExtras.length > 0) {
            const initialCounts = {};
            tripExtras.forEach(extra => {
                initialCounts[extra.facility_id] = 0;
            });
            setExtraCounts(initialCounts);
        }
    }, [tripExtras]);

    const handleExtraCountChange = async (extraId, change) => {
        const newCount = Math.max(0, (extraCounts[extraId] || 0) + change);
        setExtraCounts(prev => ({
            ...prev,
            [extraId]: newCount
        }));

        if (availabilityData?.idOut) {
            setIsProcessingExtras(true);
            try {
                const bookingId = availabilityData.idOut;
                const extra = tripExtras.find(e => e.facility_id === parseInt(extraId));

                if (extra) {
                    // Prepare the extra assignment
                    const extraAssignment = {
                        id: 0,
                        booking_id: bookingId,
                        extra_id: parseInt(extraId),
                        created_at: null,
                        created_by: "",
                        updated_at: null,
                        extra_count: newCount
                    };

                    // Assign/update the extra to the booking
                    await dispatch(assignExtraToBooking([extraAssignment])).unwrap();

                    // Prepare extras list for calculation
                    const extrasList = [];
                    for (const [id, count] of Object.entries({...extraCounts, [extraId]: newCount })) {
                        if (count > 0) {
                            const ext = tripExtras.find(e => e.facility_id === parseInt(id));
                            if (ext) {
                                extrasList.push({
                                    extra_price: ext.extra_price,
                                    extra_count: count
                                });
                            }
                        }
                    }

                    // Calculate updated price with extras
                    const calculationData = {
                        booking_id: bookingId,
                        trip_id: tripData?.trip_id,
                        adult_num: summaryData.total_pax,
                        child_num: summaryData.child_num,
                        currency_code: "EUR",
                        extra_lst: extrasList,
                        childAges: childAges
                    };

                    // Dispatch price calculation
                    await dispatch(calculateBookingPrice(calculationData)).unwrap();
                    dispatch(triggerRefresh());
                }
            } catch (error) {
                setPopupMessage(error || t('bookings.extrasAssignmentError'));
                setPopupType('alert');
                setShowPopup(true);

                // Revert the count change if there was an error
                setExtraCounts(prev => ({
                    ...prev,
                    [extraId]: prev[extraId] - change
                }));
            } finally {
                setIsProcessingExtras(false);
            }
        }
    };

    const handlePickupChange = (val) => {
        setPickupLocation(val);
    };

    const handleNext = async () => {
        try {
            const bookingId = availabilityData?.idOut;

            if (!bookingId) {
                // setPopupMessage(t('bookings.noBookingIdError'));
                // setPopupType('error');
                // setShowPopup(true);
                return;
            }

            const user = JSON.parse(localStorage.getItem("user"));
            const clientId = user?.id;

            const bookingData = {
                id: bookingId,
                trip_id: tripData?.trip_id,
                client_id: clientId,
                client_email: "",
                client_name: "",
                total_pax: summaryData.total_pax,
                booking_code: "",
                booking_date: null,
                child_num: summaryData.child_num,
                total_price: summaryData?.total_price,
                pickup_time: "",
                booking_status: 1,
                trip_date: null,
                booking_notes: "",
                trip_code: summaryData?.trip_code_auto,
                infant_num: summaryData.infant_num,
                pickup_address: pickupLocation.address,
                client_phone: "",
                booking_code_auto: "",
                client_nationality: "",
                gift_code: "",
                trip_type: summaryData?.trip_type,
                booking_dateStr: summaryData.booking_datestr,
                trip_dateStr: summaryData.trip_datestr,
                currency_code: summaryData?.currency_code
            };

            await dispatch(checkAvailability(bookingData)).unwrap();

            onNext();

        } catch (error) {
            setPopupMessage(error);
            setPopupType('alert');
            setShowPopup(true);
        }
    };

    if (extrasLoading || bookingLoading || calculationLoading) {
        return <LoadingPage />;
    }

    return (
        <>
            <div className="pickup-step">
                <PickupLocation onChange={handlePickupChange} value={pickupLocation} />

                {tripExtras.length > 0 && <div className="extras-section">
                    <h2 className="extras-title">{t('bookings.pickup.addExtras')}</h2>

                    <div className="extras-list">
                        {tripExtras.map((extra) => (
                            <div key={extra.facility_id} className="extra-item">
                                <div className="extra-info">
                                    <div className="extra-name">{extra.facility_name}</div>
                                    <div className="extra-subtitle">{extra.facility_desc}</div>
                                    <div className="extra-price">€{extra.extra_price}</div>
                                </div>
                                <div className="extra-controls">
                                    <button
                                        className="counter-btn minus-btn"
                                        onClick={() => handleExtraCountChange(extra.facility_id, -1)}
                                        disabled={extraCounts[extra.facility_id] === 0 || isProcessingExtras}
                                    >
                                        <FaMinus />
                                    </button>
                                    <span className="counter-value">{extraCounts[extra.facility_id] || 0}</span>
                                    <button
                                        className="counter-btn add-btn"
                                        onClick={() => handleExtraCountChange(extra.facility_id, 1)}
                                        disabled={isProcessingExtras}
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                }

                {/* Next Button */}
                <div className="next-button-section">
                    <button className="next-btn" onClick={handleNext} disabled={isProcessingExtras}>
                        {tripData?.trip_type == 3?t('bookings.pickup.nextBtnAgree'):t('bookings.pickup.nextBtn')}
                    </button>
                </div>
            </div>

            {/* Popup for errors */}
            {showPopup && (
                <PopUp
                    show={showPopup}
                    closeAlert={() => {
                        setShowPopup(false);
                        dispatch(resetBookingOperation());
                        dispatch(resetCalculation());
                    }}
                    msg={popupMessage}
                    type={popupType}
                    showConfirmButton={true}
                />
            )}
        </>
    );
};

export default PickupStep;