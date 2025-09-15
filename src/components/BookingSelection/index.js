import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Dropdown } from 'react-bootstrap';
import { FaCalendarAlt, FaUsers, FaMinus, FaPlus, FaChevronDown } from 'react-icons/fa';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import { checkAvailability, resetBookingOperation } from '../../redux/Slices/bookingSlice';
import { calculateBookingPrice, resetCalculation } from '../../redux/Slices/priceCalculationSlice';
import PopUp from '../Shared/popup/PopUp';
import LoadingPage from '../Loader/LoadingPage';

const BookingSelection = ({ tripData }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, error, success, availabilityData } = useSelector((state) => state.booking);
    const { loading: calculationLoading, error: calculationError, success: calculationSuccess } = useSelector((state) => state.priceCalculation);

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState('success');

    const [participants, setParticipants] = useState({
        adults: 1,
        children: 0,
        infants: 0
    });
    const [selectedDate, setSelectedDate] = useState(null);
    //  const [selectedLanguage, setSelectedLanguage] = useState(t('booking.language.english'));
    const [showParticipants, setShowParticipants] = useState(false);
    
    // Calculate the minimum selectable date (today + release_days)
    const minDate = new Date();
    if (tripData?.release_days) {
        minDate.setDate(minDate.getDate() + parseInt(tripData.release_days));
    }

    // Calculate total participants
    const totalParticipants = participants.adults + participants.children + participants.infants;
    
    // Check if participants exceed max capacity
    const exceedsMaxCapacity = tripData?.trip_max_capacity && totalParticipants > parseInt(tripData.trip_max_capacity);

    // Handle API errors and success
    useEffect(() => {
        if (error) {
            setPopupMessage(error || t("booking.availabilityError"));
            setPopupType('error');
            setShowPopup(true);
            dispatch(resetBookingOperation());
        } else if (calculationError) {
            setPopupMessage(calculationError || t("booking.priceCalculationError"));
            setPopupType('error');
            setShowPopup(true);
            dispatch(resetCalculation());
        } else if (success && availabilityData && calculationSuccess) {
            // Navigate to checkout after successful price calculation
            navigate("/checkout", {
                state: {
                    availabilityData: availabilityData,
                    trip: tripData
                }
            });
        }
    }, [error, calculationError, success, availabilityData, calculationSuccess, t, dispatch, navigate]);

    const handleParticipantChange = (type, action) => {
        // Calculate what the new total would be
        const newValue = action === 'increment' 
            ? participants[type] + 1 
            : Math.max(type === 'adults' ? 1 : 0, participants[type] - 1);
            
        const newTotal = totalParticipants - participants[type] + newValue;
        
        // Check if this would exceed max capacity
        if (tripData?.trip_max_capacity && newTotal > parseInt(tripData.trip_max_capacity)) {
            setPopupMessage(t('booking.maxCapacityExceeded', { maxCapacity: tripData.trip_max_capacity }));
            setPopupType('error');
            setShowPopup(true);
            return;
        }

        setParticipants(prev => ({
            ...prev,
            [type]: newValue
        }));
    };

    const getParticipantText = () => {
        const { adults, children, infants } = participants;

        if (adults === 1 && children === 0 && infants === 0) {
            return t('booking.participants.adultSingle');
        }

        if (adults > 1 && children === 0 && infants === 0) {
            return t('booking.participants.adults', { count: adults });
        }

        if (adults === 0 && children > 0 && infants === 0) {
            return t('booking.participants.children', { count: children });
        }

        if (adults === 0 && children === 0 && infants > 0) {
            return t('booking.participants.infants', { count: infants });
        }

        return t('booking.participants.mixed', { adults, children, infants });
    };

    const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
        <Button
            variant="light"
            className="booking-selection__button w-100"
            onClick={onClick}
            ref={ref}
        >
            <div className="d-flex align-items-center">
                <FaCalendarAlt className="booking-selection__icon me-2" />
                {value || t('booking.date.selectDate')}
            </div>
            <FaChevronDown className="booking-selection__chevron" />
        </Button>
    ));

    // const handleLanguageSelect = (language) => {
    //     setSelectedLanguage(language);
    // };

    const handleCheckAvailability = async () => {
        if (!selectedDate) {
            setPopupMessage(t('booking.dateRequired'));
            setPopupType('error');
            setShowPopup(true);
            return;
        }

        // Check if selected date is before the minimum allowed date
        if (selectedDate < minDate) {
            setPopupMessage(t('booking.invalidDate', { releaseDays: tripData?.release_days || 0 }));
            setPopupType('error');
            setShowPopup(true);
            return;
        }

        // Check if participants exceed max capacity
        if (exceedsMaxCapacity) {
            setPopupMessage(t('booking.maxCapacityExceeded', { maxCapacity: tripData.trip_max_capacity }));
            setPopupType('error');
            setShowPopup(true);
            return;
        }

        // Format date as YYYY-MM-DD
        const formattedDate = selectedDate.toISOString().split('T')[0];

        // Get client ID from localStorage or use a fallback
        const user = JSON.parse(localStorage.getItem("user"));
        const clientId = user?.id;
        const clientEmail = user?.email || "";

        // Prepare booking data according to API specification
        const bookingData = {
            id: 0,
            trip_id: tripData?.trip_id,
            client_id: clientId,
            client_email: "",
            client_name: "",
            total_pax: participants.adults,
            booking_code: "",
            booking_date: null,
            child_num: participants.children,
            total_price: 0,
            pickup_time: "",
            booking_status: 1,
            trip_date: null,
            booking_notes: "",
            trip_code: tripData?.trip_code_auto,
            infant_num: participants.infants,
            pickup_address: "",
            client_phone: "",
            booking_code_auto: "",
            client_nationality: "",
            gift_code: "",
            trip_type: tripData?.trip_type,
            booking_dateStr: "",
            trip_dateStr: formattedDate,
            currency_code: "EUR"
        };

        try {
            // First save the booking
            const result = await dispatch(checkAvailability(bookingData)).unwrap();

            // Then calculate initial price without extras
            const calculationData = {
                booking_id: result.idOut,
                trip_id: tripData?.trip_id,
                adult_num: participants.adults,
                child_num: participants.children,
                currency_code: "EUR",
                extra_lst: []
            };

            await dispatch(calculateBookingPrice(calculationData)).unwrap();

        } catch (err) {
            // Error is handled in useEffect
        }
    };

    // Custom Toggle for Participants Dropdown
    const ParticipantsToggle = React.forwardRef(({ children, onClick }, ref) => (
        <Button
            ref={ref}
            variant="light"
            className="booking-selection__button w-100"
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
            <div className="d-flex align-items-center">
                <FaUsers className="booking-selection__icon me-2" />
                {children}
            </div>
            <FaChevronDown className={`booking-selection__chevron ${showParticipants ? 'booking-selection__chevron--open' : ''}`} />
        </Button>
    ));

    // Filter dates that are before the minimum allowed date
    const filterDate = (date) => {
        return date >= minDate;
    };

    if (loading || calculationLoading) {
        return <LoadingPage />;
    }

    return (
        <>
            <div className="booking-selection">
                <Container>
                    <div className="booking-selection-content">
                        <h3 className="booking-selection__title">
                            {t('booking.title')}
                        </h3>

                        <Row className="g-3 mb-4">
                            {/* Participants Dropdown */}
                            <Col lg={6} md={6} sm={12}>
                                <Dropdown
                                    show={showParticipants}
                                    onToggle={(isOpen) => setShowParticipants(isOpen)}
                                >
                                    <Dropdown.Toggle as={ParticipantsToggle}>
                                        {getParticipantText()}
                                        {exceedsMaxCapacity && " ⚠️"}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className="booking-selection__dropdown w-100">
                                        {/* Show warning if max capacity is exceeded */}
                                        {exceedsMaxCapacity && (
                                            <div className="text-danger small p-2">
                                                {t('booking.maxCapacityExceeded', { maxCapacity: tripData.trip_max_capacity })}
                                            </div>
                                        )}
                                        
                                        {/* Adult Counter */}
                                        <div className="booking-selection__counter">
                                            <div className="booking-selection__counter-info">
                                                <div className="booking-selection__counter-title">{t('booking.participants.adult')}</div>
                                                <div className="booking-selection__counter-subtitle">({t('booking.participants.ageRangeAdults')})</div>
                                            </div>
                                            <div className="booking-selection__counter-controls">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="booking-selection__counter-btn"
                                                    onClick={() => handleParticipantChange('adults', 'decrement')}
                                                    disabled={participants.adults <= 1}
                                                >
                                                    <FaMinus />
                                                </Button>
                                                <span className="booking-selection__counter-value">
                                                    {participants.adults}
                                                </span>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    className="booking-selection__counter-btn"
                                                    onClick={() => handleParticipantChange('adults', 'increment')}
                                                    disabled={exceedsMaxCapacity}
                                                >
                                                    <FaPlus />
                                                </Button>
                                            </div>
                                        </div>

                                        <hr className="my-3" />

                                        {/* Child Counter */}
                                        <div className="booking-selection__counter">
                                            <div className="booking-selection__counter-info">
                                                <div className="booking-selection__counter-title">{t('booking.participants.child')}</div>
                                                <div className="booking-selection__counter-subtitle">({t('booking.participants.ageRangeChildren')})</div>
                                            </div>
                                            <div className="booking-selection__counter-controls">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="booking-selection__counter-btn"
                                                    onClick={() => handleParticipantChange('children', 'decrement')}
                                                    disabled={participants.children <= 0}
                                                >
                                                    <FaMinus />
                                                </Button>
                                                <span className="booking-selection__counter-value">
                                                    {participants.children}
                                                </span>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    className="booking-selection__counter-btn"
                                                    onClick={() => handleParticipantChange('children', 'increment')}
                                                    disabled={exceedsMaxCapacity}
                                                >
                                                    <FaPlus />
                                                </Button>
                                            </div>
                                        </div>

                                        <hr className="my-3" />

                                        {/* Infant Counter */}
                                        <div className="booking-selection__counter">
                                            <div className="booking-selection__counter-info">
                                                <div className="booking-selection__counter-title">{t('booking.participants.infant')}</div>
                                                <div className="booking-selection__counter-subtitle">({t('booking.participants.ageRangeInfants')})</div>
                                            </div>
                                            <div className="booking-selection__counter-controls">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="booking-selection__counter-btn"
                                                    onClick={() => handleParticipantChange('infants', 'decrement')}
                                                    disabled={participants.infants <= 0}
                                                >
                                                    <FaMinus />
                                                </Button>
                                                <span className="booking-selection__counter-value">
                                                    {participants.infants}
                                                </span>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    className="booking-selection__counter-btn"
                                                    onClick={() => handleParticipantChange('infants', 'increment')}
                                                    disabled={exceedsMaxCapacity}
                                                >
                                                    <FaPlus />
                                                </Button>
                                            </div>
                                        </div>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>

                            {/* Date Selector with react-datepicker */}
                            <Col lg={6} md={6} sm={12}>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    customInput={<CustomInput />}
                                     minDate={minDate}
                                    filterDate={filterDate}
                                    monthsShown={2}
                                    showPopperArrow={false}
                                    popperClassName="custom-datepicker-popper"
                                    inline={false}
                                    shouldCloseOnSelect={true}
                                    dateFormat="EEE, MMM d"
                                />
                            </Col>

                            {/* Language Selector */}
                            {/* <Col lg={4} md={12} sm={12}>
                            <Dropdown>
                                <Dropdown.Toggle
                                    variant="light"
                                    className="booking-selection__button w-100"
                                >
                                    <div className="d-flex align-items-center">
                                        <FaGlobe className="booking-selection__icon me-2" />
                                        {selectedLanguage}
                                    </div>
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="w-100">
                                    {languages.map((language) => (
                                        <Dropdown.Item
                                            key={language}
                                            onClick={() => handleLanguageSelect(language)}
                                            active={selectedLanguage === language}
                                            className="booking-selection__dropdown-item"
                                        >
                                            {language}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col> */}
                        </Row>

                        {/* Check Availability Button */}
                        <Row>
                            <Col>
                                <Button
                                    className="booking-selection__check-btn w-100"
                                    onClick={handleCheckAvailability}
                                    disabled={loading || exceedsMaxCapacity}
                                >
                                    {t('booking.checkAvailability')}
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </Container>

            </div>

            {/* Show popup for messages */}
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
                    autoClose={popupType === 'success'}
                    showConfirmButton={true}
                />
            )}
        </>
    );
};

export default BookingSelection;