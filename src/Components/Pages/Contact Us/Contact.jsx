import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Loader from "../../Loader/Loader";
import axios from "axios";
import * as Yup from "yup";
import Swal from "sweetalert2";

function Contact() {
  const [isLoading, setIsLoading] = useState(false);

  const [contacts, setContacts] = useState("");

  const fetchContact = async () => {
    const token = localStorage.getItem("Web-token");
    try {
      setIsLoading(true);
      const response = await axios.get(
        "app/static-content/get-all-static-content/contact_us",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.data) {
      //  console.log("Fetched Contacts ", response.data.data);
        setContacts(response.data.data[0] || {});
      }
    } catch (error) {
      console.error("Error fetching :", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContact();
  }, []);

  const capitalizeFirstLetter = (value) => {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const handleNumericInput = (value) =>
    value.replace(/[^0-9]/g, "").slice(0, 10);
  const validationContact = Yup.object().shape({
    first_name: Yup.string()
      .required("First Name is required")
      .matches(/^[A-Z]/, "First letter must be capital")
      .max(20, "First Name cannot exceed 20 characters"), // Max 20 characters

    last_name: Yup.string()
      .required("Last Name is required")
      .matches(/^[A-Z]/, "First letter must be capital")
      .max(20, "Last Name cannot exceed 20 characters"), // Max 20 characters

    email: Yup.string()
      .required("Email is required")
      .email("Invalid email address")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format. Please enter a valid email address."
      )
      .matches(
        /@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)$/,
        "Only Gmail, Yahoo, Outlook, and Hotmail domains are allowed"
      ), // Restrict to specific email providers

    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^(?:\+91)?[6-9][0-9]{9}$/, "Invalid Indian phone number"),

    subject: Yup.string()
      .required("Subject is required")
      .max(150, "Subject cannot exceed 150 characters"), // Max 150 characters

    message: Yup.string()
      .required("Message is required")
      .matches(/^[A-Z]/, "First letter of the message must be capital")
      .max(500, "Message cannot exceed 500 characters"), // Max 500 characters
  });


  const Contact_Us = async (values, { resetForm }) => {
    const token = localStorage.getItem("Web-token");
    const formattedPhone = values.phone.startsWith("+91")
      ? values.phone
      : `+91${values.phone}`;

    try {
      const response = await axios.post(
        "app/static/contact-support",
        { ...values, phone: formattedPhone },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response) {
        Swal.fire({
          icon: "success",
          text: response?.data?.message,
          allowOutsideClick: false,
          confirmButtonText: "OK",
        });
      }
      resetForm();
      // console.log("Response:", response);
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.response?.data?.message,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
      console.error("Error submitting contact form:", error);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader /> // Show loader
      ) : (
        <>
          <section className="maincont_section">
            <div className="container contforinner_mainheading">
              <div className="row rowmainheading_inner">
                <div className="col-md-12 colmainheading_innerpages">
                  <div className="pageheading_main">
                    <h2>{contacts.title}</h2>
                    <p>{contacts.titleDescription}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="container cont_contactus">
              <div className="row contactusdiv_innerrow">
                <div className="col-md-5 col5forcontactdetails">
                  <div className="contactdetails_div">
                    <h3>Contact Information</h3>
                    {contacts.emailInfo?.map((contact) => (
                      <div className="helpdeksdiv_all" key={contact._id}>
                        <h2>{contact.info}</h2>
                        <div className="helpsupport_info">
                          <img
                            src={`${process.env.PUBLIC_URL}/image/mail.png`}
                            alt="Mail"
                          />
                          <p>
                            <a
                              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contact.email}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {contact.email}
                            </a>
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="contact_socialicons">
                      <div className="social_inner">
                        <ul>
                          <li>
                            <a
                              href="https://www.facebook.com/officialspotsball"
                              className="bggreen"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={`${process.env.PUBLIC_URL}/image/facebook_contact.png`}
                                alt="Facebook"
                              />
                            </a>
                          </li>
                          <li>
                            <a
                              href="https://www.instagram.com/spotsballofficial/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bggreen"
                            >
                              <img
                                src={`${process.env.PUBLIC_URL}/image/instagram_contact-white.png`}
                                alt="Instagram"
                              />
                            </a>
                          </li>
                          <li>
                            <a
                              href="https://x.com/Spotsball_"
                              className="bggreen"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={`${process.env.PUBLIC_URL}/image/twitter_contact.png`}
                                alt="Twitter"
                              />
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-7 col7contformdiv">
                  <div className="form_contactus">
                    <Formik
                      initialValues={{
                        first_name: "",
                        last_name: "",
                        email: "",
                        phone: "",
                        subject: "",
                        message: "",
                      }}
                      validationSchema={validationContact}
                      onSubmit={Contact_Us}
                    >
                      {({ setFieldValue }) => (
                        <Form>
                          <div className="row rowcontactform_inner">
                            <div className="col-md-6 colcontactinputsdiv">
                              <div className="inputformdiv">
                                <label className="contactlbl">First Name</label>
                                <Field
                                  name="first_name"
                                  type="text"
                                  className="contactinputs"
                                  placeholder="First name"
                                  onChange={(e) =>
                                    setFieldValue(
                                      "first_name",
                                      capitalizeFirstLetter(e.target.value)
                                    )
                                  }
                                />
                                <ErrorMessage
                                  name="first_name"
                                  component="div"
                                  className="error-message"
                                />
                              </div>
                            </div>
                            <div className="col-md-6 colcontactinputsdiv">
                              <div className="inputformdiv">
                                <label className="contactlbl">Last Name</label>
                                <Field
                                  name="last_name"
                                  type="text"
                                  className="contactinputs"
                                  placeholder="Last name"
                                  onChange={(e) =>
                                    setFieldValue(
                                      "last_name",
                                      capitalizeFirstLetter(e.target.value)
                                    )
                                  }
                                />
                                <ErrorMessage
                                  name="last_name"
                                  component="div"
                                  className="error-message"
                                />
                              </div>
                            </div>
                            <div className="col-md-6 colcontactinputsdiv">
                              <div className="inputformdiv">
                                <label className="contactlbl">Email</label>
                                <Field
                                  name="email"
                                  type="email"
                                  className="contactinputs"
                                  placeholder="xxx@gmail.com"
                                />
                                <ErrorMessage
                                  name="email"
                                  component="div"
                                  className="error-message"
                                />
                              </div>
                            </div>
                            <div className="col-md-6 colcontactinputsdiv">
                              <div className="inputformdiv">
                                <label className="contactlbl">
                                  Phone Number
                                </label>
                                <Field
                                  name="phone"
                                  type="tel"
                                  className="contactinputs"
                                  placeholder="+91 xxxxxxxx"
                                  onChange={(e) =>
                                    setFieldValue(
                                      "phone",
                                      handleNumericInput(e.target.value)
                                    )
                                  }
                                />

                                <ErrorMessage
                                  name="phone"
                                  component="div"
                                  className="error-message"
                                />
                              </div>
                            </div>
                            <div className="col-md-12 colcontactinputsdiv">
                              <div className="inputformdiv">
                                <label className="contactlbl">
                                  Select Subject
                                </label>
                                <div className="subjectradioninputs">
                                  <div className="form-group">
                                    <Field
                                      type="radio"
                                      id="gnrl1"
                                      name="subject"
                                      value="technical"
                                    />
                                    <label htmlFor="gnrl1">Technical</label>
                                  </div>
                                  <div className="form-group">
                                    <Field
                                      type="radio"
                                      id="gnrl2"
                                      name="subject"
                                      value="support"
                                    />
                                    <label htmlFor="gnrl2">Support</label>
                                  </div>
                                  {/* <div className="form-group">
                                    <Field
                                      type="radio"
                                      id="gnrl3"
                                      name="subject"
                                      value="technical"
                                    />
                                    <label htmlFor="gnrl3">Technical</label>
                                  </div> */}
                                  <div className="form-group">
                                    <Field
                                      type="radio"
                                      id="gnrl4"
                                      name="subject"
                                      value="business"
                                    />
                                    <label htmlFor="gnrl4">Business</label>
                                  </div>
                                </div>
                                <ErrorMessage
                                  name="subject"
                                  component="div"
                                  className="error-message"
                                />
                              </div>
                            </div>
                            <div className="col-md-12 colcontactinputsdiv">
                              <div className="inputformdiv">
                                <label className="contactlbl">Message</label>
                                <Field
                                  name="message"
                                  type="text"
                                  className="contactinputs"
                                  placeholder="Write your message.."
                                  onChange={(e) =>
                                    setFieldValue(
                                      "message",
                                      capitalizeFirstLetter(e.target.value)
                                    )
                                  }
                                />
                                <ErrorMessage
                                  name="message"
                                  component="div"
                                  className="error-message"
                                />
                              </div>
                            </div>
                            <div className="col-md-12 contcolmsgsendbtn">
                              <div className="sendmsgbtndiv">
                                <button
                                  type="submit"
                                  className="sendmsg_contformbtn"
                                >
                                  Send Message
                                </button>
                              </div>
                            </div>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}

export default Contact;
