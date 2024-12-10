import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
// import { useAuth } from './AuthContext'; // Import your Auth context
import Login from "./Login";
import {
  signInWithGoogle,
  signWithTwitter,
  signInWithFacebook,
  provider,
} from "../FirebaseCofig/FirebaseConfig";

const Signup = ({ isOpenness, Closed, back }) => {
  const [signupData, setSignupData] = useState({});
  const [isLoginPopup, setLoginPopup] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isModals, setIsModals] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isSocialSignup, setIsSocialSignup] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Keep the popup open if navigating to linked pages like terms or rules
    if (location.state?.popupOpen) {
      isOpenness(true);
    }
  }, [location.state]);
  const openModals = () => {
    setIsModals(true);
  };
  const closeModals = () => {
    setIsModals(false);
  };

  const handleLogin = () => {
    setLoginPopup(true);
    // onClosed();
  };
  // const handleLogin = () => {
  //   back();
  // };

  const ClosePopup = () => {
    setLoginPopup(false);
    Closed();
  };

  const localStorageKey = "signupFormData";
  const initialValues = JSON.parse(localStorage.getItem(localStorageKey)) || {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    agreeAllLegal: false,
    agreeRules: false,
  };

  // Save data to localStorage on every change
  const handleFieldChange = (field, value, setFieldValue) => {
    setFieldValue(field, value);
    const updatedValues =
      JSON.parse(localStorage.getItem(localStorageKey)) || initialValues;
    updatedValues[field] = value;
    localStorage.setItem(localStorageKey, JSON.stringify(updatedValues));
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleInputChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last digit
    setOtp(newOtp);

    // Move to the next input
    if (value && index < otp.length - 1) {
      const nextInput = document.querySelector(
        `.otp__digit:nth-child(${index + 2})`
      );
      if (nextInput) nextInput.focus();
    }
  };

  const handleNumericInput = (value) =>
    value.replace(/[^0-9]/g, "").slice(0, 10);

  const handleSubmits = async (values) => {
    if (!values) {
      console.error("No values provided to handleSubmits.");
      return;
    }

    console.log("handlesubmits", values);

    if (values.signup_method) {
      // Social signup
      await handleSocialSignup(values);
    } else {
      // Regular signup
      await handleSignup(values);
    }
  };

  const handleSignup = async (values) => {
    let formattedPhone = values.phone;

    // Only add +91 if phone is not empty and doesn't already start with +91
    if (formattedPhone && !formattedPhone.startsWith("+91")) {
      formattedPhone = `+91${formattedPhone}`;
    }
    setIsLoading(true);
    try {
      const response = await axios.post("sign-up", {
        ...values,
        phone: formattedPhone,
      });

      const tokens = response.data.data.token;
      localStorage.setItem("tokens", tokens);
      localStorage.removeItem(localStorageKey);

      Swal.fire({
        title: response.data.message,
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        openModals();
        // Call resendOtp directly, passing the email from values
        resendOtp(values.email);
        // onClose();
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: error.response ? error.response.data.message : error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async (email) => {
    let token = localStorage.getItem("tokens");

    try {
      const response = await axios.post(
        "resend-otp-user-verification",
        { emailOrPhone: email }, // Directly use email passed as argument
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("resend", response.data.data.tokens);

      // Save the new token
      localStorage.setItem("tokens", response.data.data.token);

      Swal.fire({
        icon: "success",
        text: response.data.message,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.response ? error.response.data.message : error.message,
      });
    }
  };

  // Function to verify the OTP
  const verifyOtp = async () => {
    try {
      const token = localStorage.getItem("tokens");
      const response = await axios.post(
        "verify-user",
        { otp: otp.join("") }, // Join OTP array into a string
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          text: "OTP verified successfully!",
        }).then(() => {
          localStorage.clear();
          window.location.reload();
        });
      } else {
        Swal.fire({
          icon: "error",
          text: response.data.message || "OTP verification failed!",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.response ? error.response.data.message : error.message,
      });
    }
  };

  const handleSocialSignup = async (values) => {
    const formattedPhone = values.phone.startsWith("+91")
      ? values.phone
      : `+91${values.phone}`;
    console.log("values", values);

    try {
      const response = await axios.post("social-login", {
        ...values,
        phone: formattedPhone,
        signup_method: values.signup_method,
        device_type: "website",
        device_token: localStorage.getItem("device_token"),
      });
      const token = response.data.data.token;
      localStorage.setItem("Web-token", token);
      Swal.fire({
        title: response.data.message,
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        Swal.fire({
          icon: "info",
          title: "Signup canceled",
          text: "It seems like you closed the signup popup before finishing.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Signup Failed",
          text: error.message,
        });
      }
    }
  };

  const handleGoogleSignup = (setFieldValue) => {
    setFieldValue("signup_method", "google");
    signInWithGoogle(setFieldValue);
  };

  // Example function for Facebook Signup
  const handleFacebookSignup = (setFieldValue) => {
    setFieldValue("signup_method", "facebook");
    signInWithFacebook(setFieldValue);
  };
  const handleTwitterSignup = (setFieldValue) => {
    
    setFieldValue("signup_method", "twitter");
    signWithTwitter(setFieldValue);
  };

  const legalLinks = {
    title: "Legal",
    links: ["Terms & Conditions", "Privacy Policy", "Cookie Policy"],
    paths: ["/tearms", "/privacy", "/cookies"],
  };
  const legalLinkText =
    legalLinks.links
      .slice(0, 2) // Only the first three links
      .join(", ") +
    " & " +
    legalLinks.links[legalLinks.links.length - 1];
  return (
    <>
      <div
        className={`signinpopup_main ${isOpenness ? "show" : ""}`}
        // className="signinpopup_main"
        id="signup_popup"
        // style={{ display: "block" }}

        style={{ display: isOpenness ? "block" : "none" }}
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
                            onClick={Closed}
                          >
                            <img
                              src={`${process.env.PUBLIC_URL}/images/cross_icon.png`}
                              alt="Close"
                            />
                          </button>
                        </div>
                        <h2>Sign Up</h2>

                        <Formik
                          initialValues={initialValues}
                          validateOnChange={true}
                          validateOnBlur={true}
                          onSubmit={(values) => handleSubmits(values)}
                        >
                          {({
                            isSubmitting,
                            errors,
                            touched,
                            setFieldValue,
                          }) => (
                            <Form className="formstart">
                              {/* First Name */}
                              <div className="form-control frmctrldiv">
                                <Field
                                  type="text"
                                  name="first_name"
                                  placeholder="First Name"
                                  onChange={(e) =>
                                    handleFieldChange(
                                      "first_name",
                                      e.target.value,
                                      setFieldValue
                                    )
                                  }
                                  onKeyDown={(e) => {
                                    const inputValue = e.target.value;
                                    if (
                                      (!/[a-zA-Z\s]/.test(e.key) ||
                                        (e.key === " " &&
                                          inputValue.length === 0)) &&
                                      e.key !== "Backspace"
                                    ) {
                                      e.preventDefault();
                                    }
                                  }}
                                />

                                <ErrorMessage
                                  name="first_name"
                                  component="div"
                                  className="field_required"
                                />
                              </div>

                              {/* Last Name */}
                              <div className="form-control frmctrldiv">
                                <Field
                                  type="text"
                                  name="last_name"
                                  placeholder="Last Name"
                                  onChange={(e) =>
                                    handleFieldChange(
                                      "last_name",
                                      e.target.value,
                                      setFieldValue
                                    )
                                  }
                                  onKeyDown={(e) => {
                                    const inputValue = e.target.value;
                                    if (
                                      (!/[a-zA-Z\s]/.test(e.key) ||
                                        (e.key === " " &&
                                          inputValue.length === 0)) &&
                                      e.key !== "Backspace"
                                    ) {
                                      e.preventDefault();
                                    }
                                  }}
                                />
                                <ErrorMessage
                                  name="last_name"
                                  component="div"
                                  className="field_required"
                                />
                              </div>

                              {/* Email */}
                              <div className="form-control frmctrldiv">
                                <Field
                                  type="email"
                                  name="email"
                                  placeholder="Email"
                                  onChange={(e) =>
                                    handleFieldChange(
                                      "email",
                                      e.target.value,
                                      setFieldValue
                                    )
                                  }
                                />
                              </div>

                              {/* Phone */}
                              <div className="form-control frmctrldiv">
                                <Field
                                  type="text"
                                  name="phone"
                                  placeholder="Mobile number"
                                  onChange={(e) => {
                                    const numericValue = handleNumericInput(
                                      e.target.value
                                    );
                                    handleFieldChange(
                                      "phone",
                                      numericValue,
                                      setFieldValue
                                    );
                                    setFieldValue("phone", numericValue);
                                  }}
                                />

                                <ErrorMessage
                                  name="phone"
                                  component="div"
                                  className="field_required"
                                />
                              </div>

                              {!isSocialSignup && (
                                <>
                                  <div className="form-control frmctrldiv">
                                    <Field
                                      type={
                                        showNewPassword ? "text" : "password"
                                      }
                                      name="password"
                                      placeholder="Password"
                                      onChange={(e) =>
                                        handleFieldChange(
                                          "password",
                                          e.target.value,
                                          setFieldValue
                                        )
                                      }
                                    />
                                    <span
                                      onClick={toggleNewPasswordVisibility}
                                      className="eyeiconfor"
                                    >
                                      <i
                                        className={
                                          showNewPassword
                                            ? "fa fa-eye"
                                            : "fa fa-eye-slash"
                                        }
                                      ></i>
                                    </span>
                                    <ErrorMessage
                                      name="password"
                                      component="div"
                                      className="field_required"
                                    />
                                  </div>

                                  <div className="form-control frmctrldiv">
                                    <Field
                                      type={
                                        showConfirmPassword
                                          ? "text"
                                          : "password"
                                      }
                                      name="confirm_password"
                                      placeholder="Confirm Password"
                                      onChange={(e) =>
                                        handleFieldChange(
                                          "confirm_password",
                                          e.target.value,
                                          setFieldValue
                                        )
                                      }
                                    />
                                    <span
                                      onClick={toggleConfirmPasswordVisibility}
                                      className="eyeiconfor"
                                    >
                                      <i
                                        className={
                                          showConfirmPassword
                                            ? "fa fa-eye"
                                            : "fa fa-eye-slash"
                                        }
                                      ></i>
                                    </span>
                                    <ErrorMessage
                                      name="confirm_password"
                                      component="div"
                                      className="field_required"
                                    />
                                  </div>
                                </>
                              )}

                              {/* Terms & Conditions */}

                              <div className="remeberrecoverydiv">
                                <div className="rememebrmediv">
                                  <Field
                                    type="checkbox"
                                    name={`agreeAllLegal`}
                                    className="checkboxemeber"
                                  />
                                  <label
                                    htmlFor="rememebrbtn-legal"
                                    className="labelrememebrme"
                                  >
                                    I have read &amp; agree with{" "}
                                    <span>
                                      {legalLinks.links.map((link, index) => (
                                        <span key={index}>
                                          <Link
                                            to={legalLinks.paths[index]}
                                            state={{ popupOpen: true }}
                                            // target="_blank"
                                            // rel="noopener noreferrer"
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

                              {/* Rules of Play & FAQ */}
                              <div className="remeberrecoverydiv">
                                <div className="rememebrmediv">
                                  <Field
                                    type="checkbox"
                                    name="agreeRules"
                                    className="checkboxemeber"
                                  />
                                  <label className="labelrememebrme">
                                    I have read & agree with{" "}
                                    <Link
                                      to="/rules"
                                      state={{ popupOpen: true }}
                                      // target="_blank"
                                      // rel="noopener noreferrer"
                                    >
                                      Rules of Play & FAQ's
                                    </Link>
                                  </label>
                                </div>
                              </div>
                              <div className="remeberrecoverydiv">
                                <div className="rememebrmediv">
                                  <Field
                                    type="checkbox"
                                    name="agreeRules"
                                    className="checkboxemeber"
                                  />
                                  <label className="labelrememebrme">
                                    Age Must be +18{" "}
                                   
                                  </label>
                                </div>
                              </div>

                              {/* Submit Button */}
                              <div className="form-control loginformctrl">
                                <button
                                  type="submit"
                                  className="loginbtn"
                                  disabled={isSubmitting || isLoading}
                                >
                                  {isLoading ? "Loading..." : "Sign Up"}
                                </button>
                              </div>

                              <div className="signupwithsocial_div signup_page_socialdiv">
                                <div className="signupsociallinks">
                                  <ul>
                                    <li>
                                      <a
                                        onClick={() => {
                                          setIsSocialSignup(true);
                                          handleGoogleSignup(
                                            setFieldValue,
                                            "google"
                                          );
                                        }}
                                        style={{ cursor: "pointer" }}
                                      >
                                        <img
                                          src={`${process.env.PUBLIC_URL}/images/google_icon.png`}
                                          alt="Google"
                                        />
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        onClick={() => {
                                          setIsSocialSignup(true);
                                          handleFacebookSignup(
                                            setFieldValue,
                                            "facebook"
                                          );
                                        }}
                                        style={{ cursor: "pointer" }}
                                      >
                                        <img
                                          src={`${process.env.PUBLIC_URL}/images/facebook_icon.png`}
                                          alt="Facebook"
                                        />
                                      </a>
                                    </li>
                                    <li>
                                      <a
                                        onClick={() => {
                                          setIsSocialSignup(true);
                                          handleTwitterSignup(
                                            setFieldValue,
                                            "twitter"
                                          );
                                        }}
                                        style={{ cursor: "pointer" }}
                                      >
                                        <img
                                          src={`${process.env.PUBLIC_URL}/images/Twitter_x_icon.png`}
                                          alt="Twitter"
                                        />
                                      </a>
                                    </li>
                                    {/* <li>
                                      <a>
                                        <img
                                          src={`${process.env.PUBLIC_URL}/images/apple_icon.png`}
                                          alt="Apple"
                                        />
                                      </a>
                                    </li>
                                    <li>
                                      <a href="#">
                                        <img
                                          src={`${process.env.PUBLIC_URL}/images/Instagram_icon.png`}
                                          alt="Instagram"
                                        />
                                      </a>
                                    </li> */}
                                  </ul>
                                </div>
                              </div>

                              {/* Already have an account */}
                              <div className="registerdiv">
                                <p>
                                  Already have an account?{" "}
                                  <a
                                    className="showsigninbtn_div"
                                    // onClick={handleLogin}
                                    onClick={() => {
                                      setLoginPopup(!isLoginPopup);
                                      localStorage.removeItem("showSignup");

                                      // Closed();
                                    }}
                                  >
                                    Sign In
                                  </a>
                                </p>
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
      {isLoginPopup && <Login isVisible={isLoginPopup} onClose={ClosePopup} />}

      <div
        className={`signinpopup_main ${isModals ? "show" : ""}`}
        style={{ display: isModals ? "block" : "none" }}
      >
        <div className="popup_mianSingindiv">
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
                            className="crossbtn_signinpopupclose otpverificationcrossbtn"
                            onClick={closeModals}
                          >
                            <img
                              src={`${process.env.PUBLIC_URL}/images/cross_icon.png`}
                              alt="Close"
                            />
                          </button>
                        </div>
                        <h2>OTP Verification</h2>
                        <p className="forgotheadingtext">
                          OTP is sent to your registered Email / Mobile Number{" "}
                        </p>
                        <div className="formstart forgotpass_inputmaindiv">
                          <div className="otpinputdiv_verify">
                            <div className="enterotp_text_heaidng">
                              Enter OTP
                            </div>
                            <div className="otp-input-fields">
                              {otp.map((digit, index) => (
                                <input
                                  key={index}
                                  type="text"
                                  className="otp__digit"
                                  value={digit}
                                  onChange={(e) =>
                                    handleInputChange(index, e.target.value)
                                  }
                                  maxLength={1}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="resentdivforotp">
                            <button
                              type="button"
                              className="resentotpbtn"
                              onClick={resendOtp}
                            >
                              Resend OTP
                            </button>
                          </div>
                          <div className="form-control loginformctrl">
                            <button
                              type="button"
                              className="loginbtn otpverify_sbmtbtn"
                              onClick={verifyOtp}
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
