import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import OTPverify from "./OTPverify";
// import * as Yup from "yup";

function Forget({ onClosed }) {
  const [showOTPS, setShowOTPS] = useState(false);
  const [responseData, setResponseData] = useState(null); // Store the token and email

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
      )
      .test(
        "add-country-code",
        "Please add +91 before your phone number",
        (value) => {
          const phoneRegex = /^[6-9]\d{9}$/; // Validates Indian mobile numbers without country code
          if (phoneRegex.test(value)) {
            return false; // Fail if a phone number without +91
          }
          return true; // Pass for email or phone with +91
        }
      ),
  });

  const PhoneSubmit = async (values) => {
    try {
      // Prepend +91 to the number if it's a valid Indian number without country code
      const isPhoneNumber = /^[6-9]\d{9}$/.test(values.emailOrPhone);
      if (isPhoneNumber) {
        values.emailOrPhone = `+91${values.emailOrPhone}`;
      }

      const response = await axios.post("send-otp", values);
      Swal.fire({
        icon: "success",
        text: response.data.message,
      });
      localStorage.setItem("tokens", response.data.data.token);

      setResponseData({
        emailOrPhone: values.emailOrPhone,
      });
      handleOTP();
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.response ? error.response.data.message : error.message,
      });
    }
  };

  const handleOTP = () => {
    setShowOTPS(true);
    // onClosed();
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
                        // validationSchema={validationSchema}
                        onSubmit={PhoneSubmit}
                      >
                        {({ handleSubmit }) => (
                          <Form onSubmit={handleSubmit}>
                            <div className="formstart forgotpass_inputmaindiv">
                              <div className="form-control frmctrldiv">
                                <Field
                                  name="emailOrPhone"
                                  type="text"
                                  className="error"
                                  placeholder="E-Mail / Mobile Number"
                                />
                                <ErrorMessage
                                  name="emailOrPhone"
                                  component="span"
                                  className="field_required"
                                />
                              </div>
                              <div className="form-control loginformctrl">
                                <button
                                  type="submit"
                                  className="loginbtn sbmtbtn_showotpscreen"
                                >
                                  Submit
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
          emailOrPhone={responseData?.emailOrPhone} // Pass email to OTPverify
        />
      )}
    </div>
  );
}

export default Forget;
