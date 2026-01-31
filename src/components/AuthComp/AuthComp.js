import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Col, Row, FloatingLabel } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import GoogleLoginButton from "./googleLoginButton";
import { LoginUser, RegisterUser } from "../../redux/Slices/AuthSlice";
import LoadingPage from "../Loader/LoadingPage";
import PopUp from "../Shared/popup/PopUp";
function AuthComp() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [show, setShow] = useState(true);
  const [type, setType] = useState("login");
  const [errorsLst, seterrorsLst] = useState({});
  const [validated, setvalidated] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
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
  const handleClose = () => {
    setShow(false);
    navigate("/");
  };
  const handleShow = () => {
    setShow(true);
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
          if (result.payload && result.payload.isSuccessed) {
            //if user register successfully so navigate to  verify email first
            setShowPopup(false);
            // navigate(redirectUrl || "/");
            navigate("/");
          } else {
            setShowPopup(true);
          }
        });
      } else {
        formData["lang"] = lang;
        let data = { payload: formData, path: "/RegisterUser" };
        dispatch(RegisterUser(data)).then((result) => {
          if (result.payload && result.payload.isSuccessed) {
            //if user register successfully so navigate to  verify email first
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
    setvalidated(false);
    seterrorsLst({});
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setformData({
      ...formData,
      [e.target.name]: value,
    });
  };
  // useEffect(() => {
  //   let path = type == "login" ? "/" : "/VerifyEmail";
  //   if (success == true) {
  //     setShow(false);
  //     setShowPopup(false);

  //     navigate(path);
  //   } else {
  //     setShowPopup(true);
  //   }
  //   return () => {};
  // }, [success]);

  return (
    <>
      {/* <Button variant="primary" onClick={handleShow}>
        Launch static backdrop modal
      </Button> */}
      <section className="login_page">
        <Modal
          size="md"
          show={show}
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
                <div className="form_title">
                 
                    {/* <h4 className="title">
                      {" "}
                      {type == "login"
                        ? t("Login.LoginTitle")
                        : t("Login.SignUpTitle")}
                    </h4> */}
                  
                
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
      </section>
      {loading && <LoadingPage />}
      {showPopup == true ? (
        <PopUp
          show={showPopup}
          closeAlert={() => setShowPopup(false)}
          msg={message}
          type={success ? "success" : "error"}
          autoClose={3000}
        />
      ) : null}
    </>
  );
}

export default AuthComp;
