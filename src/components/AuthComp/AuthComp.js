import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Col, Row, FloatingLabel } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import GoogleLoginButton from "./googleLoginButton";
import { LoginUser, RegisterUser, clearGoogleAccFlag } from "../../redux/Slices/AuthSlice";
import LoadingPage from "../Loader/LoadingPage";
import PopUp from "../Shared/popup/PopUp";

function AuthComp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [show, setShow] = useState(true);
  const [type, setType] = useState("login");
  const [errorsLst, seterrorsLst] = useState({});
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const [showWelcomeBack, setShowWelcomeBack] = useState(false); // State for welcome back modal
  const [googleEmail, setGoogleEmail] = useState("");
  const [formData, setformData] = useState({
    FirstName: "",
    LastName: "",
    email: "",
    password: "",
    ConfirmPassword: "",
    Role: "User",
    sendOffers: false,
  });

  const { loading, success, message, isGoogleAcc } = useSelector((state) => state.auth);

  const handleClose = () => {
    setShow(false);
    setShowWelcomeBack(false);
    navigate("/");
  };

  useEffect(() => {
    if (isGoogleAcc === true) {
      // Close the login modal
      setShow(false);
      // Set the email from form data
      setGoogleEmail(formData.email);
      // Show welcome back modal after a small delay to ensure smooth transition
      setTimeout(() => {
        setShowWelcomeBack(true);
      }, 100);
      // Clear the flag after showing the modal
      dispatch(clearGoogleAccFlag());
    }
  }, [isGoogleAcc, formData.email, dispatch]);

  const handleWelcomeBackClose = () => {
    setShowWelcomeBack(false);
    setShow(true);
    setGoogleEmail("");
    // Clear form password when going back
    setformData(prev => ({ ...prev, password: "" }));
  };

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
    const redirectUrl = localStorage.getItem("redirect_after_login");
    console.log("redirectUrl ", redirectUrl);
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

        dispatch(LoginUser(data)).then((result) => {
          // Check if the response indicates this is a Google account
          if (result.payload && result.payload.isSuccessed) {
            // Successful login
            setShowPopup(false);
            navigate("/");
          } else if (result.error) {
            if (result.payload && result.payload.isGoogleAcc === true) {
              setShowPopup(false);
            } else {
            setShowPopup(true);
            }
          }
        });
      } else {
        formData["lang"] = lang;
        let data = { payload: formData, path: "/RegisterUser" };
        dispatch(RegisterUser(data)).then((result) => {
          if (result.payload && result.payload.isSuccessed) {
            //if user register successfully so navigate to verify email first
            setShowPopup(false);
            navigate("/verifyEmail", {
              replace: true,
              state: { path: "/" },
            });
          } else {
            setShowPopup(true);
          }
        });
      }
    }
  };

  const fillFormData = (e) => {
    seterrorsLst({});
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setformData({
      ...formData,
      [e.target.name]: value,
    });
  };

  return (
    <>
      <section className="login_page">
        <Modal
          size="md"
          show={show && !showWelcomeBack}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          centered
          className="auth_modal"
        >
          {/* <Modal.Header closeButton></Modal.Header> */}
          <Modal.Body>
            <div className="d-flex justify-content-center align-items-center mb-3">
              <img
                src="/Asset 1.png"
                alt={t('main_navbar.travel')}
                className="logo-img"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="form_title"></div>

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
                    <FloatingLabel
                      label={t("Login.firstname")}
                      className="mb-3"
                    >
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
                    <FloatingLabel
                      label={t("Login.lastname")}
                      className="mb-3"
                    >
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
                    <FloatingLabel
                      label={t("Login.password")}
                      className="mb-3"
                    >
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
                    <FloatingLabel
                      label={t("Login.password")}
                      className="mb-3"
                    >
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
              <Button
                type="submit"
                className="frmBtn secondryBtn whiteTxt FullWidthBtn"
              >
                {type == "login"
                  ? t("Login.signIn")
                  : t("Login.CreateAccount")}
              </Button>
            </Form>
            <div className="d-flex justify-content-end">
              {type == "login" ? (
                <p className="form_option text-end">
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
                <p className="form_option text-end">
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
            <p className="formText">{t("Login.PrivacyText")}</p>
            <p className="formText">
              <strong>{t("Login.Or")}</strong>
            </p>
            <GoogleLoginButton
              login={type == "login" ? true : false}
              sendOffers={formData.sendOffers}
            // isAuthRedirect={props.isAuthRedirect}
            // redirectPath={props.redirectPath}
            />
          </Modal.Body>
        </Modal>

        {/* Welcome Back Modal */}
        <Modal
          size="md"
          show={showWelcomeBack}
          onHide={handleWelcomeBackClose}
          backdrop="static"
          keyboard={false}
          centered
          className="auth_modal welcome_back_modal"
        >
          <Modal.Body>
            <div className="d-flex justify-content-center align-items-center mb-3">
              <img
                src="/Asset 1.png"
                alt={t('main_navbar.travel')}
                className="logo-img"
                loading="lazy"
                decoding="async"
              />
            </div>

            <h4 className="title text-center mb-3">
              {t("Login.WelcomeBack") || "Welcome Back!"}
            </h4>

            <p className="SubTitle text-center mb-4">
              {googleEmail && (
                <>
                  {t("Login.PleaseLoginWithGoogle") || "Please continue with Google to login to"}{" "}
                  <strong>{googleEmail}</strong>
                </>
              )}
              {!googleEmail && (t("Login.PleaseLoginWithGoogle") || "Please login with Google")}
            </p>

            <div className="text-center">
              <GoogleLoginButton
                login={true}
                sendOffers={formData.sendOffers}
              />
            </div>

            <div className="d-flex justify-content-center mt-3">
              <button
                className="form_option_btn"
                onClick={handleWelcomeBackClose}
              >
                {t("Login.UseDifferentAccount") || "Use different account"}
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </section>

      {loading && <LoadingPage />}

      {showPopup && !isGoogleAcc && !showWelcomeBack && (
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

export default AuthComp;
