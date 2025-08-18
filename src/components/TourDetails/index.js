import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useTripData } from '../../contexts/TripContext';
import { useTranslation } from "react-i18next";
import parse from 'html-react-parser';

const TourDetails = () => {
  const { t } = useTranslation();
  const tripData = useTripData();

  const renderHtmlContent = (htmlString) => {
    if (!htmlString) return null;
    return (
      <div className="html-content">
        {parse(htmlString)}
      </div>
    );
  };

  const renderSection = (title, content) => {
    if (!content) return null;

    return (
      <div className="detail-section">
        <Row>
          <Col md={3} className="section-title">
            <span>{title}</span>
          </Col>
          <Col md={9}>
            {typeof content === 'string' ? (
              renderHtmlContent(content)
            ) : (
              <ul className="detail-list">
                {Array.isArray(content) ? (
                  content.map((item, index) => (
                    <li key={index}>{renderHtmlContent(item)}</li>
                  ))
                ) : (
                  renderHtmlContent(content)
                )}
              </ul>
            )}
          </Col>
        </Row>
        <hr />
      </div>
    );
  };

  return (
    <section className="tour-details-section">
      <Container>
        <hr />
        {renderSection(t("tripDetails.highlights"), tripData?.trip_highlight)}
        {renderSection(t("tripDetails.included"), tripData?.trip_includes)}
        {renderSection(t("tripDetails.notIncluded"), tripData?.trip_not_includes)}
        {renderSection(t("tripDetails.dontForget"), tripData?.important_info)}
        {renderSection(t("tripDetails.additionalInfo"), tripData?.trip_details)}

        {/* Pricing */}
        <div className="pricing-section text-center mt-4">
          <h2 className="price-title">
            {t("tripDetails.priceFrom")} {tripData.trip_sale_price} {tripData.currency_code} P.p
          </h2>
          <Button variant="success" size="lg" className="mt-2">
            {t("tripDetails.bookNow")}
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default TourDetails;
