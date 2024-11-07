import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"; // for validation
import axios from "axios";
import Swal from "sweetalert2";

function NewPassword({ onCloseds, emailOrPhone }) {
  const [showPassword, setShowPassword] = useState(false);
  const [seePassword, setSeePassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setSeePassword(!seePassword);
  };

  // Initial form values
  const initialValues = {
    emailOrPhone: emailOrPhone || "",
    new_password: "",
    confirm_password: "",
  };

  // Validation schema using Yup
  const validationSchema = Yup.object({
    new_password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("new_password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  // Function to handle form submission
  const handleSubmit = async (values) => {
    const token = localStorage.getItem("tokens");

    try {
      const response = await axios.post("reset-password", values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: "success",
        text: response.data.message,
      });

      onCloseds();
      localStorage.removeItem("tokens");
      window.location.reload();
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.response ? error.response.data.message : error.message,
      });
    }
  };

  return (
    <>
      <div
        className="signinpopup_main"
        id="createnewpass_divnew"
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
                            className="crossbtn_signinpopupclose crreatenewpass_crosicon"
                            onClick={onCloseds}
                          >
                            <img
                              src={`${process.env.PUBLIC_URL}/images/cross_icon.png`}
                              alt="Close"
                            />
                          </button>
                        </div>
                        <h2>Enter New Password</h2>
                        <Formik
                          initialValues={initialValues}
                          onSubmit={handleSubmit}
                        >
                          <Form>
                            <div className="formstart createnewpass_formdiv">
                              {/* Password Field */}
                              <div className="form-control frmctrldiv">
                                <Field
                                  name="new_password"
                                  type={showPassword ? "text" : "password"}
                                  className="error"
                                  id="createnewpass_forgot"
                                  placeholder="Password"
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
                                name="new_password"
                                component="span"
                                className="field_required"
                              />

                              {/* Confirm Password Field */}
                              <div className="form-control frmctrldiv">
                                <Field
                                  name="confirm_password"
                                  type={seePassword ? "text" : "password"}
                                  className="error"
                                  id="createnewpass_forgot2"
                                  placeholder="Confirm Password"
                                />
                                <span
                                  onClick={toggleConfirmPasswordVisibility}
                                  className="password-toggle"
                                >
                                  <i
                                    className={
                                      seePassword
                                        ? "fa fa-eye iei"
                                        : "fa fa-eye-slash iei"
                                    }
                                  ></i>
                                </span>
                              </div>
                              <ErrorMessage
                                name="confirm_password"
                                component="span"
                                className="field_required"
                              />

                              {/* Save Password Button */}
                              <div className="form-control loginformctrl savepass_createnew">
                                <button type="submit" className="loginbtn">
                                  Save Password
                                </button>
                              </div>
                            </div>
                          </Form>
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
    </>
  );
}

export default NewPassword;
