import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import axios from "axios";
import Forget from "./Forget";
import Signup from "./Signup";
import Loader from "../Loader/Loader";
import {
  messaging,
  getToken,
  onMessage,
  LoginWithGoogle,
  LoginWithTwitter,
  LoginWithFacebook,
} from "../FirebaseCofig/FirebaseConfig";

import { GoogleLogin } from "@react-oauth/google";

function Login({ isVisible, onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isLoading, setIsLoading] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const LoginValues = {
    emailOrPhone: "",
    password: "",
  };

  const validation = Yup.object().shape({
    emailOrPhone: Yup.string().required("Phone number or email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password should be between 8-16 characters long")
      .max(16, "Password should be between 8-16 characters long")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[@$!%*?&#]/,
        "Password must contain at least one special character"
      ),
  });

  const Login = async (values) => {
    console.log("Attempting to login with values:", values);

    setIsLoading(true);

    try {
      // Retrieve Firebase token for push notifications
      const device_token = await getToken(messaging, {
        vapidKey:
          "BNkI-Se9LgfgnkAxsoNDTe3uQDR7HBWV6rY-Mhc3A6AioGIl-VnUn49NTAdTZHgBnt6id6KokU02Pku4G0GpYxA",
      });

      if (!device_token) {
        console.log(
          "No Firebase token available. Request permission to generate one."
        );
        Swal.fire({
          icon: "error",
          title: "Notification Permission Required",
          text: "Please enable notifications to continue.",
        });
        setIsLoading(false);
        return;
      }

      console.log("Device token:", device_token);

      const response = await axios.post("login", {
        ...values,
        device_token,
        device_type: "website",
      });

      console.log("Login successful! Response:", response.data.data);

      // Store the backend token in local storage
      localStorage.setItem("token", response.data.data.token);

      // Show success message
      Swal.fire({
        icon: "success",
        title: response.data.message,
        showConfirmButton: false,
        timer: 1000,
      });
      window.location.reload();
      navigate("/");
      onClose();
    } catch (error) {
      console.error(
        "Login failed:",
        error.response ? error.response.data : error.message
      );

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response ? error.response.data.message : error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = () => {
    setShowSignup(true);
    onClose();
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    onClose();
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
                            onClick={onClose}
                          >
                            <img
                              src={`${process.env.PUBLIC_URL}/images/cross_icon.png`}
                              alt="Close"
                            />
                          </button>
                        </div>
                        <h2>Sign In</h2>

                        <Formik
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
                                      <li>
                                        <a href="#">
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
                                            // src="images/insta_icon.png"
                                            alt="Instagram"
                                          />
                                        </a>
                                      </li>
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

      {/* Sign Up Modal */}
      {showSignup && (
        <Signup
          isOpenness={() => setShowSignup(false)}
          onClosed={() => setShowSignup(false)}
        />
      )}
    </>
  );
}

export default Login;
