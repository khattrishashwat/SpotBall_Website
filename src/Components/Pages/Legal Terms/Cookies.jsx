import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../../Loader/Loader";

function Privacy() {
    const [isCookies, setIsCookies] = useState("");
  const [isLoading, setIsLoading] = useState("");

  const fetchCondition = async () => {
    const token = localStorage.getItem("Web-token");
    try {
      setIsLoading(true);

      const response = await axios.get(
        "app/static-content/get-all-static-content/cookie_policy",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsCookies(response.data.data[0]?.description);
      // console.log("ye",response.data.data);
    } catch (error) {
      console.error("Error data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCondition();
  }, []);

   useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  return (
    <div>
      <section className="maincont_section">
        <div className="container contforinner_mainheading">
          <div className="row rowmainheading_inner">
            <div className="col-md-12 colmainheading_innerpages">
              <div className="pageheading_main">
                <h2>Cookie Policy</h2>
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
                    <Link to="/terms" className="nav-link" data-toggle="tab">
                      {" "}
                      <div className="tabbingiconbgdiv">
                        {" "}
                        <img
                          src={`${process.env.PUBLIC_URL}/images/legal_terms_icons.png`}
                          alt="Terms"
                        />{" "}
                      </div>{" "}
                      <span className="navlinkname">Terms & Conditions</span>{" "}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/privacy" className="nav-link" data-toggle="tab">
                      <div className="tabbingiconbgdiv">
                        {" "}
                        <img
                          src={`${process.env.PUBLIC_URL}/images/legal_terms_icons.png`}
                          alt="Privacy"
                        />{" "}
                      </div>
                      <span className="navlinkname">Privacy Policies</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/rules" className="nav-link" data-toggle="tab">
                      <div className="tabbingiconbgdiv">
                        {" "}
                        <img
                          src={`${process.env.PUBLIC_URL}/images/legal_terms_icons.png`}
                          alt="Rules"
                        />{" "}
                      </div>
                      <span className="navlinkname">
                        Rules of Play &amp; FAQs
                      </span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/cookies"
                      className="nav-link active"
                      data-toggle="tab"
                    >
                      <div className="tabbingiconbgdiv">
                        {" "}
                        <img
                          src={`${process.env.PUBLIC_URL}/images/legal_terms_icons.png`}
                          alt="Cookies"
                        />{" "}
                      </div>{" "}
                      <span className="navlinkname">Cookie Policy</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-8 coltabdata_righttext">
              <div className="tabingrighttextdiv">
                <div className="tab-content">
                  <div id="cookiepolicy" className="tab-pane active">
                    <div className="legaltermsdata_div">
                      {/* <div className="innerlegal_heaidngwithpara"> */}
                        
                          <div
                            dangerouslySetInnerHTML={{ __html: isCookies }}
                          />
                          {/* {isLoading ? (
                            <Loader /> // Correctly render the Loader component
                          ) : (
                            <div
                              dangerouslySetInnerHTML={{ __html: isCookies }}
                            />
                          )} */}
                        
                      {/* </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Privacy;
