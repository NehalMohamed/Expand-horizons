// Module overview: Coordinates the step-based booking checkout experience.
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import StepIndicator from '../components/StepIndicator';
import OrderSummary from '../components/OrderSummary';
import PickupStep from '../components/BookingSteps/PickupStep';
import AgreementStep from '../components/BookingSteps/AgreementStep';
import ContactStep from '../components/BookingSteps/ContactStep';
import PaymentStep from '../components/BookingSteps/PaymentStep';
import { clearBookingSummary } from '../redux/Slices/bookingSummarySlice';

// Component entry point for checkout steps and shared booking state handoff.
const BookingPage = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState(1);
  const [tripData, setTripData] = useState(null);
  const [availabilityData, setAvailabilityData] = useState(null);
  const [childAges, setchildAges] = useState(null)
  const [tripType, setTripType] = useState(1);

  useEffect(() => {
    if (state?.trip) {
      setTripData(state.trip);
      setTripType(state.trip.trip_type || 1);
    }

    if (state?.availabilityData) {
      setAvailabilityData(state?.availabilityData);
    }

    if (state?.childAges) {
      setchildAges(state?.childAges);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Clear stale summary data when leaving checkout.
    return () => {
      dispatch(clearBookingSummary());
    };
  }, [state, dispatch]);

  // Advances the local step index while respecting trip-type step count.
  const handleNextStep = () => {
    const maxSteps = tripType === 3 ? 4 : 3;

    if (currentStep < maxSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Maps the current step to the correct component; non-diving trips skip
  // agreement and jump directly to contact/payment flow.
  const renderCurrentStep = () => {
    let adjustedStep = currentStep;

    if (tripType !== 3 && currentStep > 1) {
      // For non-diving trips, skip the agreement step
      adjustedStep = currentStep + 1;
    }

    switch (adjustedStep) {
      case 1:
        return (
          <PickupStep
            onNext={handleNextStep}
            tripData={tripData}
            availabilityData={availabilityData}
            childAges = {childAges}
          />
        );
      case 2:
        if (tripType === 3) {
          return (
            <AgreementStep
              onNext={handleNextStep}
              tripData={tripData}
            />
          );
        } else {
          // For non-diving trips, step 2 should be contact
          return (
            <ContactStep
              onNext={handleNextStep}
              tripData={tripData}
              availabilityData={availabilityData}
              childAges = {childAges}
            />
          );
        }
      case 3:
        if (tripType === 3) {
          return (
            <ContactStep
              onNext={handleNextStep}
              tripData={tripData}
              availabilityData={availabilityData}
              childAges = {childAges}
            />
          );
        } else {
         return (
            <ContactStep
              onNext={handleNextStep}
              tripData={tripData}
              availabilityData={availabilityData}
              childAges = {childAges}
            />
          );
        }
      case 4:
      default:
        return null;
    }
  };

  return (
    <div className="booking-page">
      <Container>
        <StepIndicator currentStep={currentStep} tripType={tripType} />

        <Row>
          <Col lg={7}>
            <div className="booking-content">
              {renderCurrentStep()}
            </div>
          </Col>

          <Col lg={5}>
            <OrderSummary
              availabilityData={availabilityData}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BookingPage;
