import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Swal from "sweetalert2";
import axios from "axios";
import {
  signInWithGoogle,
  signWithTwitter,
  signInWithFacebook,
} from "../FirebaseCofig/FirebaseConfig";
import * as Yup from "yup";

// Default values for the form
const defaultValues = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  signup_method: "",
  agreeAllLegal: false,
  agreeRules: false,
  agreeAge: false,
};

const SocialSignUP = ({ onSocial, closeSocial }) => {
  const location = useLocation();

  const storedValues = (() => {
    const value = localStorage.getItem("UIDNotFound");

    if (!value || value === "undefined") {
      localStorage.removeItem("UIDNotFound");
      return null;
    }

    try {
      const parsed = JSON.parse(value);
      return { ...defaultValues, ...parsed };
    } catch (err) {
      localStorage.removeItem("UIDNotFound"); // Ensure corrupted data is removed
      return null;
    }
  })();

  const initialValues = storedValues || defaultValues;

  // useEffect(() => {
  //   if (location?.state?.popupOpen === false) {
  //     onSocial(false);
  //   } else if (location?.state?.popupOpen === true) {
  //     onSocial(true);
  //   }
  // }, [location.state]);

  useEffect(() => {
    console.log("Location state changed:", location.state);
    if (location.state?.popupOpen === false) {
      console.log("Location", location.state);
      onSocial(false); // Close popup when navigating
    }
  }, [location.state?.popupOpen]);

  // Agar storedValues null ho, ensure localStorage is cleared
  if (!storedValues) {
    localStorage.removeItem("UIDNotFound");
  }

  // Yup validation schema
  const validateFields = Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    agreeAllLegal: Yup.boolean().oneOf([true], "You must agree to continue"),
    agreeRules: Yup.boolean().oneOf([true], "You must agree to continue"),
    agreeAge: Yup.boolean().oneOf([true], "You must agree to continue"),
  });

  // LocalStorage update helper function
  const updateLocalStorage = (values) => {
    // Merge current values with defaults to ensure missing keys get default values
    const mergedValues = { ...defaultValues, ...values };
    localStorage.setItem("UIDNotFound", JSON.stringify(mergedValues));
  };

  // Field change handler that updates both Formik state and localStorage
  const handleFieldChange = (field, value, setFieldValue, values) => {
    setFieldValue(field, value);
    const updatedValues = { ...values, [field]: value };
    updateLocalStorage(updatedValues);
  };

  // Numeric-only input handler for phone number
  const handleNumericInput = (e, setFieldValue, values) => {
    const numericValue = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFieldValue("phone", numericValue);
    const updatedValues = { ...values, phone: numericValue };
    updateLocalStorage(updatedValues);
  };

  // API call for social signup
  const handleSocialSignup = async (values) => {
    console.log("vas", values);
    const formattedPhone = values.phone.startsWith("+91")
      ? values.phone
      : `+91${values.phone}`;
    try {
      const response = await axios.post("app/auth/social-login", {
        ...values,
        phone: formattedPhone,
        signup_method: values.signup_method,
        device_type: "website",
        device_token: localStorage.getItem("device_token"),
      });

      if (response.data && response.data.data) {
        const token = response.data.data.token;
        localStorage.setItem("Web-token", token);

        Swal.fire({
          title: response.data.message,
          allowOutsideClick: false,
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          localStorage.removeItem("UIDNotFound");
          window.location.reload();
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Social Signup Failed",
        text:
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          "An error occurred. Please try again.",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
      console.error(error);
    }
  };

  const legalLinks = {
    title: "Legal",
    links: ["Terms & Conditions", "Privacy Policy", "Cookie Policy"],
    paths: ["/terms", "/privacy", "/cookies"],
  };

  return (
    <div
      className={`signinpopup_main ${onSocial ? "show" : ""}`}
      id="signup_popup"
      style={{ display: onSocial ? "block" : "none" }}
    >
      <div className="popup_mianSingindiv mainpopupfrsignupdiv_new">
        <div className="adminloginsection">
          <div className="container contfld-loginform">
            <div className="col-md-12 col12mainloginform">
              <div className="row rowmaqinloginform">
                <div className="col-md-6 offset-md-3 col12loginseconddiv">
                  <div className="col-md-12 col6formsidediv">
                    <div className="colformlogin">
                      <div className="crossbtndiv_signinpopup">
                        <button
                          type="button"
                          className="crossbtn_signinpopupclose singupcrossbtn"
                          onClick={() => {
                            closeSocial();
                            localStorage.removeItem("UIDNotFound");
                          }}
                        >
                          <img
                            src={`${process.env.PUBLIC_URL}/images/cross_icon.png`}
                            alt="Close"
                          />
                        </button>
                      </div>
                      <h2>Social Sign Up</h2>
                      <Formik
                        initialValues={initialValues}
                        validationSchema={validateFields}
                        onSubmit={handleSocialSignup}
                        validateOnMount
                      >
                        {({
                          errors,
                          touched,
                          isSubmitting,
                          setFieldValue,
                          values,
                        }) => (
                          <Form className="formstart">
                            <div className="form-control frmctrldiv">
                              <Field
                                type="text"
                                name="first_name"
                                placeholder="First Name"
                                onChange={(e) =>
                                  handleFieldChange(
                                    "first_name",
                                    e.target.value,
                                    setFieldValue,
                                    values
                                  )
                                }
                                style={{ background: "#fff" }}
                              />
                              <ErrorMessage
                                name="first_name"
                                component="div"
                                className="error-message"
                              />
                            </div>

                            <div className="form-control frmctrldiv">
                              <Field
                                type="text"
                                name="last_name"
                                placeholder="Last Name"
                                onChange={(e) =>
                                  handleFieldChange(
                                    "last_name",
                                    e.target.value,
                                    setFieldValue,
                                    values
                                  )
                                }
                                style={{ background: "#fff" }}
                              />
                              <ErrorMessage
                                name="last_name"
                                component="div"
                                className="error-message"
                              />
                            </div>

                            <div className="form-control frmctrldiv">
                              <Field
                                type="email"
                                name="email"
                                placeholder="Email"
                                onChange={(e) =>
                                  handleFieldChange(
                                    "email",
                                    e.target.value,
                                    setFieldValue,
                                    values
                                  )
                                }
                                style={{ background: "#fff" }}
                                disabled={
                                  values.email && touched.email && !errors.email
                                }
                              />

                              <ErrorMessage
                                name="email"
                                component="div"
                                className="error-message"
                              />
                            </div>

                            <div className="form-control frmctrldiv">
                              <Field
                                type="text"
                                name="phone"
                                placeholder="Mobile number"
                                onChange={(e) =>
                                  handleNumericInput(e, setFieldValue, values)
                                }
                                style={{ background: "#fff" }}
                              />
                              <ErrorMessage
                                name="phone"
                                component="div"
                                className="error-message"
                              />
                            </div>

                            {/* Checkbox for Legal */}
                            <div className="remeberrecoverydiv mb-0">
                              <div className="rememebrmediv">
                                <Field
                                  type="checkbox"
                                  name="agreeAllLegal"
                                  className="checkboxemeber"
                                  onChange={(e) =>
                                    handleFieldChange(
                                      "agreeAllLegal",
                                      e.target.checked,
                                      setFieldValue,
                                      values
                                    )
                                  }
                                />
                                <label
                                  htmlFor="agreeAllLegal"
                                  className="labelrememebrme"
                                >
                                  I have read &amp; agree with{" "}
                                  <span>
                                    {legalLinks.links.map((link, index) => (
                                      <span key={index}>
                                        <Link
                                          to={legalLinks.paths[index]}
                                          state={{ popupOpen: false }}
                                          onClick={() => closeSocial()} // Force popup to close
                                        >
                                          {link}
                                        </Link>
                                        {index < legalLinks.links.length - 1
                                          ? ", "
                                          : ""}
                                      </span>
                                    ))}
                                  </span>
                                </label>
                              </div>
                            </div>
                            <ErrorMessage
                              name="agreeAllLegal"
                              component="div"
                              className="error-message"
                            />

                            {/* Checkbox for Rules */}
                            <div className="remeberrecoverydiv mv-0">
                              <div className="rememebrmediv">
                                <Field
                                  type="checkbox"
                                  name="agreeRules"
                                  className="checkboxemeber"
                                  onChange={(e) =>
                                    handleFieldChange(
                                      "agreeRules",
                                      e.target.checked,
                                      setFieldValue,
                                      values
                                    )
                                  }
                                />
                                <label className="labelrememebrme">
                                  I have read & agree with{" "}
                                  <Link
                                    to="/rules"
                                    state={{ popupOpen: false }}
                                  >
                                    Rules of Play & FAQ's
                                  </Link>
                                </label>
                              </div>
                            </div>
                            <ErrorMessage
                              name="agreeRules"
                              component="div"
                              className="error-message"
                            />

                            {/* Checkbox for Age */}
                            <div className="remeberrecoverydiv mb-0">
                              <div className="rememebrmediv">
                                <Field
                                  type="checkbox"
                                  name="agreeAge"
                                  className="checkboxemeber"
                                  onChange={(e) =>
                                    handleFieldChange(
                                      "agreeAge",
                                      e.target.checked,
                                      setFieldValue,
                                      values
                                    )
                                  }
                                />
                                <label className="labelrememebrme">
                                  I hereby confirm and acknowledge that I am not
                                  a minor, and that I am at least 18 years old
                                  as of today’s date.
                                </label>
                              </div>
                            </div>
                            <ErrorMessage
                              name="agreeAge"
                              component="div"
                              className="error-message"
                            />

                            <div className="form-control loginformctrl">
                              <button
                                type="submit"
                                className="loginbtn"
                                disabled={isSubmitting}
                              >
                                Sign Up
                              </button>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialSignUP;
