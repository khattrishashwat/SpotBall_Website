import React,{useState,useEffect} from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Loader from "../../Loader/Loader";
import axios from "axios";

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
                            <a href={`mailto:${contact.email}`}>
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
                    <Formik>
                      <Form>
                        <div className="row rowcontactform_inner">
                          <div className="col-md-6 colcontactinputsdiv">
                            <div className="inputformdiv">
                              <label className="contactlbl">First Name</label>
                              <Field
                                type="text"
                                className="contactinputs"
                                placeholder="John"
                              />
                            </div>
                          </div>
                          <div className="col-md-6 colcontactinputsdiv">
                            <div className="inputformdiv">
                              <label className="contactlbl">Last Name</label>
                              <Field
                                type="text"
                                className="contactinputs"
                                placeholder="Doe"
                              />
                            </div>
                          </div>
                          <div className="col-md-6 colcontactinputsdiv">
                            <div className="inputformdiv">
                              <label className="contactlbl">Email</label>
                              <Field
                                type="email"
                                className="contactinputs"
                                placeholder="John@gmail.com"
                              />
                            </div>
                          </div>
                          <div className="col-md-6 colcontactinputsdiv">
                            <div className="inputformdiv">
                              <label className="contactlbl">Phone Number</label>
                              <Field
                                type="tel"
                                className="contactinputs"
                                placeholder="+1 012 3456 789"
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
                                  />
                                  <label htmlFor="gnrl1">General Inquiry</label>
                                </div>
                                <div className="form-group">
                                  <Field
                                    type="radio"
                                    id="gnrl2"
                                    name="subject"
                                  />
                                  <label htmlFor="gnrl2">General Inquiry</label>
                                </div>
                                <div className="form-group">
                                  <Field
                                    type="radio"
                                    id="gnrl3"
                                    name="subject"
                                  />
                                  <label htmlFor="gnrl3">General Inquiry</label>
                                </div>
                                <div className="form-group">
                                  <Field
                                    type="radio"
                                    id="gnrl4"
                                    name="subject"
                                  />
                                  <label htmlFor="gnrl4">General Inquiry</label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-12 colcontactinputsdiv">
                            <div className="inputformdiv">
                              <label className="contactlbl">Message</label>
                              <Field
                                type="text"
                                className="contactinputs"
                                placeholder="Write your message.."
                              />
                            </div>
                          </div>
                          <div className="col-md-12 contcolmsgsendbtn">
                            <div className="sendmsgbtndiv">
                              <button
                                type="button"
                                className="sendmsg_contformbtn"
                              >
                                Send Message
                              </button>
                            </div>
                          </div>
                        </div>
                      </Form>
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
