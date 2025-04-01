import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";
import axios from "axios";
import {
  messaging,
  getToken,
  LoginWithGoogle,
  LoginWithFacebook,
} from "../FirebaseCofig/FirebaseConfig";

function Login() {
  const formikRef = useRef(null);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    navigate("/forgot");
  };
  const handleLogin = () => {
    navigate("/");
  };

  const LoginValues = {
    emailOrPhone: "",
    password: "",
  };

  const LoginSchema = Yup.object().shape({
    emailOrPhone: Yup.string()
      .required("Email or Mobile Number is required")
      .test(
        "emailOrPhone",
        "Invalid Email or Phone Number",
        (value) =>
          /^[\w.-]+@[\w.-]+\.\w{2,4}$/.test(value) || /^\d{10,15}$/.test(value)
      ),
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
  });

  const Login = async (values) => {
    setIsLoading(true);

    const device_token = localStorage.getItem("device_token");

    if (!device_token) {
      console.warn("Device token not found.");

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
        imageUrl: `${process.env.PUBLIC_URL}/image/notificationImg.jpg`,
        imageWidth: 300,
        imageHeight: 200,
        imageAlt: "Custom image",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });

      setIsLoading(false);
      return;
    }

    // console.log("Device token:", device_token);

    // Check if emailOrPhone is a phone number and doesn't already start with +91
    const isPhoneNumber = /^[6-9]\d{9}$/.test(values.emailOrPhone);
    if (isPhoneNumber && !values.emailOrPhone.startsWith("+91")) {
      values.emailOrPhone = `+91${values.emailOrPhone}`;
    }

    try {
      const response = await axios.post("app/auth/login", {
        ...values,
        device_token,
        device_type: "website",
      });

      // console.log("Login successful! Response:", response.data.data);

      if (!response.data.data.is_verified_user) {
        navigate("/otps", { state: { email: values.email } });
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

  const requestFirebaseToken = async () => {
    try {
      const currentToken = await getToken(messaging, {
        vapidKey:
          "BC1L5qE6WKJSgEU46nuptM9bCKtljihEjAikiBrpzRIomSiw6Dd9Wq6jmM4CfIHJokkhmqblgU5qbVaqizNlmeo",
      });

      if (currentToken) {
        // console.log("FCM Token:", currentToken);
        localStorage.setItem("device_token", currentToken);

        // Optionally, send the token to your backend for push notifications
      } else {
        console.log("No FCM token available. Request permission.");
      }
    } catch (error) {
      console.error("FCM Token Error:", error);
      localStorage.setItem("device_token", "currentToken");
    }
  };
  useEffect(() => {
    requestFirebaseToken();
  }, []);
  return (
    <>
      <section className="adminloginsection" style={{ height: "100svh" }}>
        <div className="container contfld-loginform">
          <div className="col-md-12 col12mainloginform">
            <div className="row rowmaqinloginform">
              <div className="col-lg-12 col12loginseconddiv">
                <div className="col-lg-7 col6sliderdiv">
                  <div className="login_left_img banner">
                    <div className="banner-img">
                      <img
                        className="img-fluid hori-move"
                        src={`${process.env.PUBLIC_URL}/images/aaa.png`}
                        data-swiper-animation="fadeIn"
                        data-duration="5.0s"
                        data-delay="1.0s"
                        alt=""
                      />
                      <div className="pattern-04">
                        <img
                          className=""
                          src={`${process.env.PUBLIC_URL}/images/Artboard 2@4x.png`}
                          alt=""
                        />
                      </div>
                      <div
                        className="pattern-03 login"
                        data-swiper-animation="fadeIn"
                        data-duration="1.5s"
                        data-delay="1.0s"
                      >
                        <img
                          className="img-fluid vert-move"
                          src={`${process.env.PUBLIC_URL}/images/target.png`}
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-5 col6formsidediv">
                  <div className="loginologo">
                    <img
                      src={`${process.env.PUBLIC_URL}/images/logo.png`}
                      onClick={handleLogin}
                    />
                  </div>

                  <Formik
                    innerRef={formikRef}
                    initialValues={LoginValues}
                    validationSchema={LoginSchema}
                    onSubmit={Login}
                    validateOnChange={true}
                    validateOnBlur={true}
                  >
                    <Form>
                      <div className="colformlogin">
                        <div className="login-heading">
                          <h2>Sign In</h2>
                        </div>
                        <div className="formstart">
                          <div className="form-control frmctrldiv">
                            <Field
                              type="text"
                              name="emailOrPhone"
                              className="error"
                              placeholder="Email / Mobile Number"
                              aria-label="Email or Phone Number"
                              onInput={(e) => {
                                e.target.value = e.target.value.toLowerCase();
                              }}
                            />
                            <ErrorMessage
                              name="emailOrPhone"
                              component="div"
                              className="error-message"
                            />
                          </div>
                          <div className="form-control frmctrldiv formrgnbtm0">
                            <Field
                              type={showPassword ? "text" : "password"}
                              name="password"
                              className="error"
                              id="createpass_inp"
                              placeholder="Password"
                              aria-label="Password"
                              autoComplete="new-password"
                            />
                            <i
                              className={
                                showPassword
                                  ? "fa fa-eye iei"
                                  : "fa fa-eye-slash iei"
                              }
                              aria-hidden="true"
                              onClick={togglePasswordVisibility} // Fix visibility toggle
                              style={{ cursor: "pointer" }}
                            />
                            <ErrorMessage
                              name="password"
                              component="div"
                              className="error-message"
                            />
                          </div>
                        </div>
                        <div className="remeberrecoverydiv">
                          <div className="forgotpassword">
                            <a>
                              <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="frgtbtn"
                              >
                                Forgot Password?
                              </button>
                            </a>
                          </div>
                        </div>
                        <div className="form-control loginformctrl">
                          <button type="submit" className="loginbtn">
                            {isLoading ? "Loading..." : "Sign In"}
                          </button>
                        </div>
                        <div className="registerdiv">
                          <p>
                            Don't have an account{" "}
                            <Link to="/signup">Sign Up</Link>{" "}
                          </p>
                        </div>
                        <div className="signupwithsocial_div">
                          <p>or Sign In using</p>
                          <div className="signupsociallinks">
                            <ul>
                              <li>
                                <a
                                  onClick={() => {
                                    LoginWithGoogle();
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  <img
                                    src={`${process.env.PUBLIC_URL}/image/google_icon.png`}
                                    alt="Google"
                                  />
                                </a>
                              </li>
                              <li>
                                <a
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    LoginWithFacebook();
                                  }}
                                >
                                  <img
                                    src={`${process.env.PUBLIC_URL}/image/facebook_icon.png`}
                                    alt="Facebook"
                                  />
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </Form>
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;
