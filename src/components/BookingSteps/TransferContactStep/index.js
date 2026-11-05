import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Form, Button } from "react-bootstrap";
import PhoneInput from "react-phone-number-input";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import { FaCalendarAlt, FaChevronDown } from "react-icons/fa";
import { checkAvailability } from "../../../redux/Slices/bookingSlice";
import { confirmTransferBooking } from "../../../redux/Slices/confirmSlice";
import BookingModal from "../../Shared/BookingModal";
import PopUp from "../../Shared/popup/PopUp";
import LoadingPage from "../../Loader/LoadingPage";
import TransferSummaryCard from "./TransferSummaryCard";

// Date button shared by the pickup and return date pickers.
const DateButton = React.forwardRef(({ value, onClick, placeholder }, ref) => (
  <Button
    variant="light"
    className="transfer-date-btn w-100"
    onClick={onClick}
    ref={ref}
  >
    <div className="d-flex align-items-center">
      <FaCalendarAlt className="me-2" />
      {value || placeholder}
    </div>
    <FaChevronDown />
  </Button>
));

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const endOfDay = () => {
  const d = new Date();
  d.setHours(23, 59, 0, 0);
  return d;
};

const formatDateTimeForAPI = (dt) => {
  if (!dt) return "";
  const pad = (n) => n.toString().padStart(2, "0");
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
};

