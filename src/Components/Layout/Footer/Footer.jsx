import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

function Footer() {
  const [footer, setFooter] = useState("");
  const [links, setLinks] = useState([]);
  const [androidLink, setAndroidLink] = useState(null);
  const location = useLocation();
  const [showBackToTop, setShowBackToTop] = useState(false);

  const fetchFooter = async () => {
    try {
      const response = await axios.get(
        "app/static-content/get-all-static-content/footer"
      );
      setLinks(response.data.data?.liveLinks || []);
    } catch (error) {
      console.error("Error fetching footer data:", error);
    }
  };

  const fetchAndroidLink = async () => {
    try {
      const response = await axios.get("app/apk-links");
      setAndroidLink(response.data.data?.android_build || null);
    } catch (error) {
      console.error("Error fetching Android data:", error);
    }
  };

  useEffect(() => {
    fetchFooter();
    fetchAndroidLink();

    // Scroll Event Listener
    const handleScroll = () => {
      const scrollPercentage =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;
      setShowBackToTop(scrollPercentage > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const iconClass = {
    facebook: "fab fa-facebook-f",
    instagram: "fab fa-instagram",
    twitter: "fa-brands fa-x-twitter",
    threads: "fa-brands fa-threads",
    youtube: "fa-brands fa-youtube",
  };

  const handleLinkClick = () => {
    // console.log("path",path)

    // if (location.pathname) {
    // console.log("logger",location.pathname,path)
    // If we're already on the same page, scroll to the top or reload
    window.scrollTo(0, 0); // Scroll to the top
    // Or use window.location.reload() to reload the page instead
    // window.location.reload();
    // }
  };

  // useEffect(() => {
  //   handleLinkClick()
  // }, [location.pathname])

  return (
    <>
      <footer className="footer">
        <div className="min-footer">
          <div className="container">
            <div className="row align-items-center justify-content-between mb-4 mb-md-5">
              {/* Social Media Section */}
              <div className="col-md-4 col-lg-4 mb-4 mb-lg-0">
                <h5 className="title mb-3 d-block follow">Follow Us </h5>
                <div className="footer-social justify-content-center justify-content-lg-start">
                  {/* <ul>
                  {links.map((item, index) => {
                    const { url, name } = item || {};
                    return (
                      url &&
                      name && (
                        <li key={index}>
                          <a
                            href={url}
                            title={name}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i
                              className={
                                iconClass[name.toLowerCase()] ||
                                "fa-solid fa-link"
                              }
                            />
                          </a>
                        </li>
                      )
                    );
                  })}
                </ul> */}

                  <ul>
                    {[
                      {
                        icon: "fab fa-facebook-f",
                        name: "Facebook_Social_Link",
                      },
                      {
                        icon: "fab fa-instagram",
                        name: "Instagram_Social_Link",
                      },
                      { icon: "fa-brands fa-x-twitter", name: "X_Social_Link" },
                      {
                        icon: "fa-brands fa-threads",
                        name: "Threads_Social_Link",
                      },
                      {
                        icon: "fa-brands fa-youtube",
                        name: "Youtube_Social_Link",
                      },
                    ].map((item, i) => {
                      const { icon, name } = item;
                      const capitalizedName =
                        name.split("_")[0].charAt(0).toUpperCase() +
                        name.split("_")[0].slice(1); // Capitalize only the first letter
                      const link = links ? links[name] : ""; // Dynamically fetch the link based on the name from liveLinks

                      return (
                        <li key={i}>
                          {link ? (
                            <a
                              href={link}
                              title={capitalizedName}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className={icon[name.toLowerCase()] || icon} />
                            </a>
                          ) : (
                            <span>{capitalizedName} link not available</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* Logo Section */}
              <div className="col-md-4 col-lg-4 text-center mb-4 mb-lg-0">
                <Link to="/" className="footer-logo">
                  <img
                    className="logo img-fluid"
                    src="images/logo.png"
                    alt="logo"
                  />
                </Link>
              </div>

              {/* Download App Section */}
              <div className="col-md-4 col-lg-4">
                <div className="download-app align-items-center justify-content-center justify-content-lg-start text-center">
                  <h5 className="title mb-3 d-block download">Download App</h5>
                  <div className="app_icons">
                    {androidLink && (
                      <a
                        href={androidLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          className="img-fluid"
                          src={`${process.env.PUBLIC_URL}/images/android-download.png`}
                          alt="Play Store"
                        />
                      </a>
                    )}

                    {links?.Apple_Store && (
                      <a
                        href={links.Apple_Store}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          className="img-fluid"
                          src={`${process.env.PUBLIC_URL}/images/appleapp.svg`}
                          alt="Apple Store"
                        />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="container">
            <div className="row align-items-center copyright">
              <div className="col-12 col-md-6 text-center text-md-start">
                <div className="copyright-menu footer-menu">
                  <ul className="mb-0 justify-content-center justify-content-md-start list-unstyled">
                    <li>
                      <Link to="/terms">Terms &amp; Conditions</Link>
                    </li>
                    <li>
                      <Link to="/privacy">Privacy Policy</Link>
                    </li>
                    <li>
                      <Link to="/cookies">Cookie Policy</Link>
                    </li>
                    <li>
                      <Link to="/rules">Rules Of Play &amp; FAQs</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-12 col-md-6 text-center text-md-end mt-2 mt-md-0">
                <p className="mb-0">
                  © Copyright <span id="copyright"> 2025</span>{" "}
                  <Link to="/"> SpotsBall Global PVT. LTD. </Link> All Rights
                  Reserved
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div
        id="back-to-top"
        className="back-to-top"
        style={{
          display: showBackToTop ? "block" : "none",
          position: "fixed",
          bottom: "20px",
          right: "20px",
          cursor: "pointer",
          zIndex: "99",
        }}
        onClick={scrollToTop}
      >
        <a>
          <i className="fa-solid fa-arrow-up" />
        </a>
      </div>
    </>
  );
}

export default Footer;
