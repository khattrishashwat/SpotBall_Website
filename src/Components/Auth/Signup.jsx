import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import axios from "axios";

const Signup = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const validation = Yup.object().shape({
    first_name: Yup.string().required("First Name is required"),
    last_name: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Number is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .max(16, "Password must be at most 16 characters long")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[@$!%*?&#]/,
        "Password must contain at least one special character"
      ),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleSignup = async (values) => {
    setIsLoading(true);
    try {
      const response = await axios.post("sign-up", values);
      Swal.fire({
        icon: "success",
        title: response.data.message, // Assuming response data has message
        showConfirmButton: false,
        timer: 1000,
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

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div
      className="signinpopup_main show"
      id="signup_popup"
      style={{ display: "block" }}
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
                          onClick={onClose}
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
                        // validationSchema={validation}
                        onSubmit={handleSignup}
                      >
                        {({ isSubmitting, errors }) => (
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
                                placeholder="Email (Optional)"
                              />
                            </div>

                            {/* Phone */}
                            <div className="form-control frmctrldiv">
                              <Field
                                type="text"
                                name="phone"
                                placeholder="Mobile number"
                              />
                              <ErrorMessage
                                name="phone"
                                component="div"
                                className="field_required"
                              />
                            </div>

                            {/* Password */}
                            <div className="form-control frmctrldiv">
                              <Field
                                type={showNewPassword ? "text" : "password"}
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

                            {/* Confirm Password */}
                            <div className="form-control frmctrldiv">
                              <Field
                                type={showConfirmPassword ? "text" : "password"}
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

                            {/* Terms & Conditions */}
                            <div className="remeberrecoverydiv">
                              <div className="rememebrmediv">
                                <Field
                                  type="checkbox"
                                  name="agreeTerms"
                                  className="checkboxemeber"
                                />
                                <label className="labelrememebrme">
                                  I have read & agree with{" "}
                                  <Link to="/legal_terms" onClick={onClose}>
                                    Terms & Conditions
                                  </Link>
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
                                  <Link to="/legal_terms" onClick={onClose}>
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

                            {/* Already have an account */}
                            <div className="registerdiv">
                              <p>
                                Already have an account?{" "}
                                <a
                                  onClick={onClose}
                                  className="showsigninbtn_div"
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
  );
};

export default Signup;
