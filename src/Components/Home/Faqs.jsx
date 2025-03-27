import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Faqs({ data }) {
  const [activeIndex, setActiveIndex] = useState(null);
  if (!data) return null;
  const { apk, faqs } = data;

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <section className="app-section section-b-space" style={{}}>
        <div className="container">
          <div>
            <video
              autoPlay=""
              loop=""
              muted=""
              style={{
                margin: "auto",
                position: "absolute",
                zIndex: -1,
                top: "50%",
                left: "0%",
                transform: "translate(0%, -50%)",
                visibility: "visible",
                opacity: 1,
                width: "100%",
                height: "auto",
              }}
            >
              <source src="images/Untitled design (25).mp4" type="video/mp4" />
              <source src="images/flight.webm" type="video/webm" />
              <source src="images/flight.ogv" type="video/ogg" />
            </video>
          </div>
          <div className="container">
            <div className="row order-cls">
              <div className="col-lg-6">
                <div className="app-content">
                  <div
                    animated=""
                    animated-media-none=""
                    data-animation-type="fadeInUp"
                    data-animation-duration={1}
                  >
                    <h2 className="title ">
                      Test Your Cricket Skills, Spot the Ball and
                      <span>Stand a Chance to Win</span>
                    </h2>
                    <p>
                      SpotsBall is the ultimate cricket challenge app where you
                      can put your cricket skills to the test. At SpotsBall, we
                      bring the thrill of cricket right to your fingertips. We
                      host a weekly exciting contest where you simply have to
                      spot the hidden ball in the game. Think you have got sharp
                      eyes and cricket instincts? Find the ball, mark the exact
                      coordinates, and stand a chance to win the grand prize,
                      every week.
                    </p>
                    <div
                      className=" animated animated-media-none"
                      data-animation-duration={1}
                      data-animation-delay="0.9"
                    >
                      <div className="we-fly__btn-boxes app-buttons">
                        {/* iOS App Button */}
                        {apk?.ios_build && (
                          <div className="we-fly__btn-one-box">
                            <a
                              href={apk.ios_build}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="thm-btn we-fly__btn-one btn btn-curve"
                            >
                              <img src="images/apple.svg" alt="App Store" />
                              App Store
                            </a>
                          </div>
                        )}

                        {/* Android App Button */}
                        {apk?.android_build && (
                          <div className="we-fly__btn-two-box">
                            <a
                              href={apk.android_build}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="thm-btn we-fly__btn-two btn btn-curve white-btn"
                            >
                              <img src="images/android.svg" alt="Android App" />
                              Android App
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="app-image">
                  <div
                    animated=""
                    animated-media-none=""
                    data-animation-type="fadeInLeft"
                    data-animation-duration={1}
                    data-animation-delay="0.4"
                  >
                    <div className="image ">
                      <div className="circle b-round" />
                      <img
                        src="images/Frame-1 (2).png"
                        alt=""
                        className="img-fluid blur-up lazyloaded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="space-ptb">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="section-title mb-4 faq">
                <h2>
                  Frequently asked <span>questions</span>
                </h2>
              </div>
              {/* <div
                className="accordion accordion-flush"
                id="accordionFlushExample"
              >
                {faqs.map((item, index) => (
                  <div className="accordion-item" key={index}>
                    <h2
                      className="accordion-header"
                      id={`flush-heading${index}`}
                    >
                      <button
                        className={`accordion-button ${
                          activeIndex === index ? "" : "collapsed"
                        }`}
                        type="button"
                        onClick={() => toggleFAQ(index)}
                        data-bs-toggle="collapse"
                        data-bs-target={`#flush-collapse${index}`}
                        aria-expanded={activeIndex === index ? "true" : "false"}
                        aria-controls={`flush-collapse${index}`}
                      >
                        {item.question}
                      </button>
                    </h2>
                    <div
                      id={`flush-collapse${index}`}
                      className={`accordion-collapse collapse ${
                        activeIndex === index ? "show" : ""
                      }`}
                      aria-labelledby={`flush-heading${index}`}
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div className="accordion-body">
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div> */}
              <div
                className="accordion accordion-flush"
                id="accordionFlushExample"
              >
                {faqs.slice(0, 4).map((item, index) => (
                  <div className="accordion-item" key={index}>
                    <h2
                      className="accordion-header"
                      id={`flush-heading${index}`}
                    >
                      <button
                        className={`accordion-button ${
                          activeIndex === index ? "" : "collapsed"
                        }`}
                        type="button"
                        onClick={() => toggleFAQ(index)}
                        data-bs-toggle="collapse"
                        data-bs-target={`#flush-collapse${index}`}
                        aria-expanded={activeIndex === index ? "true" : "false"}
                        aria-controls={`flush-collapse${index}`}
                      >
                        {item.question}
                      </button>
                    </h2>
                    <div
                      id={`flush-collapse${index}`}
                      className={`accordion-collapse collapse ${
                        activeIndex === index ? "show" : ""
                      }`}
                      aria-labelledby={`flush-heading${index}`}
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div className="accordion-body">
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex flex-wrap gap-16 justify-content-center align-items-center mt-5">
                <Link
                  to="/rules"
                  className="btn btn-primary text-uppercase rounded-2"
                >
                  View All
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Faqs;
