import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Swal from "sweetalert2";
import axios from "axios";
import {
  signInWithGoogle,
  signWithTwitter,
  signInWithFacebook,
} from "../FirebaseCofig/FirebaseConfig";

const SocialSignUP = ({ onSocial, closeSocial }) => {
  const location = useLocation();
  // console.log("location,location);

  //   useEffect(() => {
  //     // Keep the popup open if navigating to linked pages like terms or rules
  //     if (location.state?.popupOpen) {
  //       onSocial(true);
  //     }
  //   }, [location.state]);
  const initialValues = JSON.parse(localStorage.getItem("UIDNotFound")) || {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    signup_method: "",
    agreeAllLegal: false,
    agreeRules: false,
  };

  const handleFieldChange = (field, value, setFieldValue) => {
    // setFieldValue(field, value);
    // const updatedValues =
    //   JSON.parse(localStorage.getItem("localStorageKey")) || initialValues;
    // updatedValues[field] = value;
    // localStorage.setItem("localStorageKey", JSON.stringify(updatedValues));
  };

  const handleNumericInput = (value) =>
    value.replace(/[^0-9]/g, "").slice(0, 10);

  const handleSocialSignup = async (values) => {
    const formattedPhone = values.phone.startsWith("+91")
      ? values.phone
      : `+91${values.phone}`;
    try {
      const response = await axios.post("social-login", {
        ...values,
        phone: formattedPhone,
        signup_method: values.signup_method,
        device_type: "website",
        device_token: localStorage.getItem("device_token"),
      });
      console.log("social token",response.data)
      const token = response.data.data.token;
      localStorage.setItem("Web-token", token);
      Swal.fire({
        title: response.data.message,
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        localStorage.removeItem("UIDNotFound");

        window.location.reload();
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleSignup = (setFieldValue) => {
    setFieldValue("signup_method", "google");
    signInWithGoogle(setFieldValue);
  };

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

  return (
    <div
      className={`signinpopup_main ${onSocial ? "show" : ""}`}
      //   className="signinpopup_main"
      id="signup_popup"
      //   style={{ display: "block" }}
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
                          onClick={closeSocial}
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
                        onSubmit={handleSocialSignup}
                      >
                        {({ isSubmitting, setFieldValue }) => (
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
                                    setFieldValue
                                  )
                                }
                              />
                              <ErrorMessage
                                name="first_name"
                                component="div"
                                className="field_required"
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
                              />
                              <ErrorMessage
                                name="last_name"
                                component="div"
                                className="field_required"
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
                              />
                            </div>

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
                                      <React.Fragment key={index}>
                                        <Link
                                          to={legalLinks.paths[index]}
                                          onClick={(e) => {
                                            // e.preventDefault();

                                            // Execute your custom logic
                                            closeSocial();
                                            // setTimeout(() => {
                                            //   window.location.href =
                                            //     "/spotsball/web" +
                                            //     legalLinks.paths[index]; // Manually navigate
                                            // }, 0);
                                            // Optionally remove an item from localStorage
                                            localStorage.removeItem(
                                              "isSocialSignup"
                                            );
                                          }}
                                        >
                                          {link}
                                        </Link>
                                        {index < legalLinks.links.length - 1
                                          ? ", "
                                          : ""}
                                      </React.Fragment>
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

                            <div className="form-control loginformctrl">
                              <button
                                type="submit"
                                className="loginbtn"
                                disabled={isSubmitting}
                              >
                                Sign Up
                              </button>
                            </div>

                            <div className="signupwithsocial_div signup_page_socialdiv">
                              <div className="signupsociallinks">
                                <ul>
                                  <li>
                                    <a
                                      onClick={() => {
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
