import React,{useState,useEffect} from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Loader from "../../Loader/Loader";
import axios from "axios";
import * as Yup from "yup";

function Contact() {
    const [isLoading, setIsLoading] = useState(false);

const [contacts, setContacts] = useState("");

const fetchContact = async () => {
  const token = localStorage.getItem("token");
  try {
    setIsLoading(true);
    const response = await axios.get("/get-all-static-content/contact_us", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.data) {
      console.log("Fetched Contacts ", response.data.data);
      setContacts(response.data.data[0]||{});
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

const handleNumericInput = (value) => {
  return value.replace(/\D/g, "");
};

const validationContact = Yup.object().shape({
  firstName: Yup.string()
    .required("First Name is required")
    .matches(/^[A-Z]/, "First letter must be capital"),
  lastName: Yup.string()
    .required("Last Name is required")
    .matches(/^[A-Z]/, "First letter must be capital"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must be numeric")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .required("Phone number is required"),
  subject: Yup.string().required("Subject is required"),
  message: Yup.string()
    .required("Message is required")
    .matches(/^[A-Z]/, "First letter of the message must be capital"),
});

console.log("contacts",contacts);

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
                            src={`${process.env.PUBLIC_URL}/images/mail.png`}
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
                            <a href="#!" className="bggreen">
                              <img
                                src={`${process.env.PUBLIC_URL}/images/facebook_contact.png`}
                                alt="Facebook"
                              />
                            </a>
                          </li>
                          <li>
                            <a href="#!">
                              <img
                                src={`${process.env.PUBLIC_URL}/images/instagram_contact.png`}
                                alt="Instagram"
                              />
                            </a>
                          </li>
                          <li>
                            <a href="#!" className="bggreen">
                              <img
                                src={`${process.env.PUBLIC_URL}/images/twitter_contact.png`}
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
                        firstName: "",
                        lastName: "",
                        email: "",
                        phone: "",
                        subject: "",
                        message: "",
                      }}
                      validationSchema={validationContact}
                      onSubmit={(values) => {
                        console.log(values);
                      }}
                    >
                      {({ setFieldValue }) => (
                        <Form>
                          <div className="row rowcontactform_inner">
                            <div className="col-md-6 colcontactinputsdiv">
                              <div className="inputformdiv">
                                <label className="contactlbl">First Name</label>
                                <Field
                                  name="firstName"
                                  type="text"
                                  className="contactinputs"
                                  placeholder="John"
                                  onChange={(e) =>
                                    setFieldValue(
                                      "firstName",
                                      capitalizeFirstLetter(e.target.value)
                                    )
                                  }
                                />
                                <ErrorMessage
                                  name="firstName"
                                  component="div"
                                  className="error-message"
                                />
                              </div>
                            </div>
                            <div className="col-md-6 colcontactinputsdiv">
                              <div className="inputformdiv">
                                <label className="contactlbl">Last Name</label>
                                <Field
                                  name="lastName"
                                  type="text"
                                  className="contactinputs"
                                  placeholder="Doe"
                                  onChange={(e) =>
                                    setFieldValue(
                                      "lastName",
                                      capitalizeFirstLetter(e.target.value)
                                    )
                                  }
                                />
                                <ErrorMessage
                                  name="lastName"
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
                                  placeholder="John@gmail.com"
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
                                  placeholder="+1 012 3456 789"
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
                                  Select Subject?
                                </label>
                                <div className="subjectradioninputs">
                                  <div className="form-group">
                                    <Field
                                      type="radio"
                                      id="gnrl1"
                                      name="subject"
                                      value="General Inquiry 1"
                                    />
                                    <label htmlFor="gnrl1">
                                      General Inquiry 1
                                    </label>
                                  </div>
                                  <div className="form-group">
                                    <Field
                                      type="radio"
                                      id="gnrl2"
                                      name="subject"
                                      value="General Inquiry 2"
                                    />
                                    <label htmlFor="gnrl2">
                                      General Inquiry 2
                                    </label>
                                  </div>
                                  <div className="form-group">
                                    <Field
                                      type="radio"
                                      id="gnrl3"
                                      name="subject"
                                      value="General Inquiry 3"
                                    />
                                    <label htmlFor="gnrl3">
                                      General Inquiry 3
                                    </label>
                                  </div>
                                  <div className="form-group">
                                    <Field
                                      type="radio"
                                      id="gnrl4"
                                      name="subject"
                                      value="General Inquiry 4"
                                    />
                                    <label htmlFor="gnrl4">
                                      General Inquiry 4
                                    </label>
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
