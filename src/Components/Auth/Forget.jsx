import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import OTPverify from "./OTPverify";

function Forget({ onClosed }) {
  const [showOTPS, setShowOTPS] = useState(false);
  const [responseData, setResponseData] = useState(null); // Store the token and email/phone
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent multiple submissions

  const validationSchema = Yup.object({
    emailOrPhone: Yup.string()
      .required("This field is required")
      .test(
        "is-email-or-phone",
        "Please enter a valid email or phone number",
        (value) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const phoneRegex = /^[6-9]\d{9}$/; // Validates Indian mobile numbers without country code
          return emailRegex.test(value) || phoneRegex.test(value);
        }
      ),
  });

  const PhoneSubmit = async (values, { resetForm }) => {
    try {
      setIsSubmitting(true); // Disable buttohin

      // Ensure valid phone numbers are always prefixed with +91
      const isPhoneNumber = /^[6-9]\d{9}$/.test(values.emailOrPhone);
      if (isPhoneNumber && !values.emailOrPhone.startsWith("+91")) {
        values.emailOrPhone = `+91${values.emailOrPhone}`;
      }

      const response = await axios.post(`app/auth/send-otp`, values);

      Swal.fire({
        icon: "success",
        text: response.data.message,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });

      // Save token and response data
      localStorage.setItem("tokens", response.data.data.token);
      setResponseData({ emailOrPhone: values.emailOrPhone });

      resetForm(); // Reset the form
      handleOTP();
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.response?.data?.message,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    } finally {
      setIsSubmitting(false); // Re-enable button
    }
  };

  const handleOTP = () => {
    setShowOTPS(true);
  };

  return (
    <div
      className={`signinpopup_main show`}
      id="forgotpass_mainnew_popup"
      style={{ display: "block" }}
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
                          className="crossbtn_signinpopupclose forgotpass_popup_crossbtn"
                          onClick={onClosed}
                        >
                          <img
                            src={`${process.env.PUBLIC_URL}/images/cross_icon.png`}
                            alt="Close"
                          />
                        </button>
                      </div>
                      <h2>Forgot Password</h2>
                      <p className="forgotheadingtext">
                        Please Enter the registered Email / Mobile Number
                      </p>
                      <Formik
                        initialValues={{ emailOrPhone: "" }}
                        validationSchema={validationSchema}
                        onSubmit={PhoneSubmit}
                      >
                        {({ errors, touched }) => (
                          <Form>
                            <div className="formstart forgotpass_inputmaindiv">
                              <div className="form-control frmctrldiv">
                                <Field
                                  name="emailOrPhone"
                                  type="text"
                                  className={`error ${
                                    errors.emailOrPhone && touched.emailOrPhone
                                      ? "field-error"
                                      : ""
                                  }`}
                                  placeholder="E-Mail / Mobile Number"
                                />
                                <ErrorMessage name="emailOrPhone">
                                  {(msg) => (
                                    <span
                                      style={{
                                        color: "red",
                                        display: "block",
                                        backgroundClip: "blue",
                                      }}
                                    >
                                      {msg}
                                    </span>
                                  )}
                                </ErrorMessage>
                              </div>
                              <div className="form-control loginformctrl">
                                <button
                                  type="submit"
                                  className="loginbtn sbmtbtn_showotpscreen"
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting ? "Submitting..." : "Submit"}
                                </button>
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
      {showOTPS && (
        <OTPverify
          onClosedss={() => setShowOTPS(false)}
          emailOrPhone={responseData?.emailOrPhone} // Pass email/phone to OTPverify
        />
      )}
    </div>
  );
}

export default Forget;
