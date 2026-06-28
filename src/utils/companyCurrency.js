import axios from "axios";
import api from "../api/axios";

const BASE_URL = process.env.REACT_APP_ADMIN_API_URL;

const DEFAULT_CURRENCY_CODE = "EUR";
const DEFAULT_CURRENCY_NAME = "Euro";
const DEFAULT_COMPANY_ID = 1;

const currencyState = {
  currencyCode: DEFAULT_CURRENCY_CODE,
  currencyName: DEFAULT_CURRENCY_NAME,
  companyId: DEFAULT_COMPANY_ID,
  loaded: false,
};

const normalizeLanguage = () => {
  const lang = (localStorage.getItem("lang") || "en").toLowerCase();
  return lang.startsWith("de") ? "de" : "en";
};

const setGlobalCurrencyState = () => {
  if (typeof window !== "undefined") {
    window.COMPANY_CURRENCY = {
      currencyCode: currencyState.currencyCode,
      currencyName: currencyState.currencyName,
      companyId: currencyState.companyId,
      loaded: currencyState.loaded,
    };
  }
};

const getCurrencySnapshot = () => ({
  currencyCode: currencyState.currencyCode,
  currencyName: currencyState.currencyName,
  companyId: currencyState.companyId,
  loaded: currencyState.loaded,
});

export const initCompanyCurrency = async (companyId = DEFAULT_COMPANY_ID) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/Get_CompanySetting?company_id=${companyId}`,
      null,
      {
        headers: {
          "Accept-Language": normalizeLanguage(),
        }
      }
    );

    const data = response?.data || {};

    currencyState.currencyCode = (data.currency_code || DEFAULT_CURRENCY_CODE).toUpperCase();
    currencyState.currencyName = data.currency_name || DEFAULT_CURRENCY_NAME;
    currencyState.companyId = data.id || companyId;
    currencyState.loaded = true;
    setGlobalCurrencyState();
    return getCurrencySnapshot();
  } catch (error) {
    currencyState.currencyCode = DEFAULT_CURRENCY_CODE;
    currencyState.currencyName = DEFAULT_CURRENCY_NAME;
    currencyState.companyId = companyId;
    currencyState.loaded = true;
    setGlobalCurrencyState();
    return getCurrencySnapshot();
  }
};

export const getCompanyCurrencyCode = () => currencyState.currencyCode || DEFAULT_CURRENCY_CODE;

export const getCompanyCurrencyName = () => currencyState.currencyName || DEFAULT_CURRENCY_NAME;

export const getCurrencySymbol = (currencyCode) => {
  const code = (currencyCode || getCompanyCurrencyCode()).toUpperCase();
  if (code === "EUR") return "\u20ac";
  if (code === "USD") return "$";
  if (code === "GBP") return "\u00a3";
  return code;
};

setGlobalCurrencyState();
