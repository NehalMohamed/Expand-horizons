import React, { useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LoginUser, RegisterUser } from "../../redux/Slices/AuthSlice";
import LoadingPage from "../Loader/LoadingPage";
import { Button } from "react-bootstrap";
import PopUp from "../Shared/popup/PopUp";
import axios from "axios";

const GoogleLoginButton = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const { loading, message, success } = useSelector((state) => state.auth);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const token = "Bearer " + tokenResponse.access_token;
      //get user details with google token
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: token } }
      );
      if (userInfo && userInfo.data) {
        let { family_name, given_name, email } = userInfo.data;
        //check if this login or register (different in api path and payload)
        if (props.login) {
          let formData = {
            email: email,
            FirstName: given_name,
            LastName: family_name != null ? family_name : given_name,
            lang: localStorage.getItem("lang") || "en",
            Role: "User",
          };
          let data = { payload: formData, path: "/LoginGmail" };
          dispatch(LoginUser(data)).then((result) => {
            let { isAuthRedirect, redirectPath } = props;
            if (result.payload && result.payload.isSuccessed) {
              setShowPopup(false);
              //if user login successfully and his email is confirmed navigate to home and whole app , if no sholud verify mail first by OTP
              if (result.payload?.user?.emailConfirmed == true) {
                if (isAuthRedirect) {
                  window.location.href = redirectPath;
                } else {
                  window.location.href = "/";
                }
              } else {
                 window.location.href = "/verifyEmail";
                // navigate("/verifyEmail", {
                //   replace: true,
                //   state: { path: "/" },
                // });
              }
            } else {
              setShowPopup(true);
            }
          });
        } else {
          //this register not login
          let data = {
            payload: {
              FirstName: given_name,
              LastName: family_name != null ? family_name : given_name,
              email: email,
              password: tokenResponse.access_token,
              lang: localStorage.getItem("lang") || "en",
              Role: "User",
              sendOffers: props.sendOffers,
            },
            path: "/ExternalRegister",
          };
          dispatch(RegisterUser(data)).then((result) => {
            if (result.payload && result.payload.isSuccessed) {
              //if user register successfully navigate to verify mail first by OTP
              setShowPopup(false);
              window.location.href = "/verifyEmail";
              // navigate("/verifyEmail", {
              //   replace: true,
              //   state: { path: "/" },
              // });
            } else {
              setShowPopup(true);
            }
          });
        }
      }
    },
    onError: (errorResponse) => console.log(errorResponse),
  });
  // useEffect(() => {
  //   if (success == true) {
  //     setShowPopup(false);
  //     if (props.login) {
  //       navigate("/verifyEmail", {
  //         replace: true,
  //         state: { path: "/" },
  //       });
  //     } else {
  //       navigate("/verifyEmail", {
  //         replace: true,
  //         state: { path: "/" },
  //       });
  //     }
  //   } else {
  //     setShowPopup(true);
  //   }
  //   return () => {};
  // }, [success]);
  return (
    <>
      <Button
        className="frmBtn transBtn FullWidthBtn"
        onClick={() => googleLogin()}
      >
        <img src="../images/gmail_icon.png" className="gmail_icon" />
        {props.login
          ? t("Login.LoginWithGoogle")
          : t("Login.RegisterWithGoogle")}
      </Button>
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
};

export default GoogleLoginButton;
