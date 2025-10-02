import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import PhoneInput from "react-phone-number-input";
import { useTranslation } from "react-i18next";
import { saveProfile, fetchProfile } from "../../../redux/Slices/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import PopUp from "../../Shared/popup/PopUp";
import LoadingPage from "../../Loader/LoadingPage";
const ProfileTab = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentLang =
    useSelector((state) => state.language.currentLang) || "en";
  const user = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    client_first_name: "",
    client_last_name: "",
    client_id: user?.id || "",
    client_name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
    client_email: user?.email || "",
    phone_number: user?.phoneNumber || "",
    address: "",
    nation: "",
    gender: "",
    profile_id: 0,
    lang: currentLang,
    pay_code: "",
    client_birthdayStr: "",
  });
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("alert");
  // Get state from Redux store
  const { profileData, profileImage, loading, error, success, message } =
    useSelector((state) => state.profile);

  const handleProfileInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  // Birthday components stored separately for easier select handling
  const [birthdayComponents, setBirthdayComponents] = useState({
    year: "",
    month: "",
    day: "",
  });
  // Initialize form data when profileData is loaded from Redux
  useEffect(() => {
    if (profileData && Object.keys(profileData).length > 0) {
      // Only update if data is different to prevent infinite loops
      if (JSON.stringify(profileData) !== JSON.stringify(formData)) {
        setFormData((prev) => ({
          ...prev,
          ...profileData,
          client_first_name:
            profileData?.client_first_name || user?.firstName || "",
          client_last_name: profileData?.client_last_name || user?.lastName,
          client_email: profileData?.client_email || user.email,
          phone_number: profileData?.phone_number || user.phoneNumber,
          client_name:
            profileData.client_name ||
            `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
        }));

        // Parse birthday string if it exists and is different from current
        if (
          profileData.client_birthdayStr &&
          profileData.client_birthdayStr !==
            `${birthdayComponents.year}-${birthdayComponents.month}-${birthdayComponents.day}`
        ) {
          const parts = profileData.client_birthdayStr.split("-");

          setBirthdayComponents({
            year: parts[0] || "",
            month: parts[1] || "",
            day: parts[2] || "",
          });
        }
      }
    }
  }, [profileData]);

  // Fetch profile data  when component mounts
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      // Ensure birthday components are properly formatted
      client_birthdayStr: `${
        birthdayComponents.year
      }-${birthdayComponents.month.padStart(
        2,
        "0"
      )}-${birthdayComponents.day.padStart(2, "0")}`,
    };

    dispatch(saveProfile(updatedFormData)).then((result) => {
      if (result.payload?.success == false) {
        setPopupMessage(error);
        setPopupType("alert");
        setShowPopup(true);
      } else {
        dispatch(fetchProfile());
      }
    });
  };
  // Handle changes to birthday select fields
  const handleBirthdayChange = (e) => {
    const { name, value } = e.target;
    setBirthdayComponents((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className="profile-tab">
      <Form onSubmit={handleSubmit}>
        <h3>{t("profile.profile.title")}</h3>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder={t("profile.profile.firstName")}
                value={formData.client_first_name}
                onChange={(e) =>
                  handleProfileInputChange("client_first_name", e.target.value)
                }
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder={t("profile.profile.lastName")}
                value={formData.client_last_name}
                onChange={(e) =>
                  handleProfileInputChange("client_last_name", e.target.value)
                }
              />
            </Form.Group>
          </Col>
        </Row>

        <h3>{t("profile.profile.contactDetails")}</h3>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                name="client_email"
                placeholder={t("profile.profile.email")}
                value={formData.client_email}
                onChange={(e) =>
                  handleProfileInputChange("client_email", e.target.value)
                }
                className="responsive-input"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3 phone-input-container">
              <div className="responsive-phone-input">
                <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  defaultCountry="EG"
                  placeholder={t("profile.profile.phone")}
                  value={formData.phone_number}
                  onChange={(value) =>
                    handleProfileInputChange("phone_number", value)
                  }
                  className="phone-input-field"
                />
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder={t("profile.profile.address")}
                value={formData.address}
                onChange={(e) =>
                  handleProfileInputChange("address", e.target.value)
                }
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder={t("profile.profile.nationality")}
                value={formData.nation}
                onChange={(e) =>
                  handleProfileInputChange("nation", e.target.value)
                }
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Select
                value={formData.gender}
                onChange={(e) =>
                  handleProfileInputChange("gender", e.target.value)
                }
              >
                <option value="">{t("profile.profile.gender")}</option>
                <option value="male">
                  {t("profile.profile.genderOptions.male")}
                </option>
                <option value="female">
                  {t("profile.profile.genderOptions.female")}
                </option>
                <option value="other">
                  {t("profile.profile.genderOptions.other")}
                </option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <h3>{t("profile.profile.dateOfBirth")}</h3>

        <Row>
          <Col xs={4} md={4}>
            <Form.Group className="mb-3">
              <Form.Select
                value={birthdayComponents.day}
                onChange={handleBirthdayChange}
                name="day"
                className="responsive-select"
                required
              >
                <option value="">{t("profile.profile.day")}</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i} value={String(i + 1).padStart(2, "0")}>
                    {i + 1}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs={4} md={4}>
            <Form.Group className="mb-3">
              <Form.Select
                value={birthdayComponents.month}
                name="month"
                onChange={handleBirthdayChange}
                className="responsive-select"
                required
              >
                <option value="">{t("profile.profile.month")}</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={String(i + 1).padStart(2, "0")}>
                    {new Date(0, i).toLocaleString(t("locale"), {
                      month: "short",
                    })}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs={4} md={4}>
            <Form.Group className="mb-3">
              <Form.Select
                name="year"
                value={birthdayComponents.year}
                onChange={handleBirthdayChange}
                className="responsive-select"
                required
              >
                <option value="">{t("profile.profile.year")}</option>
                {Array.from({ length: 100 }, (_, i) => (
                  <option key={i} value={new Date().getFullYear() - i}>
                    {new Date().getFullYear() - i}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Button className="primaryBtn mt-4" type="submit">
          {formData.profile_id == 0
            ? t("profile.profile.save")
            : t("profile.profile.update")}
        </Button>
      </Form>
      {loading && <LoadingPage />}
      {/* Error Popup */}
      {showPopup && (
        <PopUp
          show={showPopup}
          closeAlert={() => setShowPopup(false)}
          msg={popupMessage}
          type={popupType}
          showConfirmButton={true}
        />
      )}
    </div>
  );
};

export default ProfileTab;
