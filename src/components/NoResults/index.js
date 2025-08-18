import React from "react";
import { useTranslation } from 'react-i18next';
import { Container, Button } from "react-bootstrap";
const NoResults = () => {
  const { t } = useTranslation(); // Hook for multilingual translations
  return (
    <>
      <Container className="pageContainer">
        <div className="contentWrapper">
        <img src="/images/no-results.png" alt={t("NoResults.title")} className="illustration" />
        <h1 className="mainTitle">{t("NoResults.title")}</h1>
        <p className="subText">{t("NoResults.subTitle")}</p>
        </div>
      </Container> 
    </>
  );
};

export default NoResults;