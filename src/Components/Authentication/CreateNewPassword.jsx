import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

function CreateNewPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const emailOrPhone = location.state?.emailOrPhone || "";
  const [showPassword, setShowPassword] = useState(false);
  const [seePassword, setSeePassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setSeePassword(!seePassword);
  };

  const initialValues = {
    emailOrPhone: emailOrPhone || "",
    new_password: "",
    confirm_password: "",
  };

  const Passwordvalidation = Yup.object({
    new_password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "At least one lowercase letter is required")
      .matches(/[A-Z]/, "At least one uppercase letter is required")
      .matches(/[0-9]/, "At least one number is required")
      .matches(/[@$!%*?&]/, "At least one special character is required")
      .required("Password is required"),

    confirm_password: Yup.string()
      .oneOf([Yup.ref("new_password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  // Function to handle form submission
  const handleSubmit = async (values) => {
    const token = localStorage.getItem("tokens");
    const payload = { ...values, emailOrPhone };

    try {
      const response = await axios.post("app/auth/reset-password", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: "success",
        text: response.data.message,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });

      navigate("/");
      localStorage.removeItem("tokens");
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.response ? error.response.data.message : error.message,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    }
  };

  return (
    <>
      <section className="adminloginsection" style={{ height: "100svh" }}>
        <div className="container contfld-loginform">
          <div className="col-md-12 col12mainloginform">
            <div className="row rowmaqinloginform">
              <div className="col-md-12 col12loginseconddiv">
                <div className="col-md-7 col6sliderdiv">
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
                      //   src="images/logo.png"
                    />
                  </div>
                  <div className="colformlogin">
                    <div className="login-heading">
                      <h2>Create New Password</h2>
                      <p>Create your new password</p>
                    </div>
                    <Formik
                      initialValues={initialValues}
                      validationSchema={Passwordvalidation}
                      onSubmit={handleSubmit}
                      validateOnChange={true}
                      validateOnBlur={true}
                    >
                      <Form>
                        <div className="formstart">
                          <div className="form-control frmctrldiv">
                            <Field
                              name="new_password"
                              type={showPassword ? "text" : "password"}
                              className="error"
                              id="createnewpass_forgot"
                              placeholder="Password"
                            />
                            <i
                              className={
                                showPassword
                                  ? "fa fa-eye iei"
                                  : "fa fa-eye-slash iei"
                              }
                              aria-hidden="true"
                              onClick={togglePasswordVisibility}
                            />
                            <ErrorMessage
                              name="new_password"
                              component="span"
                              className="field_required"
                            />
                          </div>
                          <div className="form-control frmctrldiv">
                            <Field
                              name="confirm_password"
                              type={seePassword ? "text" : "password"}
                              className="error"
                              id="createnewpass_forgot2"
                              placeholder="Confirm Password"
                            />
                            <i
                              className={
                                seePassword
                                  ? "fa fa-eye iei"
                                  : "fa fa-eye-slash iei"
                              }
                              aria-hidden="true"
                              onClick={toggleConfirmPasswordVisibility}
                            />
                            <ErrorMessage
                              name="confirm_password"
                              component="span"
                              className="field_required"
                            />
                          </div>
                        </div>
                        <div className="form-control loginformctrl">
                          <a>
                            <button type="submit" className="loginbtn">
                              Save Password
                            </button>
                          </a>
                        </div>
                      </Form>
                    </Formik>
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

export default CreateNewPassword;
