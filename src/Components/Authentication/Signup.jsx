import React, { useState, useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import axios from "axios";

function Signup() {
  const formikRef = useRef(null);
  const navigate = useNavigate();

  const [emails, setEmails] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleNumericInput = (value) =>
    value.replace(/[^0-9]/g, "").slice(0, 10);

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
        navigate("/otps", { state: { email: values.email } });
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
  const handleLogin = () => {
    navigate("/");
  };

  return (
    <>
      <section className="adminloginsection" style={{ height: "100svh" }}>
        <div className="container contfld-loginform">
          <div className="col-md-12 col12mainloginform">
            <div className="row rowmaqinloginform">
              <div className="col-md-12 col12loginseconddiv">
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
                <div className="col-md-5 col6formsidediv">
                  <div className="loginologo">
                    <img
                      src={`${process.env.PUBLIC_URL}/images/logo.png`}
                      onClick={handleLogin}
                    />
                  </div>
                  <div className="colformlogin">
                    <Formik
                      innerRef={formikRef}
                      initialValues={initialValues}
                      validationSchema={validateFields}
                      validateOnChange={true}
                      validateOnBlur={true}
                      onSubmit={handleSignup}
                    >
                      {({ isSubmitting, errors, touched, setFieldValue }) => (
                        <Form>
                          <div className="login-heading">
                            <h2>Sign Up</h2>
                          </div>
                          <div className="formstart signup">
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
                                onKeyDown={(e) => {
                                  if (
                                    e.target.value.length === 0 &&
                                    e.key === " "
                                  ) {
                                    e.preventDefault();
                                  }
                                }}
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
                                placeholder="Mobile no."
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
                            <div className="form-control frmctrldiv ">
                              <Field
                                type={showNewPassword ? "text" : "password"}
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
                              <i
                                onClick={toggleNewPasswordVisibility}
                                className={
                                  showNewPassword
                                    ? "fa fa-eye"
                                    : "fa fa-eye-slash"
                                }
                                aria-hidden="true"
                              />
                              <ErrorMessage
                                name="password"
                                component="div"
                                className="error-message"
                              />
                            </div>
                            <div className="form-control frmctrldiv formrgnbtm0">
                              <Field
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirm_password"
                                placeholder="Confirm Pass"
                                onChange={(e) =>
                                  handleFieldChange(
                                    "confirm_password",
                                    e.target.value,
                                    setFieldValue
                                  )
                                }
                              />
                              <i
                                onClick={toggleConfirmPasswordVisibility}
                                className={
                                  showConfirmPassword
                                    ? "fa fa-eye"
                                    : "fa fa-eye-slash"
                                }
                                aria-hidden="true"
                              />
                              <ErrorMessage
                                name="confirm_password"
                                component="div"
                                className="error-message"
                              />
                            </div>
                          </div>
                          <div className="remeberrecoverydiv">
                            <div className="rememebrmediv">
                              <Field
                                type="checkbox"
                                name="agreeAllLegal"
                                className="checkboxemeber"
                              />
                              <label
                                htmlFor="rememebrbtn"
                                className="labelrememebrme"
                              >
                                I have read &amp; agree with{" "}
                                <Link to="/terms">Terms &amp; Conditions</Link>,{" "}
                                <Link to="/privacy">Privacy Policy</Link> &amp;{" "}
                                <Link to="/cookies">Cookie Policy</Link>
                              </label>
                              <ErrorMessage
                                name="agreeAllLegal"
                                component="div"
                                className="error-message"
                              />
                            </div>
                          </div>
                          <div className="remeberrecoverydiv">
                            <div className="rememebrmediv">
                              <Field
                                type="checkbox"
                                name="agreeRules"
                                className="checkboxemeber"
                              />
                              <label
                                htmlFor="rememebrbtn2"
                                className="labelrememebrme"
                              >
                                I have read &amp; agree with{" "}
                                <Link to="/rules">
                                  Rules of Play &amp; FAQ's
                                </Link>
                              </label>
                              <ErrorMessage
                                name="agreeRules"
                                component="div"
                                className="error-message"
                              />
                            </div>
                          </div>
                          <div className="remeberrecoverydiv">
                            <div className="rememebrmediv">
                              <Field
                                type="checkbox"
                                name="agreeAge"
                                className="checkboxemeber"
                              />
                              <label
                                htmlFor="rememebrbtn2"
                                className="labelrememebrme"
                              >
                                I hereby confirm and acknowledge that I am not a
                                minor, and that I am least 18 years old as of
                                today’s date.
                              </label>
                              <ErrorMessage
                                name="agreeAge"
                                component="div"
                                className="error-message"
                              />
                            </div>
                          </div>
                          <div className="form-control loginformctrl">
                            <button
                              type="submit"
                              className="loginbtn"
                              disabled={isSubmitting || isLoading}
                            >
                              {isLoading ? "Loading..." : "Sign Up"}
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                    <div className="registerdiv">
                      <p>
                        Already have an account?{" "}
                        <Link to="/login">Sign In</Link>{" "}
                      </p>
                    </div>

                    <div className="signupwithsocial_div">
                      <p>or Sign Up using</p>
                      <div className="signupsociallinks">
                        <ul>
                          <li>
                            <a style={{ cursor: "pointer" }}>
                              <img
                                src={`${process.env.PUBLIC_URL}/image/google_icon.png`}
                                alt="Google"
                              />
                            </a>
                          </li>
                          <li>
                            <a style={{ cursor: "pointer" }}>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Signup;
