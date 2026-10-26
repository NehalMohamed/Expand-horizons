// Module overview: ComingSoon component and its UI interaction logic.
import React from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
// Component: renders coming soon UI and related interactions.
const ComingSoon = ({ image = "/images/comingSoon.png" }) => {
  const navigate = useNavigate(); // React Router hook to navigate between pages
  const { t } = useTranslation(); // Hook for multilingual translations
  return (
    <>
      <Container className="pageContainer">
        <div className="contentWrapper">
          <img 
          src={image} 
          alt="coming soon Illustration" 
          className="illustration"
          loading="lazy" 
          decoding="async" 
           />
          <h1 className="mainTitle">{t("ComingSoon.title")}</h1>
          <Button onClick={() => navigate("/")} variant="primary" className="goBackButton">
            {t("ComingSoon.backBtn")}
          </Button>
        </div>
      </Container>    
    </>
  );
};

export default ComingSoon;
