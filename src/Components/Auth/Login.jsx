import React, { useState, useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import axios from "axios";
import Forget from "./Forget";
import Signup from "./Signup";
import SocialSignUP from "./SocialSignUp";
import "./notificationImg.jpg";
import {
  messaging,
  getToken,
  onMessage,
  LoginWithApple,
  LoginWithGoogle,
  LoginWithTwitter,
  LoginWithFacebook,
} from "../FirebaseCofig/FirebaseConfig";

import { GoogleLogin } from "@react-oauth/google";

function Login({ isVisible, onClose }) {
  // console.log("logincomponent");
  const [timer, setTimer] = useState(0); // Timer state for resend OTP
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isModals, setIsModals] = useState("");
  const [emails, setEmails] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const stateFromLocalStorage = localStorage.getItem("showSignup");
  let state = false;
  if (stateFromLocalStorage) {
    state = true;
  }
  const formikRef = useRef(null);

  const otpRefs = useRef([]);

  const [showSignup, setShowSignup] = useState(state);
  const [isLoading, setIsLoading] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [isSocialSignup, setIsSocialSignup] = useState(false);
  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  useEffect(() => {
    const socialsLocalStorage = localStorage.getItem("isSocialSignup");
    if (socialsLocalStorage) {
      setIsSocialSignup(true);
    }

    const userDetails = localStorage.getItem("UIDNotFound");
    if (userDetails) {
      handleSocialSignup();
    }
  }, []);

  const openModals = () => {
    setIsModals(true);
  };
  const closeModals = () => {
    setIsModals(false);
  };
  const LoginValues = {
    emailOrPhone: "",
    password: "",
  };

  // const Login = async (values) => {
  //   console.log("Attempting to login with values:", values);

  //   // Check if the input is a phone number and prepend country code if needed
  //   const isPhoneNumber = /^[6-9]\d{9}$/.test(values.emailOrPhone);
  //   if (isPhoneNumber) {
  //     values.emailOrPhone = `+91${values.emailOrPhone}`;
  //   }

  //   setIsLoading(true);

  //   // Get device token from localStorage
  //   const device_token = localStorage.getItem("device_token");

  //   if (device_token === null) {
  //     // If device token is not found, show a notification prompt
  //     Swal.fire({
  //       title: "Please allow notifications",
  //       html: `
  //     <div class="notification_settingdiv">
  //       <h2>Notification Setting</h2>
  //       <p>Open Chrome.</p>
  //       <p>At the top right, select More <span><i class="fa fa-ellipsis-v" aria-hidden="true"></i> <i class="fa fa-chevron-right" aria-hidden="true"></i></span> <b>Settings</b> <span><i class="fa fa-chevron-right" aria-hidden="true"></i></span> Privacy and security.</p>
  //       <p>Select <b>Site settings</b>.</p>
  //       <p>Under “Permissions,” select <b>Notification</b>.</p>
  //     </div>
  //   `,
  //       imageUrl: `${process.env.PUBLIC_URL}/images/notificationImg.jpg`,
  //       imageWidth: 300,
  //       imageHeight: 200,
  //       imageAlt: "Custom image",
  //       confirmButtonText: "OK",
  //       allowOutsideClick: false,
  //     });
  //     setIsLoading(false);
  //     return; // Exit if device token is not available
  //   }

  //   console.log("Device token:", device_token);

  //   try {
  //     const response = await axios.post("app/auth/login", {
  //       ...values,
  //       device_token,
  //       device_type: "website",
  //     });

  //     console.log("Login successful! Response:", response.data.data);

  //     // Check if OTP has been sent or user is not verified
  //     if (response.data.data.is_verified_user === false) {
  //       openModals();
  //       setEmails(response.data.data.email);
  //       localStorage.setItem("tokens", response.data.data.token);
  //     } else {
  //       // Store the backend token in local storage
  //       localStorage.setItem("Web-token", response.data.data.token);

  //       // Show success message
  //       Swal.fire({
  //         icon: "success",
  //         title: response.data.message,
  //         allowOutsideClick: false,
  //         showConfirmButton: false,
  //         timer: 1000,
  //       });

  //       // Redirect after successful login
  //       navigate("/");
  //       onClose();
  //     }
  //   } catch (error) {
  //     console.error(
  //       "Login failed:",
  //       error.response ? error.response.data : error.message
  //     );

  //     Swal.fire({
  //       icon: "error",
  //       title: "Login Failed",
  //       text: error.response ? error.response.data.message : error.message,
  //       confirmButtonText: "OK",
  //       allowOutsideClick: false,
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const Login = async (values) => {
    console.log("Attempting to login with values:", values);

    // Ensure values are present before proceeding
    // if (!values || !values.emailOrPhone) {
    //   console.error("Login values are missing.");
    //   return;
    // }

    // Check if the input is a phone number and prepend country code if needed
    const isPhoneNumber = /^[6-9]\d{9}$/.test(values.emailOrPhone);
    if (isPhoneNumber) {
      values.emailOrPhone = `+91${values.emailOrPhone}`;
    }

    setIsLoading(true);

    const device_token = localStorage.getItem("device_token");

    if (!device_token) {
      console.warn("Device token not found.");

      if (values) {
        Swal.fire({
          title: "Please allow notifications",
          html: `
          <div class="notification_settingdiv">
            <h2>Notification Setting</h2> 
            <p>Open Chrome.</p>
            <p>At the top right, select More <span><i class="fa fa-ellipsis-v" aria-hidden="true"></i> <i class="fa fa-chevron-right" aria-hidden="true"></i></span> <b>Settings</b> <span><i class="fa fa-chevron-right" aria-hidden="true"></i></span> Privacy and security.</p>
            <p>Select <b>Site settings</b>.</p>
            <p>Under “Permissions,” select <b>Notification</b>.</p>
          </div>
        `,
          imageUrl: `${process.env.PUBLIC_URL}/images/notificationImg.jpg`,
          imageWidth: 300,
          imageHeight: 200,
          imageAlt: "Custom image",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });
      }

      setIsLoading(false);
      return;
    }

    console.log("Device token:", device_token);

    try {
      const response = await axios.post("app/auth/login", {
        ...values,
        device_token,
        device_type: "website",
      });

      console.log("Login successful! Response:", response.data.data);

      if (!response.data.data.is_verified_user) {
        openModals();
        setEmails(response.data.data.email);
        localStorage.setItem("tokens", response.data.data.token);
      } else {
        localStorage.setItem("Web-token", response.data.data.token);

        Swal.fire({
          icon: "success",
          title: response.data.message,
          allowOutsideClick: false,
          showConfirmButton: false,
          timer: 1000,
        });

        // Redirect after successful login
        navigate("/");
        onClose();
      }
    } catch (error) {
      console.error(
        "Login failed:",
        error.response ? error.response.data : error.message
      );

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response ? error.response.data.message : error.message,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = () => {
    setIsSocialSignup(true);
    onClose(); // Ensure onClose is defined
    // localStorage.setItem("isSocialSignup", "true");
  };

  const closeSocialSignup = () => {
    localStorage.removeItem("isSocialSignup");
    setIsSocialSignup(false);
  };
  const handleSignup = () => {
    setShowSignup(true);
    onClose();
    localStorage.setItem("showSignup", "true");
  };
  const handlebackSignup = () => {
    setShowSignup(false);
    isVisible();
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    onClose();
  };

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden"; // Disable background scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable background scrolling
    }

    // Cleanup on component unmount or modal close
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isVisible]);

  // const handleInputChange = (index, value) => {
  //   const newOtp = [...otp];
  //   newOtp[index] = value.slice(-1); // Only take the last digit
  //   setOtp(newOtp);

  //   // Move to the next input
  //   if (value && index < otp.length - 1) {
  //     const nextInput = document.querySelector(
  //       `.otp__digit:nth-child(${index + 2})`
  //     );
  //     if (nextInput) nextInput.focus();
  //   }
  // };

  const handleInputChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      otpRefs.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    if (isModals) {
      otpRefs.current[0]?.focus();
    }
  }, [isModals]);

  const resendOtp = async () => {
    if (timer > 0) return; // Prevent resending if timer is active
    setTimer(60);
    let token = localStorage.getItem("tokens");

    try {
      const response = await axios.post(
        "app/auth/resend-otp-user-verification",
        { emailOrPhone: emails }, // Directly use email passed as argument
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
  return (
    <>
      <div
        className={`signinpopup_main ${isVisible ? "show" : ""}`}
        id="signin_popup_main_new"
        style={{ display: isVisible ? "block" : "none" }}
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
                            className="crossbtn_signinpopupclose signincrossbtnnew"
                            onClick={() => {
                              onClose();
                              formikRef.current?.resetForm();
                            }}
                          >
                            <img
                              src={`${process.env.PUBLIC_URL}/images/cross_icon.png`}
                              alt="Close"
                            />
                          </button>
                        </div>
                        <h2>Sign In</h2>

                        <Formik
                          innerRef={formikRef}
                          initialValues={LoginValues}
                          onSubmit={Login}
                          validateOnChange={true}
                          validateOnBlur={true}
                        >
                          {({ isSubmitting }) => (
                            <Form>
                              <div className="formstart">
                                <div className="form-control frmctrldiv">
                                  <Field
                                    type="text"
                                    name="emailOrPhone"
                                    className="error"
                                    placeholder="Email / Mobile Number"
                                    aria-label="Email or Phone Number"
                                    onInput={(e) => {
                                      e.target.value =
                                        e.target.value.toLowerCase();
                                    }}
                                  />
                                  <ErrorMessage
                                    name="emailOrPhone"
                                    component="span"
                                    className="field_required"
                                  />
                                </div>

                                <div className="form-control frmctrldiv formrgnbtm0">
                                  <div className="password-field">
                                    <Field
                                      type={showPassword ? "text" : "password"}
                                      name="password"
                                      className="error"
                                      id="createpass_inp"
                                      placeholder="Password"
                                      aria-label="Password"
                                    />
                                    <span
                                      onClick={togglePasswordVisibility}
                                      className="password-toggle"
                                    >
                                      <i
                                        className={
                                          showPassword
                                            ? "fa fa-eye iei"
                                            : "fa fa-eye-slash iei"
                                        }
                                      ></i>
                                    </span>
                                  </div>
                                  <ErrorMessage
                                    name="password"
                                    component="span"
                                    className="field_required"
                                  />
                                </div>

                                {/* Forgot Password Link */}
                                <div className="forgotpassword">
                                  <a
                                    className="frgtbtn forgotpas_btn_signin"
                                    onClick={handleForgotPassword}
                                  >
                                    Forgot Password?
                                  </a>
                                </div>

                                <div className="form-control loginformctrl">
                                  <button
                                    type="submit"
                                    className="loginbtn"
                                    disabled={isSubmitting || isLoading}
                                  >
                                    {isLoading ? "Signing In..." : "Sign In"}
                                  </button>
                                </div>

                                <div className="registerdiv">
                                  <p>
                                    Don’t have an account?{" "}
                                    <a
                                      className="showsignupbtn_main"
                                      onClick={handleSignup}
                                      style={{
                                        cursor: "pointer",
                                      }}
                                    >
                                      Sign Up
                                    </a>
                                  </p>
                                </div>

                                <div className="signupwithsocial_div">
                                  <p>or Sign Up using</p>
                                  <div className="signupsociallinks">
                                    <ul>
                                      <li>
                                        <a
                                          onClick={() => {
                                            // setIsSocialSignup(true);
                                            LoginWithGoogle();
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
                                            // setIsSocialSignup(true);
                                            LoginWithFacebook();
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
                                            // setIsSocialSignup(true);
                                            LoginWithTwitter();
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
                                        <a
                                          onClick={() => {
                                            LoginWithApple();
                                          }}
                                          style={{ cursor: "pointer" }}
                                        >
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

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <Forget onClosed={() => setShowForgotPassword(false)} />
      )}
      {isSocialSignup && (
        <SocialSignUP
          // userDetails={JSON.parse(localStorage.getItem("UIDNotFound"))} // Ensure this data is parsed correctly
          onSocial={handleSocialSignup}
          closeSocial={closeSocialSignup}
        />
      )}

      {/* Sign Up Modal */}
      {showSignup && (
        <Signup
          back={handlebackSignup}
          isOpenness={handleSignup}
          Closed={() => {
            localStorage.removeItem("showSignup");
            setShowSignup(false);
          }}
        />
      )}
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
                          OTP is sent to your registered Email / Mobile Number
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
}

export default Login;
