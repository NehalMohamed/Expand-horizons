import React, { useState } from 'react';
import { Container, Row, Col, Button, Dropdown, Form } from 'react-bootstrap';
import { FaCalendarAlt, FaGlobe, FaUsers, FaMinus, FaPlus, FaChevronDown } from 'react-icons/fa';
import { useTranslation } from "react-i18next";
import DatePicker from 'react-datepicker';

const BookingSelection = () => {
    const { t } = useTranslation();
    const [participants, setParticipants] = useState({
        adults: 1,
        children: 0,
        infants: 0
    });
    const [selectedDate, setSelectedDate] = useState(null);
    //  const [selectedLanguage, setSelectedLanguage] = useState(t('booking.language.english'));
    const [showParticipants, setShowParticipants] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // const languages = [
    //     t('booking.language.english'), 
    //     t('booking.language.spanish'), 
    //     t('booking.language.french'), 
    //     t('booking.language.german'), 
    //     t('booking.language.italian')
    // ];

    const handleParticipantChange = (type, action) => {
        setParticipants(prev => ({
            ...prev,
            [type]: action === 'increment'
                ? prev[type] + 1
                : Math.max(
                    type === 'adults' ? 1 : 0, 
                    prev[type] - 1
                )
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

    const handleCheckAvailability = () => {
        console.log('Checking availability:', {
            participants,
            date: selectedDate,
            // language: selectedLanguage
        });
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

    return (
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
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="booking-selection__dropdown w-100">
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
                            >
                                 {t('booking.checkAvailability')}
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Container>
        </div>
    );
};

export default BookingSelection;