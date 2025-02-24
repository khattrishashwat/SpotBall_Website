import React, { useState, useEffect, useRef } from "react";
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
  const [emails, setEmails] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isModals, setIsModals] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isSocialSignup, setIsSocialSignup] = useState(false);
  const location = useLocation();
  const [timer, setTimer] = useState(60); // Timer state for resend OTP
  const formikRef = useRef(null);

  // useEffect(() => {
  //   // Keep the popup open if navigating to linked pages like terms or rules
  //   if (location.state?.popupOpen) {
  //     isOpenness(true);
  //   }
  // }, [location.state]);
  const otpRefs = useRef([]);

  useEffect(() => {
    // Check if popupOpen is false in the location state
    if (location.state?.popupOpen === false) {
      isOpenness(false); // Close the popup
    } else if (location.state?.popupOpen === true) {
      isOpenness(true); // Keep the popup open if navigating to linked pages like terms or rules
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
    // Closed()
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
    agreeAge: false,
  };

   const validateFields = Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    
      password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[@$!%*?&]/,
        "Password must contain at least one special character (@, $, !, %, *, ?, &)"
      )
      .required("Password is required"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),

    agreeAllLegal: Yup.boolean().oneOf([true], "You must agree to continue"),
    agreeRules: Yup.boolean().oneOf([true], "You must agree to continue"),
    agreeAge: Yup.boolean().oneOf([true], "You must agree to continue"),
  });

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
    if (!/^\d?$/.test(value)) return; // Allow only one digit (0-9)

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input field if the current input has a value
    if (value && index < otp.length - 1) {
      otpRefs.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleNumericInput = (value) =>
    value.replace(/[^0-9]/g, "").slice(0, 10);

  const handleSubmits = async (values) => {
    if (!values) {
      console.error("No values provided to handleSubmits.");
      return;
    }

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
      const response = await axios.post("app/auth/sign-up", {
        ...values,
        phone: formattedPhone,
      });

      const tokens = response.data.data.token;
      localStorage.setItem("tokens", tokens);
      localStorage.removeItem(localStorageKey);

      Swal.fire({
        icon: "success",
        title: response.data.message,
        showConfirmButton: false,
        timer: 4000,
      }).then(() => {
        openModals();
        setTimer(60)

        setEmails(values.email);
        // onClose();
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: error.response ? error.response.data.message : error.message,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    } finally {
     
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  const resendOtp = async () => {
    if (timer > 0) return; // Prevent resending if timer is active
    setTimer(60);
    let token = localStorage.getItem("tokens");

    try {
      const response = await axios.post(
        // "resend-otp-user-verification",
        "app/auth/resend-otp-user-verification",
        { emailOrPhone: emails }
      //  ,        {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      );

      console.log("resend", response.data.data.tokens);

      // Save the new token
      localStorage.setItem("tokens", response.data.data.token);

      Swal.fire({
        icon: "success",
        text: response.data.message,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    } catch (error) {
      setTimer(0);

      Swal.fire({
        icon: "error",
        text: error.response ? error.response.data.message : error.message,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    }
  };

  // Function to verify the OTP
  const verifyOtp = async () => {
    try {
      const token = localStorage.getItem("tokens");
      const response = await axios.post(
        "app/auth/verify-user",
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
          confirmButtonText: "OK",
          allowOutsideClick: false,
        }).then(() => {
          localStorage.clear();
          window.location.reload();
        });
      } else {
        Swal.fire({
          icon: "error",
          text: response.data.message,
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.response ? error.response.data.message : error.message,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    }
  };

  const handleSocialSignup = async (values) => {
    const formattedPhone = values.phone.startsWith("+91")
      ? values.phone
      : `+91${values.phone}`;
    console.log("values", values);

    try {
      const response = await axios.post(
        // ""
        "app/auth/social-login",
        {
          ...values,
          phone: formattedPhone,
          signup_method: values.signup_method,
          device_type: "website",
          device_token: localStorage.getItem("device_token"),
        }
      );
      const token = response.data.data.token;
      localStorage.setItem("Web-token", token);
      Swal.fire({
        title: response.data.message,
        allowOutsideClick: false,
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
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Signup Failed",
          text: error.message,
          confirmButtonText: "OK",
          allowOutsideClick: false,
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
    paths: ["/terms", "/privacy", "/cookies"],
  };

  useEffect(() => {
    if (isModals || isOpenness) {
      document.body.style.overflow = "hidden"; // Disable background scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable background scrolling
    }

    // Cleanup on component unmount or modal close
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModals, isOpenness]);

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
                            // onClick={Closed}
                            onClick={() => {
                              formikRef.current?.resetForm();
                              Closed();
                              localStorage.removeItem(localStorageKey);
                            }}
                          >
                            <img
                              src={`${process.env.PUBLIC_URL}/images/cross_icon.png`}
                              alt="Close"
                            />
                          </button>
                        </div>
                        <h2>Sign Up</h2>

                        <Formik
                          innerRef={formikRef}
                          initialValues={initialValues}
                          validationSchema={validateFields}
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
                                  className="error-message"
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
                                  className="error-message"
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
                                <ErrorMessage
                                  name="email"
                                  component="div"
                                  className="error-message"
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
                                  className="error-message"
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
                                      className="error-message"
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
                                      className="error-message"
                                    />
                                  </div>
                                </>
                              )}

                              {/* Terms & Conditions */}

                              <div className="remeberrecoverydiv mb-0">
                                <div className="rememebrmediv">
                                  <Field
                                    type="checkbox"
                                    name="agreeAllLegal"
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
                                            state={{ popupOpen: false }}
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
                              <ErrorMessage
                                      name="agreeAllLegal"
                                      component="div"
                                      className="error-message"
                                    />

                              {/* Rules of Play & FAQ */}
                              <div className="remeberrecoverydiv mb-0">
                                <div className="rememebrmediv">
                                  <Field
                                    type="checkbox"
                                    name="agreeRules"
                                    className="checkboxemeber"
                                  />
                                  {/* <label className="labelrememebrme">
                                    I have read & agree with{" "}
                                    <Link
                                      to="/rules"
                                      state={{ popupOpen: false }}
                                     
                                    >
                                      Rules of Play & FAQ's
                                    </Link>
                                  </label> */}
                                  <label className="labelrememebrme">
                                    I have read & agree with{" "}
                                    <Link
                                      to="/rules"
                                      state={{ popupOpen: false }}
                                      onClick={() =>
                                        console.log("popupOpen:", false)
                                      }
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
                              
                              <div className="remeberrecoverydiv mb-0">
                                <div className="rememebrmediv">
                                  <Field
                                    type="checkbox"
                                    name="agreeAge"
                                    className="checkboxemeber"
                                  />
                                  <label className="labelrememebrme">
                                    I hereby confirm and acknowledge that I am
                                    not a minor, and that I am least 18 years
                                    old as of today’s date.
                                  </label>
                                </div>
                              </div>
                              <ErrorMessage
                                      name="agreeAge"
                                      component="div"
                                      className="error-message"
                                    />

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
                                          Closed()
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
                                          Closed()
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
                                          Closed()
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
                                      // setLoginPopup(!isLoginPopup);
                                      localStorage.removeItem("showSignup");
                                    
                                      back()
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
      {isLoginPopup && <Login isVisible={isLoginPopup} setLoginOpen={true} onClose={ClosePopup} />}

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
                                  ref={(el) => (otpRefs.current[index] = el)} // Set ref for each input
                                  type="text"
                                  className="otp__digit"
                                  value={digit}
                                  onChange={(e) =>
                                    handleInputChange(index, e.target.value)
                                  }
                                  onKeyDown={(e) => handleKeyPress(e, index)}
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
                              disabled={timer > 0}
                            >
                              {timer > 0
                                ? `Resend OTP in ${timer}s`
                                : "Resend OTP"}
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
