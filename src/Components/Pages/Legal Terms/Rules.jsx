import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../../Loader/Loader";
import { useTranslation } from "react-i18next";

function Rules() {
  const [rules, setRules] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeTab, setActiveTab] = useState("rules_play");
  const { t } = useTranslation();

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch Rules of Play data
  const fetchRules = async () => {
    const token = localStorage.getItem("Web-token");
    const lang = localStorage.getItem("selectedLanguage");

    try {
      setIsLoading(true);
      const response = await axios.get(
        "app/static-content/get-all-static-content/rules_of_play",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": lang,
          },
        }
      );
      setRules(response.data.data[0]?.description || "");
    } catch (error) {
      console.error("Error fetching rules of play:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch FAQ data
  const fetchFaqs = async () => {
    const token = localStorage.getItem("Web-token");
    const lang = localStorage.getItem("selectedLanguage");

    try {
      setIsLoading(true);
      const response = await axios.get("app/faq/get-all-faq", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": lang,
        },
      });
      setFaqs(response.data.data || []);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchRules();
    fetchFaqs();
  }, []);

  // Toggle FAQ visibility
  const toggleFAQ = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div>
      <section className="maincont_section">
        <div className="container contforinner_mainheading">
          <div className="row rowmainheading_inner">
            <div className="col-md-12 colmainheading_innerpages">
              <div className="pageheading_main">
                <h2>{t("Rules of Play & FAQs")}</h2>
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
                    <Link to="/terms" className="nav-link">
                      <div className="tabbingiconbgdiv">
                        <img
                          src={`${process.env.PUBLIC_URL}/image/legal_terms_icons.png`}
                          alt="Terms"
                        />
                      </div>
                      <span className="navlinkname">
                        {t("Terms & Conditions")}
                      </span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/privacy" className="nav-link">
                      <div className="tabbingiconbgdiv">
                        <img
                          src={`${process.env.PUBLIC_URL}/image/legal_terms_icons.png`}
                          alt="Privacy"
                        />
                      </div>
                      <span className="navlinkname">
                        {t("Privacy Policies")}
                      </span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/rules" className="nav-link active">
                      <div className="tabbingiconbgdiv">
                        <img
                          src={`${process.env.PUBLIC_URL}/image/legal_terms_icons.png`}
                          alt="Rules"
                        />
                      </div>
                      <span className="navlinkname">
                        {t("Rules of Play")} &amp; {t("FAQs")}
                      </span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/cookies" className="nav-link">
                      <div className="tabbingiconbgdiv">
                        <img
                          src={`${process.env.PUBLIC_URL}/image/legal_terms_icons.png`}
                          alt="Cookies"
                        />
                      </div>
                      <span className="navlinkname">{t("Cookie Policy")}</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-md-8 coltabdata_righttext">
              <div className="tabingrighttextdiv">
                <div className="tab-content">
                  <div id="rulesplay" className="tab-pane active">
                    <div className="legaltermsdata_div">
                      {isLoading ? (
                        <Loader />
                      ) : (
                        <div
                          className="innerlegal_heaidngwithpara"
                          dangerouslySetInnerHTML={{ __html: rules }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {activeTab === "rules_play" && (
            <div className="row termsinnerfaqdiv_row" id="faqnew_innerdiv">
              <div className="col-md-12 col12termsfaqnew">
                <div className="terms_faqinnerdiv">
                  <h3>{t("FAQs")}</h3>
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
                              <p
                                dangerouslySetInnerHTML={{ __html: faq.answer }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Rules;
