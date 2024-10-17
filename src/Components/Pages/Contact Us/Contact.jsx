import React,{useState} from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Loader from "../../Loader/Loader";

function Contact() {
    const [loading, setLoading] = useState(false);

  return (
    <>
      {loading ? (
        <Loader /> // Show loader
      ) : (
        <>
          <section className="maincont_section">
            <div className="container contforinner_mainheading">
              <div className="row rowmainheading_inner">
                <div className="col-md-12 colmainheading_innerpages">
                  <div className="pageheading_main">
                    <h2>Contact Us</h2>
                    <p>
                      If you need to reach us, see the details below where you
                      should send your inquiry. We are a Indian-based company,
                      so watch for a reply within 24 hours of us receiving your
                      email.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="container cont_contactus">
              <div className="row contactusdiv_innerrow">
                <div className="col-md-5 col5forcontactdetails">
                  <div className="contactdetails_div">
                    <h3>Contact Information</h3>
                    <div className="helpdeksdiv_all">
                      <h2>General Questions/ Customer Service/ Help Desk</h2>
                      <div className="helpsupport_info">
                        <img
                          src={`${process.env.PUBLIC_URL}/images/mail.png`}
                        />
                        <p>
                          {" "}
                          <a href="mailto:support_india@spotsball.com">
                            support_india@spotsball.com
                          </a>{" "}
                        </p>
                      </div>
                    </div>
                    <div className="helpdeksdiv_all">
                      <h2>Website or Mobile App Technical Issues</h2>
                      <div className="helpsupport_info">
                        <img
                          src={`${process.env.PUBLIC_URL}/images/mail.png`}
                        />
                        <p>
                          {" "}
                          <a href="mailto:support_india@spotsball.com">
                            technical_india@spotsball.com
                          </a>{" "}
                        </p>
                      </div>
                    </div>
                    <div className="helpdeksdiv_all">
                      <h2>
                        Partnership/ Business Development/ Alliance Inquiries
                      </h2>
                      <div className="helpsupport_info">
                        <img
                          src={`${process.env.PUBLIC_URL}/images/mail.png`}
                        />
                        <p>
                          {" "}
                          <a href="mailto:support_india@spotsball.com">
                            bizdev_india@spotsball.com{" "}
                          </a>{" "}
                        </p>
                      </div>
                    </div>
                    <div className="contact_socialicons">
                      <div className="social_inner">
                        <ul>
                          <li>
                            <a href="#!" className="bggreen">
                              {" "}
                              <img
                                src={`${process.env.PUBLIC_URL}/images/facebook_contact.png`}
                              />{" "}
                            </a>{" "}
                          </li>
                          <li>
                            <a href="#!">
                              {" "}
                              <img
                                src={`${process.env.PUBLIC_URL}/images/instagram_contact.png`}
                              />{" "}
                            </a>
                          </li>
                          <li>
                            <a href="#!" className="bggreen">
                              {" "}
                              <img
                                src={`${process.env.PUBLIC_URL}/images/twitter_contact.png`}
                              />{" "}
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
