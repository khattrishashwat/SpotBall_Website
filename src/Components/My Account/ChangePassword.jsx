import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Swal from "sweetalert2";

function ChangePassword({ resetForm }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const formikRef = useRef();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prevState) => !prevState);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState);
  };

  const ChangeValues = {
    old_password: "",
    new_password: "",
    confirm_password: "",
  };

  const validationChange = Yup.object().shape({
    old_password: Yup.string().required("Old Password is required"),
    new_password: Yup.string()
      .required("Password is required")
      .min(6, "Password should be between 6-16 characters long")
      .max(16, "Password should be between 6-16 characters long"),
      
    confirm_password: Yup.string()
      .oneOf(
        [Yup.ref("new_password"), null],
        "Password & Confirm Password must be the same"
      )
      .required("Confirm Password is required"),
  });

  const ChangeSubmit = async (values) => {
    try {
      const token = localStorage.getItem("Web-token");
      const response = await axios.post("change-password", values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        title: response.data.message,
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      Swal.fire({
        text: error.response ? error.response.data.message : error.message,
      });
      console.error(
        "Failed:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Reset the form when the component mounts or when resetForm is called
  useEffect(() => {
    if (resetForm) {
      resetForm();
    }
  }, [resetForm]);

  return (
    <div className="chnagepas_div_myacc">
      <div className="changepass_heading">
        <h2>Change Password</h2>
      </div>
      <Formik
        initialValues={ChangeValues}
        validationSchema={validationChange}
        onSubmit={ChangeSubmit}
        innerRef={formikRef}
      >
        {({ touched, errors }) => (
          <Form>
            <div className="changepassforminputs">
              <div className="passinputdiv">
                <div className="frmctrldiv">
                  <Field
                    className="changepassinput"
                    type={showPassword ? "text" : "password"}
                    name="old_password"
                    autoComplete="off"
                    id="createpass_inp"
                    placeholder="Old Password"
                  />
                  <span
                    onClick={togglePasswordVisibility}
                    className="eyeiconforpass"
                  >
                    <i
                      className={
                        showPassword ? "fa fa-eye iei" : "fa fa-eye-slash iei"
                      }
                    ></i>
                  </span>
                  {touched.old_password && errors.old_password && (
                    <div className="error">{errors.old_password}</div>
                  )}
                </div>
              </div>

              <div className="passinputdiv">
                <div className="frmctrldiv">
                  <Field
                    type={showNewPassword ? "text" : "password"}
                    name="new_password"
                    className="changepassinput"
                    autoComplete="off"
                    id="createpass_inp1"
                    placeholder="New Password"
                  />
                  <span
                    onClick={toggleNewPasswordVisibility}
                    className="eyeiconforpass"
                  >
                    <i
                      className={
                        showNewPassword
                          ? "fa fa-eye iei"
                          : "fa fa-eye-slash iei"
                      }
                    ></i>
                  </span>
                  {touched.new_password && errors.new_password && (
                    <div className="error">{errors.new_password}</div>
                  )}
                </div>
              </div>

              <div className="passinputdiv">
                <div className="frmctrldiv">
                  <Field
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    className="changepassinput"
                    autoComplete="off"
                    id="createpass_inp2"
                    placeholder="Confirm Password"
                  />
                  <span
                    onClick={toggleConfirmPasswordVisibility}
                    className="eyeiconforpass"
                  >
                    <i
                      className={
                        showConfirmPassword
                          ? "fa fa-eye iei"
                          : "fa fa-eye-slash iei"
                      }
                    ></i>
                  </span>
                  {touched.confirm_password && errors.confirm_password && (
                    <div className="error">{errors.confirm_password}</div>
                  )}
                </div>
              </div>

              <div className="savepass_btndiv">
                <button type="submit" className="savepass_change_myacc">
                  Save Password
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default ChangePassword;
