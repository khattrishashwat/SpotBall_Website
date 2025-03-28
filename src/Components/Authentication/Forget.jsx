import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";

function Forget() {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object({
    emailOrPhone: Yup.string()
      .required("This field is required")
      .test(
        "is-email-or-phone",
        "Please enter a valid email or phone number",
        (value) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const phoneRegex = /^[6-9]\d{9}$/;
          return emailRegex.test(value) || phoneRegex.test(value);
        }
      ),
  });

  const PhoneSubmit = async (values, { resetForm }) => {
    try {
      setIsSubmitting(true);

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

      // Navigate and pass values using state
      navigate("/otp", { state: { emailOrPhone: values.emailOrPhone } });
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.response?.data?.message,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    } finally {
      setIsSubmitting(false);
    }
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
                    />
                  </div>
                  <div className="colformlogin">
                    <div className="login-heading">
                      <h2>Forgot Password</h2>
                      <p>Please Enter the registered Email / Mobile Number</p>
                    </div>

                    <Formik
                      initialValues={{ emailOrPhone: "" }}
                      validationSchema={validationSchema}
                      onSubmit={PhoneSubmit}
                    >
                      {({ errors, touched }) => (
                        <Form>
                          <div className="formstart">
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
                                className="loginbtn"
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
      </section>
    </>
  );
}

export default Forget;
