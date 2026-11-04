import React, { useState } from "react";
import { Container, Button } from "react-bootstrap";
import { MultiStepForm, Step } from "react-multi-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CarCategoriesPage from "../../components/CarCategories/CarCategories";
import BookingMapPage from "./MapPage/BookingMapPage";

function TransferBooking() {
  const [active, setActive] = useState(1);
  const [formLength, setFormLength] = useState(3);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const SaveBooking = () => {};
  return (
    <section className="transfer_section">
      <Container>
        {" "}
        <MultiStepForm activeStep={active}>
          <Step>
            <CarCategoriesPage goToNextStep={() => setActive(active + 1)} />
          </Step>
          <Step>
            <BookingMapPage goToNextStep={() => setActive(active + 1)} />
          </Step>
          <Step>
            <div>Form</div>
          </Step>
        </MultiStepForm>
        {/* <div className="steps_btns">
          {active !== 1 && (
            <Button
              onClick={() => setActive(active - 1)}
              className="stepbtn roundedBtn SmallWidthBtn secondryBtn"
            >
              {t("Transfer.Previous")}
            </Button>
          )}
          {active !== formLength && (
            <Button
              className="stepbtn roundedBtn SmallWidthBtn primaryBtn"
              onClick={() => setActive(active + 1)}
            >
              {t("Transfer.Next")}
            </Button>
          )}
          {active == formLength && (
            <Button
              className="stepbtn roundedBtn SmallWidthBtn secondryBtn"
              onClick={SaveBooking}
            >
              {t("Transfer.SaveBooking")}
            </Button>
          )}
        </div> */}
      </Container>
    </section>
  );
}

export default TransferBooking;
