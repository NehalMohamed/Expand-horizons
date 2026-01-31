import React from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
const NoWishList = () => {
  const navigate = useNavigate(); // React Router hook to navigate between pages
  const { t } = useTranslation(); // Hook for multilingual translations
  return (
    <>
      <Container className="wishPageContainer">
        <div className="contentWrapper">
          <img 
          src="/images/wishlist.png" 
          alt="wishlist Illustration" 
          className="illustration"
          loading="lazy" 
          decoding="async" 
           />
           <span className="mainTitle">{t("wishlist.emptyWishlist")}</span>
           <span className="subTitle">{t("wishlist.saveWishList")}</span>
          <Button onClick={() => navigate("/")} variant="primary" className="goBackButton">
            {t("wishlist.BackBtn")}
          </Button>
        </div>
      </Container>    
    </>
  );
};

export default NoWishList;
