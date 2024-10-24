import React, { useState, useEffect } from "react";
import axios from "axios";
import Tearm from "./Tearm";
import Privacy from "./Privacy";
import Rules from "./Rules";
import Cookies from "./Cookies";

function Legal() {
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeTab, setActiveTab] = useState("terms_conditions");

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const fetchFaqs = async () => {
    const token = localStorage.getItem("token");
    try {
      setIsLoading(true);
      const response = await axios.get("get-all-faq", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.data) {
        console.log("Fetched ", response.data.data);
        setFaqs(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching :", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const toggleFAQ = (index) => {
    // Toggle between open and closed state for the clicked FAQ
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <section className="maincont_section">
        <div className="container contforinner_mainheading">
          <div className="row rowmainheading_inner">
            <div className="col-md-12 colmainheading_innerpages">
              <div className="pageheading_main">
                <h2>Legal Terms</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="container contrighttabbingpage paddingnoneformob_legelpage">
          <div className="row rowtabbingpage">
            <div className="col-md-4 coltabbingdiv">
              <div className="navtabdiv">
                <ul className="nav nav-tabs">
                  <li className="nav-item">
                    <a
                      className={`nav-link ${
                        activeTab === "terms_conditions" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("terms_conditions")}
                    >
                      <div className="tabbingiconbgdiv">
                        <img
                          src={`${process.env.PUBLIC_URL}/images/legal_terms_icons.png`}
                        />
                      </div>
                      <span className="navlinkname">Terms and conditions</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={`nav-link ${
                        activeTab === "privacy_policy" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("privacy_policy")}
                    >
                      <div className="tabbingiconbgdiv">
                        <img
                          src={`${process.env.PUBLIC_URL}/images/legal_terms_icons.png`}
                        />
                      </div>
                      <span className="navlinkname">Privacy policies</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={`nav-link ${
                        activeTab === "rules_play" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("rules_play")}
                    >
                      <div className="tabbingiconbgdiv">
                        <img
                          src={`${process.env.PUBLIC_URL}/images/legal_terms_icons.png`}
                        />
                      </div>
                      <span className="navlinkname">
                        Rules of play &amp; FAQ’s
                      </span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={`nav-link ${
                        activeTab === "cookiepolicy" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("cookiepolicy")}
                    >
                      <div className="tabbingiconbgdiv">
                        <img
                          src={`${process.env.PUBLIC_URL}/images/legal_terms_icons.png`}
                        />
                      </div>
                      <span className="navlinkname">Cookie Policy</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-8 coltabdata_righttext">
              <div className="tabingrighttextdiv">
                <div className="tab-content">
                  <div
                    id="terms_conditions"
                    className={`tab-pane ${
                      activeTab === "terms_conditions" ? "active show" : ""
                    }`}
                  >
                    <Tearm />
                  </div>
                  <div
                    id="privacy_policy"
                    className={`tab-pane ${
                      activeTab === "privacy_policy" ? "active show" : ""
                    }`}
                  >
                    <Privacy />
                  </div>
                  <div
                    id="rules_play"
                    className={`tab-pane ${
                      activeTab === "rules_play" ? "active show" : ""
                    }`}
                  >
                    <Rules />
                  </div>
                  <div
                    id="cookiepolicy"
                    className={`tab-pane ${
                      activeTab === "cookiepolicy" ? "active show" : ""
                    }`}
                  >
                    <Cookies />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`row termsinnerfaqdiv_row ${
              activeTab === "rules_play" ? "d-block" : "d-none"
            }`}
            id="faqnew_innerdiv"
          >
            <div className="col-md-12 col12termsfaqnew">
              <div className="terms_faqinnerdiv">
                <div className="innerdata_eaidngwithpara">
                  <h3>FAQ's</h3>
                  <div className="faq_content">
                    <div
                      className="panel-group"
                      id="accordion"
                      role="tablist"
                      aria-multiselectable="true"
                    >
                      {faqs.map((faq, index) => (
                        <div className="panel panel-default" key={faq._id}>
                          <div
                            className="panel-heading"
                            id={`heading${index}`}
                            role="tab"
                          >
                            <h4 className="panel-title">
                              <a
                                className={
                                  activeIndex === index ? "" : "collapsed"
                                }
                                role="button"
                                data-toggle="collapse"
                                data-parent="#accordion"
                                aria-expanded={
                                  activeIndex === index ? "true" : "false"
                                }
                                onClick={() => toggleFAQ(index)}
                                aria-controls={`collapse${index}`}
                              >
                                <span className="faqques_span">
                                  {faq.question}
                                </span>
                                <i
                                  className={`pull-right fa ${
                                    activeIndex === index
                                    ? "fa-minus"
                                    : "fa-plus"
                                  }`}
                                />
                              </a>
                                  {/* <hr /> */}
                            </h4>
                          </div>
                          <div
                            className={`panel-collapse collapse ${
                              activeIndex === index ? "show" : ""
                            }`}
                            id={`collapse${index}`}
                            role="tabpanel"
                            aria-labelledby={`heading${index}`}
                          >
                            <div className="panel-body">
                              <p>{faq.answer}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
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

export default Legal;
