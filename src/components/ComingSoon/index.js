import React from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
const ComingSoon = () => {
  const navigate = useNavigate(); // React Router hook to navigate between pages
  const { t } = useTranslation(); // Hook for multilingual translations
  return (
    <>
      <Container className="pageContainer">
        <div className="contentWrapper">
          <img src="/images/comingSoon.png" alt="coming soon Illustration" className="illustration" />
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