// Third step of the transfer booking flow: contact details and booking confirmation.
const TransferContactStep = ({ MapData }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const currentLang = localStorage.getItem("lang") || "en";

  const { loading: bookingLoading } = useSelector((state) => state.booking);
  const { loading: confirmLoading, error: confirmError } = useSelector(
    (state) => state.confirmBooking,
  );

  const [contactInfo, setContactInfo] = useState({
    fullName: [user?.firstName, user?.lastName].filter(Boolean).join(" "),
    email: user?.email || "",
    phone: user?.phoneNumber || "",
    nationality: "",
  });
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [selectedReturnDateTime, setSelectedReturnDateTime] = useState(null);
  const [totalPax, setTotalPax] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleInputChange = (field, value) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = t("bookings.contact.errors.required");
    const newErrors = {};

    if (!contactInfo.fullName?.trim()) newErrors.fullName = required;

    if (!contactInfo.email?.trim()) {
      newErrors.email = required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      newErrors.email = t("bookings.contact.errors.invalidEmail");
    }

    if (!contactInfo.phone) newErrors.phone = required;
    if (!contactInfo.nationality?.trim()) newErrors.nationality = required;
    if (!String(totalPax).trim()) newErrors.totalPax = required;
    if (!selectedDateTime) newErrors.selectedDateTime = required;

    if (MapData?.isTwoWay) {
      if (!selectedReturnDateTime) {
        newErrors.selectedReturnDateTime = required;
      } else if (selectedDateTime && selectedReturnDateTime <= selectedDateTime) {
        newErrors.selectedReturnDateTime = t("Transfer.returnDateBeforePickup");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // On the current day only allow times at least 5 minutes ahead.
  const getMinTime = () => {
    const ref = selectedDateTime || new Date();
    if (ref.toDateString() === new Date().toDateString()) {
      const min = new Date();
      min.setMinutes(min.getMinutes() + 5);
      return min;
    }
    return startOfToday();
  };

  const getMinReturnDate = () => {
    if (selectedDateTime) {
      const min = new Date(selectedDateTime);
      min.setHours(0, 0, 0, 0);
      return min;
    }
    return startOfToday();
  };

  // Return time must be after pickup when both are on the same day.
  const getMinReturnTime = () => {
    const ref = selectedReturnDateTime || selectedDateTime || new Date();
    if (selectedDateTime && ref.toDateString() === selectedDateTime.toDateString()) {
      const min = new Date(selectedDateTime);
      min.setMinutes(min.getMinutes() + 30);
      return min;
    }
    if (ref.toDateString() === new Date().toDateString()) {
      const min = new Date();
      min.setMinutes(min.getMinutes() + 5);
      return min;
    }
    return startOfToday();
  };

  const handleConfirm = async () => {
    if (!validateForm()) return;

    try {
      const clientId = user?.id;
      const bookingData = {
        id: 0,
        trip_id: 0,
        client_id: clientId,
        client_email: contactInfo.email,
        client_phone: contactInfo.phone,
        client_nationality: contactInfo.nationality,
        booking_notes: notes,
        client_name: contactInfo.fullName,
        total_pax: totalPax,
        child_num: 0,
        infant_num: 0,
        trip_code: "Transfer",
        trip_type: 2,
        booking_dateStr: formatDateTimeForAPI(selectedDateTime),
        trip_dateStr: formatDateTimeForAPI(selectedDateTime),
        currency_code: "EUR",
        pickup_address: MapData?.pickup_address,
        booking_status: 1,
        total_price: MapData?.totalPrice,
        is_two_way: MapData?.isTwoWay,
        trip_return_dateStr: MapData?.isTwoWay
          ? formatDateTimeForAPI(selectedReturnDateTime)
          : null,
        child_ages: "",
        pricing_type: 0,
        childAgesArr: [],
        pickup_lat: MapData?.pickup_lat,
        pickup_long: MapData?.pickup_long,
        drop_address: MapData?.drop_address,
        drop_lat: MapData?.drop_lat,
        drop_long: MapData?.drop_long,
        route_distance: MapData?.distance,
        route_price: MapData?.totalPrice,
        trip_name: localStorage.getItem("horizon_pos_vehicle_name"),
        vehicle_id: localStorage.getItem("horizon_pos_vehicle_id"),
      };

      const availability = await dispatch(checkAvailability(bookingData)).unwrap();

      if (availability?.success) {
        const result = await dispatch(
          confirmTransferBooking({
            booking_id: availability.idOut,
            client_id: clientId,
            lang_code: currentLang,
            ClientEmail: contactInfo.email,
          }),
        ).unwrap();

        if (result === true) setShowBookingModal(true);
      }
    } catch (error) {
      setPopupMessage(
        typeof error === "string"
          ? error
          : error?.message || t("Transfer.genericError"),
      );
      setShowPopup(true);
    }
  };

  useEffect(() => {
    if (confirmError) {
      setPopupMessage(
        typeof confirmError === "string"
          ? confirmError
          : t("bookings.contact.bookingConfirmationFailed"),
      );
      setShowPopup(true);
    }
  }, [confirmError, t]);

  if (bookingLoading || confirmLoading) {
    return <LoadingPage />;
  }

  return (
    <>
      <div className="transfer-contact">
        <TransferSummaryCard
          pickupAddress={MapData?.pickup_address}
          dropAddress={MapData?.drop_address}
          distance={MapData?.distance}
          duration={MapData?.duration}
          price={MapData?.totalPrice}
        />
        <hr />

        <h2 className="transfer-contact-title">{t("bookings.contact.title")}</h2>
        <div className="transfer-required-notice">
          {t("bookings.contact.requiredFields")}
        </div>

        <Form className="transfer-contact-form">
          <Form.Group className="transfer-field">
            <Form.Control
              type="text"
              value={contactInfo.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              placeholder={t("bookings.contact.fullNamePlaceholder")}
              className={`transfer-input ${errors.fullName ? "is-invalid" : ""}`}
            />
            {errors.fullName && <div className="error-message">{errors.fullName}</div>}
          </Form.Group>

          <Form.Group className="transfer-field">
            <Form.Control
              type="email"
              value={contactInfo.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder={t("bookings.contact.emailPlaceholder")}
              className={`transfer-input ${errors.email ? "is-invalid" : ""}`}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </Form.Group>

          <Form.Group className="transfer-field">
            <PhoneInput
              international
              countryCallingCodeEditable={false}
              defaultCountry="EG"
              value={contactInfo.phone}
              onChange={(value) => handleInputChange("phone", value)}
              placeholder={t("bookings.contact.phonePlaceholder")}
              className={`transfer-phone ${errors.phone ? "is-invalid" : ""}`}
            />
            {errors.phone && <div className="error-message">{errors.phone}</div>}
          </Form.Group>

          <Form.Group className="transfer-field">
            <Form.Control
              type="text"
              value={contactInfo.nationality}
              onChange={(e) => handleInputChange("nationality", e.target.value)}
              placeholder={t("bookings.contact.nationalityPlaceholder")}
              className={`transfer-input ${errors.nationality ? "is-invalid" : ""}`}
            />
            {errors.nationality && (
              <div className="error-message">{errors.nationality}</div>
            )}
          </Form.Group>

          <Form.Group className="transfer-field">
            <DatePicker
              selected={selectedDateTime}
              onChange={(date) => setSelectedDateTime(date)}
              customInput={
                <DateButton placeholder={t("booking.date.selectDateTime")} />
              }
              minDate={startOfToday()}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={30}
              minTime={getMinTime()}
              maxTime={endOfDay()}
              timeCaption={t("booking.date.time")}
              dateFormat="EEE, MMM d, yyyy HH:mm"
              showPopperArrow={false}
              popperClassName="transfer-datepicker-popper"
            />
            {errors.selectedDateTime && (
              <div className="error-message">{errors.selectedDateTime}</div>
            )}
          </Form.Group>

          {MapData?.isTwoWay && (
            <Form.Group className="transfer-field">
              <DatePicker
                selected={selectedReturnDateTime}
                onChange={(date) => setSelectedReturnDateTime(date)}
                customInput={
                  <DateButton placeholder={t("booking.date.selectReturnDateTime")} />
                }
                minDate={getMinReturnDate()}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={30}
                minTime={getMinReturnTime()}
                maxTime={endOfDay()}
                timeCaption={t("booking.date.time")}
                dateFormat="EEE, MMM d, yyyy HH:mm"
                showPopperArrow={false}
                popperClassName="transfer-datepicker-popper"
              />
              {errors.selectedReturnDateTime && (
                <div className="error-message">{errors.selectedReturnDateTime}</div>
              )}
            </Form.Group>
          )}

          <Form.Group className="transfer-field">
            <Form.Control
              type="number"
              min={1}
              max={20}
              value={totalPax}
              onChange={(e) => setTotalPax(e.target.value)}
              placeholder={t("Transfer.totalPax")}
              className={`transfer-input ${errors.totalPax ? "is-invalid" : ""}`}
            />
            {errors.totalPax && <div className="error-message">{errors.totalPax}</div>}
          </Form.Group>

          <Form.Group className="transfer-field">
            <Form.Control
              as="textarea"
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("bookings.contact.notesPlaceholder")}
              className="transfer-input transfer-notes"
            />
          </Form.Group>

          <div className="transfer-disclaimer">
            {t("bookings.contact.disclaimer")}
          </div>

          <button
            type="button"
            className="transfer-confirm-btn"
            onClick={handleConfirm}
          >
            {t("bookings.contact.confirmButton")}
          </button>
        </Form>
      </div>

      {showPopup && (
        <PopUp
          show={showPopup}
          closeAlert={() => setShowPopup(false)}
          msg={popupMessage}
          type="alert"
          showConfirmButton={true}
        />
      )}

      {showBookingModal && <BookingModal />}
    </>
  );
};

export default TransferContactStep;
