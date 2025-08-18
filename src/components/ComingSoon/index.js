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
          {/* <h1 className="mainTitle">{t("NotFound.title")}</h1> */}
          <img src="/images/comingSoon.png" alt="404 Error Illustration" className="illustration" />
          <Button onClick={() => navigate("/")} variant="primary" className="goBackButton">
            {t("NotFound.backBtn")}
          </Button>
        </div>
      </Container>    
    </>
  );
};

export default ComingSoon;
