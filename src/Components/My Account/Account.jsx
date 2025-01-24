import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import axios from "axios";
import Swal from "sweetalert2";
import * as Yup from "yup";
import Loader from "../Loader/Loader";

function Account() {
  const [pro, setPro] = useState();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState(
    "images/user_image.png"
  );

  const [initialValues, setInitialValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    profile: null,
  });

  const validationSchema = Yup.object({
    first_name: Yup.string()
      .matches(
        /^[A-Za-z]+$/,
        "First name should only contain alphabetic characters (no spaces or numbers)"
      )
      .max(25, "First name cannot be longer than 25 characters")
      .required("First name is required"),

    last_name: Yup.string()
      .matches(
        /^[A-Za-z]+$/,
        "Last name should only contain alphabetic characters (no spaces or numbers)"
      )
      .max(25, "Last name cannot be longer than 25 characters")
      .required("Last name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
  });

  const fetchData = async () => {
    const token = localStorage.getItem("Web-token");
    try {
      setIsLoading(true);
      const response = await axios.get(`app/profile/get-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.data;
      console.log("new", data);

      if (data) {
        setInitialValues({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          profile: data.profile_url || "",
        });
        setProfileImagePreview(data.profile_url || "images/user_image.png");
        setIsVerified(data.is_verified_user || false);

        setPro(data);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    setFieldValue("profile", file);

    // Update profile image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const updateProfile = async (values) => {
    try {
      const token = localStorage.getItem("Web-token");
      const formData = new FormData();

      formData.append("first_name", values.first_name);
      formData.append("last_name", values.last_name);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("profile", values.profile);

      const response = await axios.post(
        `app/profile/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Refresh the page after a successful update
      window.location.reload();

      // Show success message
      Swal.fire("Success!", "Profile updated successfully", "success");
    } catch (error) {
      // Handle error message from response if available
      const errorMessage =
        error.response?.data?.message || "Failed to update profile";

      Swal.fire("Error!", errorMessage, "error");
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="profilesection_inner">
      <div className="update_profile_main">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={updateProfile}
        >
          {({ setFieldValue }) => (
            <Form className="updatepro_formdiv">
              {isVerified && ( // Show this section if the user is verified
                <div className="userimg_namediv">
                  <div className="profileimgdiv">
                    <div className="usermgdiv">
                      <div className="profile-pic">
                        <label className="-label" htmlFor="file">
                          <span>
                            <i className="fa fa-pencil" aria-hidden="true" />{" "}
                            Change Image
                          </span>
                        </label>
                        <input
                          id="file"
                          name="profile"
                          type="file"
                          onChange={(event) =>
                            handleFileChange(event, setFieldValue)
                          }
                        />
                        <img
                          src={
                            profileImagePreview ||
                            `${process.env.PUBLIC_URL}/images/user_image.png`
                          }
                          alt="Profile"
                        />
                      </div>
                    </div>
                    <img
                      src={`${process.env.PUBLIC_URL}/images/verify.png`}
                      className="verifyicon"
                      alt="Verified"
                    />
                  </div>
                  <div className="profilename_mail">
                    <h2>
                      {pro.first_name} {pro.last_name}
                    </h2>
                    <a href={`mailto:${pro.email}`}>{pro.email}</a>
                  </div>
                </div>
              )}

              <div className="inputdiv_updatepro">
                <Field
                  name="first_name"
                  type="text"
                  className="updateinput"
                  placeholder="Enter First Name"
                  maxLength={25}
                  onKeyDown={(e) => {
                    if (!/[a-zA-Z\s]/.test(e.key) && e.key !== "Backspace") {
                      e.preventDefault();
                    }
                  }}
                />
                <img
                  src={`${process.env.PUBLIC_URL}/images/edit_pro.png`}
                  className="editicon_input"
                />
                <ErrorMessage
                  name="first_name"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="inputdiv_updatepro">
                <Field
                  name="last_name"
                  type="text"
                  className="updateinput"
                  placeholder="Enter Last Name"
                  maxLength={15}
                  onKeyDown={(e) => {
                    if (!/[a-zA-Z\s]/.test(e.key) && e.key !== "Backspace") {
                      e.preventDefault();
                    }
                  }}
                />
                <img
                  src={`${process.env.PUBLIC_URL}/images/edit_pro.png`}
                  className="editicon_input"
                />
                <ErrorMessage
                  name="last_name"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="inputdiv_updatepro">
                <Field
                  name="email"
                  type="email"
                  className="updateinput"
                  placeholder="Enter Email"
                  disabled
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="inputdiv_updatepro">
                <Field
                  name="phone"
                  type="tel"
                  className="updateinput"
                  placeholder="Enter Phone Number"
                  disabled
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="error-message"
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Update Profile
              </button>
            </Form>
          )}
        </Formik>
        {/* {isLoading ? (
          <Loader />
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize={true}
            onSubmit={updateProfile}
          >
            {({ setFieldValue }) => (
              <Form className="updatepro_formdiv">
                {isVerified && ( // Show this section if the user is verified
                  <div className="userimg_namediv">
                    <div className="profileimgdiv">
                      <div className="usermgdiv">
                        <div className="profile-pic">
                          <label className="-label" htmlFor="file">
                            <span>
                              <i className="fa fa-pencil" aria-hidden="true" />{" "}
                              Change Image
                            </span>
                          </label>
                          <input
                            id="file"
                            name="profile"
                            type="file"
                            onChange={(event) =>
                              handleFileChange(event, setFieldValue)
                            }
                          />
                          <img
                            src={
                              profileImagePreview ||
                              `${process.env.PUBLIC_URL}/images/user_image.png`
                            }
                            alt="Profile"
                          />
                        </div>
                      </div>
                      <img
                        src={`${process.env.PUBLIC_URL}/images/verify.png`}
                        className="verifyicon"
                        alt="Verified"
                      />
                    </div>
                    <div className="profilename_mail">
                      <h2>
                        {pro.first_name} {pro.last_name}
                      </h2>
                      <a href={`mailto:${pro.email}`}>{pro.email}</a>
                    </div>
                  </div>
                )}

                <div className="inputdiv_updatepro">
                  <Field
                    name="first_name"
                    type="text"
                    className="updateinput"
                    placeholder="Enter First Name"
                    maxLength={25}
                    onKeyDown={(e) => {
                      if (!/[a-zA-Z\s]/.test(e.key) && e.key !== "Backspace") {
                        e.preventDefault();
                      }
                    }}
                  />
                  <img
                    src={`${process.env.PUBLIC_URL}/images/edit_pro.png`}
                    className="editicon_input"
                  />
                  <ErrorMessage
                    name="first_name"
                    component="div"
                    className="error-message"
                  />
                </div>

                <div className="inputdiv_updatepro">
                  <Field
                    name="last_name"
                    type="text"
                    className="updateinput"
                    placeholder="Enter Last Name"
                    maxLength={15}
                    onKeyDown={(e) => {
                      if (!/[a-zA-Z\s]/.test(e.key) && e.key !== "Backspace") {
                        e.preventDefault();
                      }
                    }}
                  />
                  <img
                    src={`${process.env.PUBLIC_URL}/images/edit_pro.png`}
                    className="editicon_input"
                  />
                  <ErrorMessage
                    name="last_name"
                    component="div"
                    className="error-message"
                  />
                </div>

                <div className="inputdiv_updatepro">
                  <Field
                    name="email"
                    type="email"
                    className="updateinput"
                    placeholder="Enter Email"
                    disabled
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error-message"
                  />
                </div>

                <div className="inputdiv_updatepro">
                  <Field
                    name="phone"
                    type="tel"
                    className="updateinput"
                    placeholder="Enter Phone Number"
                    disabled
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="error-message"
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Update Profile
                </button>
              </Form>
            )}
          </Formik>
        )} */}
      </div>
    </div>
  );
}

export default Account;
