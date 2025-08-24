import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Col, Row, FloatingLabel } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import GoogleLoginButton from "./googleLoginButton";
import { LoginUser, RegisterUser } from "../../redux/Slices/AuthSlice";
import LoadingPage from "../Loader/LoadingPage";
import PopUp from "../Shared/popup/PopUp";

// Create a context for the auth modal
export const AuthModalContext = React.createContext();

// Provider component to wrap your app with
export const AuthModalProvider = ({ children }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalType, setAuthModalType] = useState("login");

  const openAuthModal = (type = "login") => {
    setAuthModalType(type);
    setShowAuthModal(true);
  };
  
  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  const navigateTo = (path) => {
    window.location.href = path;
  };
  
  return (
    <AuthModalContext.Provider value={{ openAuthModal, closeAuthModal }}>
      {children}
      <AuthModal 
        show={showAuthModal} 
        onHide={closeAuthModal} 
        type={authModalType}
        setType={setAuthModalType}
        navigateTo={navigateTo}
      />
    </AuthModalContext.Provider>
  );
};

// Custom hook to use the auth modal
export const useAuthModal = () => {
  const context = React.useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
};

// Main AuthModal component
function AuthModal({ show, onHide, type, setType, navigateTo }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [errorsLst, seterrorsLst] = useState({});
  const [validated, setvalidated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setformData] = useState({
    FirstName: "",
    LastName: "",
    email: "",
    password: "",
    ConfirmPassword: "",
    Role: "User",
    sendOffers: false,
  });

  const { loading, success, message } = useSelector((state) => state.auth);
 
  //validate form inputs
  const validate = () => {
    if (type == "register") {
      if (formData.FirstName == null || formData.FirstName.trim() == "") {
        seterrorsLst({
          ...errorsLst,
          firstname: t("Login.fillField"),
        });
        return false;
      }

      if (formData.LastName == null || formData.LastName.trim() == "") {
        seterrorsLst({
          ...errorsLst,
          lastname: t("Login.fillField"),
        });
        return false;
      }
      if (formData.ConfirmPassword !== formData.password) {
        seterrorsLst({
          ...errorsLst,
          ConfirmPassword: t("Login.ConfirmPasswordError"),
        });
        return false;
      }
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email) || formData.email.trim() == "") {
      seterrorsLst({
        ...errorsLst,
        email: t("Login.EmailError"),
      });
      return false;
    }

    if (formData.password.trim() == "" || formData.password.length < 6) {
      seterrorsLst({
        ...errorsLst,
        password: t("Login.PasswordError"),
      });
      return false;
    }

    return true;
  };

  const signin = (event) => {
    event.preventDefault();
    // validation
    if (validate()) {
      let lang = localStorage.getItem("lang") || "en";
      if (type == "login") {
        let data = {
          payload: {
            email: formData.email,
            password: formData.password,
            lang: lang,
          },
          path: "/LoginUser",
        };
        dispatch(LoginUser(data));
      } else {
        formData["lang"] = lang;
        let data = { payload: formData, path: "/RegisterUser" };
        dispatch(RegisterUser(data)).then((result) => {
          if (result.payload && result.payload.isSuccessed) {
            //if user register successfully so navigate to verify email first
            setShowPopup(false);
            navigateTo("/verifyEmail"); 
            // ("/verifyEmail", {
            //   replace: true,
            //   state: { path: "/" },
            // });
          } else {
            setShowPopup(true);
          }
        });
      }
    }
  };

  const fillFormData = (e) => {
    setvalidated(false);
    seterrorsLst({});
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setformData({
      ...formData,
      [e.target.name]: value,
    });
  };

