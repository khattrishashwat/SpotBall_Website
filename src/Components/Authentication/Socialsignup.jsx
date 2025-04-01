import React, { useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import * as Yup from "yup";
import axios from "axios";

function Socialsignup() {
  const formikRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

  const getStoredValues = () => {
    try {
      const storedData = localStorage.getItem("UIDNotFound");
      if (storedData && storedData !== "undefined") {
        return { ...defaultValues, ...JSON.parse(storedData) };
      }
    } catch (error) {
      console.error("Error parsing local storage:", error);
    }
    return defaultValues;
  };

  const storedValues = getStoredValues();

  const validationSchema = Yup.object().shape({
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

  const updateLocalStorage = (values) => {
    localStorage.setItem("UIDNotFound", JSON.stringify(values));
  };

  const handleFieldChange = (field, value, setFieldValue, values) => {
    setFieldValue(field, value);
    updateLocalStorage({ ...values, [field]: value });
  };

  const handleNumericInput = (e, setFieldValue, values) => {
    const numericValue = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFieldValue("phone", numericValue);
    updateLocalStorage({ ...values, phone: numericValue });
  };

  const handleSocialSignup = async (values) => {
    setIsLoading(true);
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
        localStorage.setItem("Web-token", response.data.data.token);
        Swal.fire({
          title: response.data.message,
          allowOutsideClick: false,
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          localStorage.removeItem("UIDNotFound");
          navigate("/");
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Social Signup Failed",
        text:
          error.response?.data?.message ||
          error.message ||
          "An error occurred. Please try again.",
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
    <section className="adminloginsection">
      <div className="container contfld-loginform">
        <div className="col-md-12 col12mainloginform">
          <div className="row rowmaqinloginform">
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
                  initialValues={storedValues}
                  validationSchema={validationSchema}
                  validateOnChange
                  validateOnBlur
                  onSubmit={handleSocialSignup}
                >
                  {({ isSubmitting, setFieldValue, values }) => (
                    <Form>
                      <div className="login-heading">
                        <h2>Social Sign Up</h2>
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
                                setFieldValue,
                                values
                              )
                            }
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
                          />
                          <ErrorMessage
                            name="phone"
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
                            I have read & agree with{" "}
                            <Link to="/terms">Terms & Conditions</Link>,{" "}
                            <Link to="/privacy">Privacy Policy</Link>, and{" "}
                            <Link to="/cookies">Cookie Policy</Link>.
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
                            <Link to="/rules">Rules of Play &amp; FAQ's</Link>
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
                          {isLoading ? "Loading..." : "Social Sign Up"}
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
    </section>
  );
}

export default Socialsignup;
