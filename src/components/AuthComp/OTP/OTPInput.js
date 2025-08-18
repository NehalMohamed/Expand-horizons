import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import OtpInput from "react-otp-input";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ConfirmOTP } from "../../../redux/Slices/AuthSlice";
import LoadingPage from "../../Loader/LoadingPage";
import PopUp from "../../Shared/popup/PopUp";
import "./Otp.scss";
function OTPInput(props) {
  const { t } = useTranslation();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const [otp, setOtp] = useState("");
  const [myEmail, setMyEmail] = useState("");
  const { loading, success, message } = useSelector((state) => state.auth);

  const sendOtpCode = () => {
    const data = { Email: myEmail, otp: otp };
    let path = state?.path || "/";
    dispatch(ConfirmOTP(data)).then((result) => {
      if (result.payload && result.payload.isSuccessed) {
        setShowPopup(false);
        navigate(path);
      } else {
        setShowPopup(true);
      }
    });
  };
  // useEffect(() => {
  //   let path = state?.path || "/";
  //   if (success == true) {
  //     setShowPopup(false);
  //     //navigate("/");
  //     navigate(path);
  //   } else {
  //     setShowPopup(true);
  //   }
  //   return () => {};
  // }, [success]);

  useEffect(() => {
    //get user data from local storage
    const userLocal = localStorage.getItem("user");
    if (userLocal) {
      const user = JSON.parse(userLocal);
      if (user) {
        setMyEmail(user.email);
      }
    }
    return () => {};
  }, []);
  return (
    <section className="VerifySection" dir={t("direction")}>
      <div className="verify_content centerContainer">
        <div>
          <p>
            {t("Login.CodeVerifyTitle")}{" "}
            <strong className="marked">{myEmail}</strong>{" "}
            {t("Login.CodeVerifyTitle2")}
          </p>

          <div className="spam-alert">
            <p>
              ⚠️ <strong>{t("Login.spamAlert.title")}</strong>
            </p>
            <ul>
              <li>
                {t("Login.spamAlert.check")}{" "}
                <strong>{t("Login.spamAlert.spam")}</strong>{" "}
                {t("Login.spamAlert.or")}{" "}
                <strong>{t("Login.spamAlert.junk")}</strong>{" "}
                {t("Login.spamAlert.folder")}
              </li>
              <li>{t("Login.spamAlert.addToContacts")}</li>
              <li>{t("Login.spamAlert.waitAndRefresh")}</li>
            </ul>
          </div>
        </div>
        <div>
          <OtpInput
            inputStyle="inputStyle"
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span></span>}
            renderInput={(props) => <input {...props} />}
          />
        </div>
        <Button
          className="purbleBtn SmallWidthBtn roundedBtn"
          onClick={sendOtpCode}
          disabled={otp.length < 6}
        >
          {t("Login.SendCode")}
        </Button>
      </div>
      {loading ? <LoadingPage /> : null}
      {showPopup == true ? (
        <PopUp
          show={showPopup}
          closeAlert={() => setShowPopup(false)}
          msg={message}
          type={success ? "success" : "error"}
          autoClose={3000}
        />
      ) : null}
    </section>
  );
}

export default OTPInput;
