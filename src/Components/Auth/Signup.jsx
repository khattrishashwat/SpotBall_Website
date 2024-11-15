import React, { useState } from "react";
import { Link } from "react-router-dom";
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

const Signup = ({ isOpenness, onClosed }) => {
  const [signupData, setSignupData] = useState({});
  const [isLoginPopup, setLoginPopup] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isModals, setIsModals] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isSocialSignup, setIsSocialSignup] = useState(false);
  const [activeTab, setActiveTab] = useState(localStorage.getItem("activeTab"));
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

  const ClosePopup = () => {
    setLoginPopup(false);
    onClosed();
  };
  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    agreeTerms: false,
    agreeRules: false,
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
    const formattedPhone = values.phone.startsWith("+91")
      ? values.phone
      : `+91${values.phone}`;
    setIsLoading(true);
    try {
      const response = await axios.post("sign-up", {
        ...values,
        phone: formattedPhone,
      });

      const tokens = response.data.data.token;
      localStorage.setItem("tokens", tokens);

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
      localStorage.setItem("tokens", response.data.data.token );

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
      localStorage.setItem("token", token);
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

  const handleTabClick = (tabId) => {
    localStorage.setItem("activeTab", tabId);
    setActiveTab(tabId);
  };
  const legalLinks = {
    title: "Legal",
    links: ["Terms & Conditions", "Privacy Policy", "Cookie Policy"],
    paths: ["./legal_terms"],
    onClick: [
      () => handleTabClick("terms_conditions"),
      () => handleTabClick("privacy_policy"),
      () => handleTabClick("cookiepolicy"),
    ],
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
        // className={`signinpopup_main ${isOpenness ? "show" : ""}`}
        className="signinpopup_main"
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
                            onClick={onClosed}
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
                          validate={(values) => {
                            const errors = {};
                            if (
                              values.phone &&
                              (values.phone.length < 10 ||
                                values.phone.length > 15)
                            ) {
                              errors.phone =
                                "Phone number must be between 10 and 15 digits";
                            }
                            return errors;
                          }}
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
                                />
                              </div>

                              {/* Phone */}
                              <div className="form-control frmctrldiv">
                                <Field
                                  type="text"
                                  name="phone"
                                  placeholder="Mobile number"
                                  onChange={(e) =>
                                    setFieldValue(
                                      "phone",
                                      handleNumericInput(e.target.value)
                                    )
                                  }
                                />
                                {touched.phone && errors.phone && (
                                  <div className="field_required">
                                    {errors.phone}
                                  </div>
                                )}
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
                              {/* <div className="remeberrecoverydiv">
                                <div className="rememebrmediv">
                                  <Field
                                    type="checkbox"
                                    name="agreeTerms"
                                    className="checkboxemeber"
                                  />
                                  <label
                                    htmlFor="rememebrbtn"
                                    className="labelrememebrme"
                                  >
                                    I have read &amp; agree with{" "}
                                    <Link
                                      to="/legal_terms"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Terms &amp; Conditions
                                    </Link>
                                    ,{" "}
                                    <Link
                                      to="/legal_terms"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Privacy Policy
                                    </Link>{" "}
                                    &amp;{" "}
                                    <Link
                                      to="/legal_terms"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Cookie Policy
                                    </Link>
                                  </label>
                                </div>
                              </div> */}
                              {/* Terms & Conditions and Legal Links */}
                              {/* {legalLinks.links.map((link, index) => (
                                <div className="remeberrecoverydiv" key={index}>
                                  <div className="rememebrmediv">
                                    <Field
                                      type="checkbox"
                                      name={`agree${link.replace(
                                        /[^a-zA-Z]/g,
                                        ""
                                      )}`}
                                      className="checkboxemeber"
                                    />
                                    <label
                                      htmlFor={`rememebrbtn-${index}`}
                                      className="labelrememebrme"
                                    >
                                      I have read &amp; agree with{" "}
                                      <Link
                                        to={legalLinks.paths[index]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={legalLinks.onClick[index]}
                                      >
                                        {link}
                                      </Link>
                                    </label>
                                  </div>
                                </div>
                              ))} */}
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
                                            to={legalLinks.paths[0]} // Use the single path
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => {
                                              legalLinks.onClick[index](); // Trigger the corresponding tab change
                                              window.open(
                                                legalLinks.paths[0],
                                                "_blank"
                                              ); // Open the path in a new tab
                                            }}
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
                                      to="/legal_terms"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={() => {
                                        handleTabClick("rules_play"); // Trigger the tab change to 'rules_play'
                                      }}
                                    >
                                      Rules of Play & FAQ's
                                    </Link>
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
                                          src={`${process.env.PUBLIC_URL}/images/Google_icon.png`}
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
                                          src={`${process.env.PUBLIC_URL}/images/Facebook_icon.png`}
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
                                    <li>
                                      <a>
                                        <img
                                          src={`${process.env.PUBLIC_URL}/images/Apple_icon.png`}
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
                                    </li>
                                  </ul>
                                </div>
                              </div>

                              {/* Already have an account */}
                              {/* <div className="registerdiv">
                                <p>
                                  Already have an account?{" "}
                                  <a
                                    className="showsigninbtn_div"
                                    // onClick={handleLogin}
                                    onClick={() => {
                                      setLoginPopup(!isLoginPopup); // Toggle login popup
                                      // onClosed(); // Close the signup popup
                                    }}
                                  >
                                    Sign In
                                  </a>
                                </p>
                              </div> */}
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
      <Login isVisible={isLoginPopup} onClose={ClosePopup} />

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
