import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";
import OTPverify from "./OTPverify";

function Forget({ onClosed }) {
  const [showOTPS, setShowOTPS] = useState(false);
  const [responseData, setResponseData] = useState(null); // Store the token and email

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const PhoneSubmit = async (values) => {
    try {
      const response = await axios.post("send-otp", values);
      Swal.fire({
        icon: "success",
        text: response.data.message,
      });
      setResponseData({
        token: response.data.data.token, // Store token
        email: values.email, // Store email
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
                        initialValues={{ email: "" }}
                        onSubmit={PhoneSubmit}
                      >
                        {({ handleSubmit }) => (
                          <Form onSubmit={handleSubmit}>
                            <div className="formstart forgotpass_inputmaindiv">
                              <div className="form-control frmctrldiv">
                                <Field
                                  name="email"
                                  type="text"
                                  className="error"
                                  placeholder="E-Mail / Mobile Number"
                                />
                                <ErrorMessage
                                  name="email"
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
          token={responseData?.token} // Pass token to OTPverify
          email={responseData?.email} // Pass email to OTPverify
        />
      )}
    </div>
  );
}

export default Forget;
