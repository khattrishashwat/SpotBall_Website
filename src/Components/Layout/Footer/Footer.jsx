import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PalyVedio from "../../Pages/HowToPlay/PalyVedio";

function Footer() {
  const [footer, setFooter] = useState(""); // Footer content
  const [plays, setPlays] = useState(false); // Video state
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "terms_conditions"
  ); // Active tab state

  const fetchFooter = async () => {
    try {
      const response = await axios.get("/get-all-static-content/footer");
      if (response) {
        setFooter(response.data.data[0]?.description || "");
      }
    } catch (error) {
      console.error("Error fetching footer data:", error);
    }
  };

  useEffect(() => {
    fetchFooter();
  }, []);

  const handleTabClick = (tabId) => {
    // Save the selected tab to localStorage
    localStorage.setItem("activeTab", tabId);
    setActiveTab(tabId);
  };

  const openVideo = () => setPlays(true);

  const closeVideo = () => {
    setPlays(false);
    const videoElement = document.getElementById("video_howtoplay");
    if (videoElement) {
      videoElement.pause();
      videoElement.currentTime = 0;
    }
  };

  return (
    <>
      <footer className="footermaindiv_section">
        <div className="container contfootermain">
          <div className="col-md-12 col12mainfooter">
            <div className="row rowmainfooter">
              <div className="col-md-4 col4footerightside">
                <div className="footertextinfodiv">
                  <div className="winnergurantee_footer">
                    <div dangerouslySetInnerHTML={{ __html: footer }} />
                  </div>
                </div>
              </div>
              <div className="col-md-8 col8rightfooterlinks">
                <div className="footerlinksmain_right">
                  <div className="footerlinksmaindiv_inner">
                    {/* Link Sections */}
                    {[
                      {
                        title: "Winners",
                        links: [
                          "The Winners Circle",
                          "Live Weekly Winner",
                          "In The Press",
                        ],
                        paths: [
                          "/the_winners_circle",
                          "/live_weekly_winner",
                          "/in_the_press",
                        ],
                      },
                      {
                        title: "About Us",
                        links: [
                          "Who We Are?",
                          "How to Play/ FAQ’s",
                          "Contact Us",
                        ],
                        paths: ["/who_we_are", null, "/contact_us"],
                        onClick: [null, openVideo, null],
                      },
                      {
                        title: "Legal",
                        links: [
                          "Terms & Conditions",
                          "Privacy Policy",
                          "Rules of Play & FAQ's",
                          "Cookie Policy",
                        ],
                        paths: [
                          "/legal_terms",
                          "/legal_terms",
                          "/legal_terms",
                          "/legal_terms",
                        ],
                        onClick: [
                          () => handleTabClick("terms_conditions"),
                          () => handleTabClick("privacy_policy"),
                          () => handleTabClick("rules_play"),
                          () => handleTabClick("cookiepolicy"),
                        ],
                      },
                      {
                        title: "Others",
                        links: ["Loyalty Club", "iOS App", "Android App"],
                        paths: [null, null, null],
                      },
                    ].map((section, index) => (
                      <div key={index} className="maindivforfooterlinks">
                        <h2 className="linksheading">{section.title}</h2>
                        <ul className="links_list_footer">
                          {section.links.map((link, i) => (
                            <li key={i}>
                              <Link
                                to={section.paths[i] || "#"}
                                className="linksanchor"
                                onClick={section.onClick?.[i]}
                              >
                                {link}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="row rowmainfooter secondfootermaindiv">
              <div className="col-md-8 col8rightfooterlinks">
                <div className="footerlinksmain_right footersocialwith_downloadicons">
                  {/* App Store and Social Media Icons */}
                  <div className="footer_downloadapp_icons">
                    <div className="download_app_icondiv">
                      <div className="appstoreicondiv">
                        <a>
                          <img
                            src={`${process.env.PUBLIC_URL}/images/google-play-store-badge.png`}
                            alt="Google Play Store"
                          />
                        </a>
                      </div>
                      <div className="appstoreicondiv">
                        <a>
                          <img
                            src={`${process.env.PUBLIC_URL}/images/apple-store-badge.png`}
                            alt="Apple Store"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="footer_socialicons">
                    <ul>
                      {[
                        "Facebook_icon.png",
                        "Instagram_icon.png",
                        "Twitter_x_icon.png",
                        "Threads_icon.png",
                        "Youtube_icon.png",
                      ].map((icon, i) => (
                        <li key={i}>
                          <a title={icon.split("_")[0]}>
                            <img
                              src={`${process.env.PUBLIC_URL}/images/${icon}`}
                              alt={icon.split("_")[0]}
                            />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Copyright Footer */}
      <footer className="copyrightfooter">
        <div className="container contsecondfooter">
          <div className="col-md-12 col12secondfootermain">
            <div className="row rowmainforcopyrightwithcurrency">
              <div className="copyrightwithinrdropdown">
                <div className="divforcopyright">
                  <p>
                    © <Link to="/">SpotsBall</Link> 2024. All Rights Reserved.
                    Designed by <a href="#">Webmobril</a>
                  </p>
                  <span className="separator">|</span>
                  <div className="currencyselectdiv">
                    <p>
                      Currency <i className="fa fa-inr" aria-hidden="true" />
                      <select>
                        <option>INR</option>
                        <option>USD</option>
                        <option>EUR</option>
                      </select>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Component */}
      {plays && <PalyVedio isON={plays} isOFF={closeVideo} />}
    </>
  );
}

export default Footer;