// Reset form when modal is closed or type changes
  useEffect(() => {
    if (!show) {
      setformData({
        FirstName: "",
        LastName: "",
        email: "",
        password: "",
        ConfirmPassword: "",
        Role: "User",
        sendOffers: false,
      });
      seterrorsLst({});
    }
  }, [show, type]);

  // Handle success after login/register
  useEffect(() => {
    if (success && type === "login") {
      onHide();
      setShowPopup(false);
      navigateTo("/");
    }
  }, [success, type, navigateTo, onHide]);

  return (
    <> 
      <Modal
        size="lg"
        show={show}
        onHide={onHide}
        backdrop="static"
        keyboard={false}
        className="auth_modal"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="form_title">
            <div>
              <h4 className="title">
                {" "}
                {type == "login"
                  ? t("Login.LoginTitle")
                  : t("Login.SignUpTitle")}
              </h4>
            </div>
            <div>
              {type == "login" ? (
                <p className="form_option">
                  {t("Login.DontHaveAccount")}
                  <button
                    className="form_option_btn"
                    onClick={() => {
                      setType("register");
                    }}
                  >
                    {t("Login.CreateAccount")}
                  </button>
                </p>
              ) : (
                <p className="form_option">
                  {t("Login.HaveAccount")}
                  <button
                    className="form_option_btn"
                    onClick={() => {
                      setType("login");
                    }}
                  >
                    {t("Login.signIn")}
                  </button>
                </p>
              )}
            </div>
          </div>

          <p
            className="SubTitle"
            dangerouslySetInnerHTML={{
              __html: t("Login.LoginSubTitle"),
            }}
          ></p>
          <Form onSubmit={signin} noValidate>
            {type == "register" && (
              <Form.Check
                type="checkbox"
                name="sendOffers"
                onChange={fillFormData}
                checked={formData.sendOffers}
                label={
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t("Login.LoginCheckBoxTitle"),
                    }}
                  ></span>
                }
              />
            )}
            {type == "register" && (
              <Row>
                <Col lg={6} md={12} sm={12} xs={12}>
                  <FloatingLabel label={t("Login.firstname")} className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder={t("Login.firstname")}
                      className="formInput"
                      required
                      name="FirstName"
                      value={formData.FirstName}
                      onChange={fillFormData}
                    />
                    {errorsLst.firstname && (
                      <Form.Text type="invalid" className="errorTxt">
                        {errorsLst.firstname}
                      </Form.Text>
                    )}
                  </FloatingLabel>
                </Col>
                <Col lg={6} md={12} sm={12} xs={12}>
                  <FloatingLabel label={t("Login.lastname")} className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder={t("Login.lastname")}
                      className="formInput"
                      required
                      name="LastName"
                      value={formData.LastName}
                      onChange={fillFormData}
                    />
                    {errorsLst.lastname && (
                      <Form.Text type="invalid" className="errorTxt">
                        {errorsLst.lastname}
                      </Form.Text>
                    )}
                  </FloatingLabel>
                </Col>
              </Row>
            )}
            <Row>
              <Col xs={12}>
                {" "}
                <FloatingLabel label={t("Login.email")} className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder={t("Login.email")}
                    required
                    name="email"
                    className="formInput"
                    value={formData.email}
                    onChange={fillFormData}
                  />
                  {errorsLst.email && (
                    <Form.Text type="invalid" className="errorTxt">
                      {errorsLst.email}
                    </Form.Text>
                  )}
                </FloatingLabel>
              </Col>
            </Row>
            {type == "register" ? (
              <Row>
                <Col lg={6} md={12} sm={12} xs={12}>
                  <FloatingLabel label={t("Login.password")} className="mb-3">
                    <Form.Control
                      type="password"
                      placeholder={t("Login.password")}
                      required
                      name="password"
                      className="formInput"
                      minLength={6}
                      value={formData.password}
                      onChange={fillFormData}
                    />
                    {errorsLst.password && (
                      <Form.Text type="invalid" className="errorTxt">
                        {errorsLst.password}
                      </Form.Text>
                    )}
                  </FloatingLabel>
                </Col>
                <Col lg={6} md={12} sm={12} xs={12}>
                  <FloatingLabel
                    label={t("Login.confirmPassword")}
                    className="mb-3"
                  >
                    <Form.Control
                      required
                      type="password"
                      placeholder={t("Login.confirmPassword")}
                      name="ConfirmPassword"
                      className="formInput"
                      minLength={6}
                      value={formData.ConfirmPassword}
                      onChange={fillFormData}
                    />
                    {errorsLst.ConfirmPassword && (
                      <Form.Text className="errorTxt">
                        {errorsLst.ConfirmPassword}
                      </Form.Text>
                    )}
                  </FloatingLabel>
                </Col>
              </Row>
            ) : (
              <Row>
                <Col lg={12} md={12} sm={12} xs={12}>
                  <FloatingLabel label={t("Login.password")} className="mb-3">
                    <Form.Control
                      type="password"
                      placeholder={t("Login.password")}
                      required
                      name="password"
                      className="formInput"
                      minLength={6}
                      value={formData.password}
                      onChange={fillFormData}
                    />
                    {errorsLst.password && (
                      <Form.Text type="invalid" className="errorTxt">
                        {errorsLst.password}
                      </Form.Text>
                    )}
                  </FloatingLabel>
                </Col>
              </Row>
            )}
            <Button type="submit" className="frmBtn primaryBtn FullWidthBtn">
              {type == "login" ? t("Login.signIn") : t("Login.CreateAccount")}
            </Button>
          </Form>
          <p className="formText">{t("Login.PrivacyText")}</p>
          <p className="formText">
            <strong>{t("Login.Or")}</strong>
          </p>
          <GoogleLoginButton
            login={type == "login" ? true : false}
            sendOffers={formData.sendOffers}
          />
        </Modal.Body>
      </Modal>
      {loading && <LoadingPage />}
      {showPopup && (
        <PopUp
          show={showPopup}
          closeAlert={() => setShowPopup(false)}
          msg={message}
          type={success ? "success" : "error"}
          autoClose={3000}
        />
      )}
    </>
  );
}

export default AuthModal;
