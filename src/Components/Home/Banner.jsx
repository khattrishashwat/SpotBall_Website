import React from "react";

function Banner() {
  return (
    <>
      <div className="color-container">
        <div className="c1"></div>
        <div className="c2"></div>
        <div className="c3"></div>
        <div className="c4"></div>
        <div className="c6"></div>
        <div className="c5"></div>
        <div className="c7"></div>

        <section
          className="banner banner-01"
          style={{
            backgroundImage: "url(images/home-4-banner-bg.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            position: "relative",
            padding: "50px 0",
            paddingTop: "100px",
            paddingBottom: "150px",
            top: "-65px",
          }}
        >
          <div className="container">
            <div id="main-slider" className="swiper-container">
              <div className="swiper-wrapper">
                <div className="swiper-slide align-items-center d-flex slide-01 header-position">
                  <div
                    className="pattern-01"
                    data-swiper-animation="fadeIn"
                    data-duration="1.5s"
                    data-delay="1.0s"
                  >
                    <img
                      className="img-fluid vert-move"
                      src="images/home-01/pattern-01.png"
                      alt=""
                    />
                  </div>
                  <div
                    className="pattern-03"
                    data-swiper-animation="fadeIn"
                    data-duration="1.5s"
                    data-delay="1.0s"
                  >
                    <img
                      className="img-fluid vert-move"
                      src="images/target.png"
                      alt=""
                    />
                  </div>
                  <div className="pattern-04">
                    <img className="" src="images/Artboard 2@4x.png" alt="" />
                  </div>
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-12 col-lg-7 position-relative">
                        <h1
                          className=" text-start"
                          data-swiper-animation="fadeInUp"
                          data-duration="1.5s"
                          data-delay="1.0s"
                        >
                          Every week a{" "}
                          <span className="fs-1 fw-800">₹50,000</span> jackpot!
                        </h1>
                        <h2
                          className="text-start"
                          data-swiper-animation="fadeInUp"
                          data-duration="1.5s"
                          data-delay="1.0s"
                        >
                          Think you've got cricket skills? <br />
                          Mark the hidden ball in the picture!
                        </h2>

                        <div className="d-flex align-items-center gap-2">
                          <a
                            href="javascript:void(0)"
                            className="btn btn-white mt-3 mt-md-4"
                            data-swiper-animation="fadeInUp"
                            data-duration="1.5s"
                            data-delay="3.0s"
                          >
                            Sign In
                          </a>
                          <a
                            href="https://youtu.be/n_Cn8eFo7u8"
                            className="btn btn-white color-green mt-3 mt-md-4 popup-youtube video-btn"
                            data-swiper-animation="fadeInUp"
                            data-duration="1.5s"
                            data-delay="3.0s"
                          >
                            How To Play
                          </a>
                        </div>

                        <div className="btn_tdy p-3 px-3">
                          <span>
                            <a href="javascript:void(0)"> Sign Up </a>Today,
                            Play and Win the game
                          </span>
                        </div>

                        <div
                          className="pattern-02"
                          data-swiper-animation="fadeIn"
                          data-duration="5.5s"
                          data-delay="1.0s"
                        >
                          <img
                            className="custom-animation img-fluid"
                            src="images/home-01/pattern-02.png"
                            alt=""
                          />
                        </div>
                      </div>
                      <div className="col-12 col-lg-5 d-none d-lg-flex justify-content-center">
                        <div className="banner-img">
                          <img
                            className="img-fluid hori-move"
                            src="images/aaa.png"
                            data-swiper-animation="fadeIn"
                            data-duration="5.0s"
                            data-delay="1.0s"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="banner-gallery">
          <div className="container">
            <div className="row g-3 gallery-wrap ">
              <div className="col ">
                <span className="gradient-border" id="box">
                  <img className="img-fluid" src="images/1.gif" alt="Cricket" />{" "}
                </span>
              </div>
              <div className="col">
                <span className="gradient-border" id="box">
                  <img className="img-fluid" src="images/2.gif" alt="Cricket" />{" "}
                </span>
              </div>
              <div className="col">
                <span className="gradient-border" id="box">
                  <img className="img-fluid" src="images/3.gif" alt="Cricket" />{" "}
                </span>
              </div>
              <div className="col">
                <span className="gradient-border" id="box">
                  <img className="img-fluid" src="images/4.gif" alt="Cricket" />{" "}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="working-process pt-2">
          <div className="container">
            <div className="section-title">
              <h2 className="title">
                How it <span>works</span>
              </h2>
              <h3 className="sub-title">
                Here’s how you can be a part of SpotsBall and win the Jackpot!
              </h3>
            </div>
          </div>

          <div className="pset">
            <div className="container">
              <div className="row listar-feature-items">
                <div
                  className="col-xs-12 col-sm-6 col-md-4 listar-feature-item-wrapper listar-feature-with-image listar-height-changed"
                  data-aos="fade-zoom-in"
                  data-aos-group="features"
                  data-line-height="25.2px"
                >
                  <div className="listar-feature-item listar-feature-has-link">
                    <a href="javascript:void(0)" target="_blank"></a>

                    <div className="listar-feature-item-inner">
                      <div className="listar-feature-block-content-wrapper">
                        <div className="listar-feature-icon-wrapper">
                          <div className="listar-feature-icon-inner">
                            <div>
                              <img
                                alt="Businesses"
                                className="listar-image-icon"
                                src="images/tickets.png"
                              />
                            </div>
                          </div>
                        </div>

                        <div
                          className="listar-feature-content-wrapper"
                          style={{
                            paddingTop: "0px",
                          }}
                        >
                          <div className="listar-feature-item-title listar-feature-counter-added">
                            <span>
                              <span>01</span>
                              Buy a Ticket{" "}
                            </span>
                          </div>

                          <div className="listar-feature-item-excerpt">
                            Get your ticket to enter the weekly challenge. More
                            tickets, better chances!
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="listar-feature-fix-bottom-padding listar-fix-feature-arrow-button-height"></div>
                </div>

                <div
                  className="col-xs-12 col-sm-6 col-md-4 listar-feature-item-wrapper listar-feature-with-image listar-height-changed"
                  data-aos="fade-zoom-in"
                  data-aos-group="features"
                  data-line-height="25.2px"
                >
                  <div className="listar-feature-item listar-feature-has-link">
                    <a href="javascript:void(0)" target="_blank"></a>

                    <div className="listar-feature-item-inner">
                      <div className="listar-feature-block-content-wrapper">
                        <div className="listar-feature-icon-wrapper">
                          <div className="listar-feature-icon-inner">
                            <div>
                              <img
                                alt="Customers"
                                className="listar-image-icon"
                                src="images/target.png"
                              />
                            </div>
                          </div>
                        </div>

                        <div
                          className="listar-feature-content-wrapper"
                          style={{
                            paddingTop: "0px",
                          }}
                        >
                          <div className="listar-feature-item-title listar-feature-counter-added">
                            <span>
                              <span>02</span>
                              Spot the Ball{" "}
                            </span>
                          </div>

                          <div className="listar-feature-item-excerpt">
                            Use your cricket skills to pinpoint the hidden ball
                            and mark the coordinates.{" "}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="listar-feature-fix-bottom-padding listar-fix-feature-arrow-button-height"></div>
                </div>

                <div
                  className="col-xs-12 col-sm-6 col-md-4 listar-feature-item-wrapper listar-feature-with-image listar-height-changed"
                  data-aos="fade-zoom-in"
                  data-aos-group="features"
                  data-line-height="25.2px"
                >
                  <div className="listar-feature-item listar-feature-has-link last">
                    <a href="javascript:void(0)" target="_blank"></a>

                    <div className="listar-feature-item-inner">
                      <div className="listar-feature-block-content-wrapper">
                        <div className="listar-feature-icon-wrapper">
                          <div className="listar-feature-icon-inner">
                            <div>
                              <img
                                alt="Feedback"
                                className="listar-image-icon"
                                src="images/rupee.png"
                              />
                            </div>
                          </div>
                        </div>

                        <div
                          className="listar-feature-content-wrapper"
                          style={{
                            paddingTop: "0px",
                          }}
                        >
                          <div className="listar-feature-item-title listar-feature-counter-added">
                            <span>
                              <span>03</span>
                              Chance to win{" "}
                            </span>
                          </div>

                          <div className="listar-feature-item-excerpt">
                            Closest guess wins ₹50,000! Play smart, test your
                            skills, and claim your prize.{" "}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="listar-feature-fix-bottom-padding listar-fix-feature-arrow-button-height"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section
          className="upcoming-matches py-80"
          style={{
            backgroundImage: "url(images/cricket_stadium-1.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div className="container">
            <div className="row justify-content-center s-deborder">
              <div className="col-xl-10 col-lg-11">
                <div className="upcoming-matches-wrapper">
                  <div className="team-block">
                    <div
                      className="pattern-01"
                      data-swiper-animation="fadeIn"
                      data-duration="1.5s"
                      data-delay="1.0s"
                    >
                      <img
                        className="img-fluid vert-move side-pattern-height"
                        src="images/batsman.png"
                        alt=""
                      />
                    </div>
                    <div className="entriesdiv_inner opendiv_entries">
                      <h3>Entries Open</h3>
                      {/* <p>Monday: 12:00 hrs</p> */}
                    </div>
                  </div>
                  <div className="live-match-block">
                    <div className="text-label">
                      <h5 className="white text-uppercase">upcoming Contest</h5>
                    </div>
                    <div className="live-box">
                      <img
                        src="images/live-text.png"
                        alt=""
                        className="live-image"
                      />
                      <div className="counter-box">
                        <ul className="unstyled countdown-left">
                          <li>
                            <h2 id="days"></h2>
                          </li>
                          <li>
                            <h2 id="hours"></h2>
                          </li>
                          <li>
                            <h2 id="minutes"></h2>
                          </li>
                          <li>
                            <h2 id="seconds"></h2>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="team-block">
                    <div className="entriesdiv_inner closediv_entries">
                      <h3>Entries Close</h3>
                      <p>Sunday: 23:59 hrs</p>
                    </div>

                    <div
                      className="pattern-01"
                      data-swiper-animation="fadeIn"
                      data-duration="1.5s"
                      data-delay="1.0s"
                    >
                      <img
                        className="img-fluid vert-move side-pattern-height we"
                        src="images/bowler.png"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="working-process  pb-0">
          <div className="container">
            <div className="section-title mb-4 text-center">
              <h2 className="title">
                Current <span>contest</span>
              </h2>
            </div>

            <div
              className="Current-contest"
              style={{
                position: "relative",
              }}
            >
              <div className="Current-contest-1 main img">
                <img className="side-curve" src="images/golfer-1.png" />
                <img className="main-pic" src="images/C8A0066.jpg" />
                <span className="mark-text ">
                  Mark the hidden ball in the picture!
                </span>

                <div
                  className="pattern-03 banner1"
                  data-swiper-animation="fadeIn"
                  data-duration="1.5s"
                  data-delay="1.0s"
                >
                  <img
                    className="img-fluid vert-move"
                    src="images/target.png"
                    alt=""
                  />
                </div>
                <div className="pattern-04 banner1">
                  <img className="" src="images/Artboard 2@4x.png" alt="" />
                </div>
              </div>

              <div
                className="Current-contest-1 blue"
                style={{
                  position: "relative",
                }}
              >
                <div className="pattern-05 banner1">
                  <img
                    className="img-fluid vert-move"
                    src="images/Artboard 2@4x.png"
                    alt=""
                  />
                </div>

                <div className="compitiontextinfodivmain">
                  <div className="contestpoints_main">
                    <div className="contesteveryweekdiv">
                      <div className="contest_newtiming_strip">
                        <span className="line-img">
                          <img src="images/calendar.png" />
                        </span>
                        <h4>Every Week’s Contest Ends</h4>
                      </div>
                      <div className="contestrightdaysdate contest_newtiming_strip mb-0">
                        <span className="line-img calendar">
                          <img src="images/wall-clock.png" />
                        </span>
                        <h4 className="contslist_span_inner">
                          Sunday- 23:59hrs
                        </h4>
                      </div>
                    </div>
                    <div className="contesteveryweekdiv">
                      <div className="contest_newtiming_strip">
                        <span className="line-img ">
                          <img src="images/calendar.png" />
                        </span>
                        {/* <h4>Every Week Live Stream <br> SpotsBall’s “Weekly Winner Show”</h4> */}
                      </div>
                      <div className="contestrightdaysdate contest_newtiming_strip mb-0">
                        <span className="line-img calendar">
                          <img src="images/wall-clock.png" />
                        </span>
                        <h4 className="contslist_span_inner">
                          Monday- 21:00hrs
                        </h4>
                      </div>
                    </div>

                    <div
                      className="everyweek_livewatchdiv contesteveryweekdiv mb-0"
                      style={{
                        background: "none",
                        boxShadow: "none",
                      }}
                    >
                      <div className="watchondiv">
                        <a href="javascript:void(0)">
                          <span className="fb">
                            <i className="fa-brands fa-facebook"></i> Watch on
                            Facebook
                          </span>
                        </a>
                        <a href="javascript:void(0)">
                          <span className="yt">
                            <i className="fa-brands fa-youtube"></i>Watch on
                            Youtube
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="discount-coupons1">
              <div className="container">
                <div className="section-title short mb-3 d-flex justify-content-center">
                  <h2 className="title">Discounts Available</h2>
                </div>
                <div className="discount-coupons">
                  <div className="card first">
                    <div className="main">
                      <div className="co-img">
                        <img src="images/target.png" alt="" />
                      </div>
                      <div className="vertical"></div>
                      <div className="content">
                        <h2>Tickets: 10-25</h2>
                        <h1>
                          5% <span>Discount</span>
                        </h1>
                      </div>
                    </div>
                  </div>

                  <div className="card second">
                    <div className="main">
                      <div className="co-img">
                        <img src="images/target.png" alt="" />
                      </div>
                      <div className="vertical"></div>
                      <div className="content">
                        <h2>Tickets: 26-40</h2>
                        <h1>
                          10% <span>Discount</span>
                        </h1>
                      </div>
                    </div>
                  </div>

                  <div className="card third">
                    <div className="main">
                      <div className="co-img">
                        <img src="images/target.png" alt="" />
                      </div>
                      <div className="vertical"></div>
                      <div className="content">
                        <h2>Tickets: 41-75</h2>
                        <h1>
                          15% <span>Discount</span>
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section
          className="tickets-section bg-primary py-80"
          style={{
            backgroundImage: "url(images/home-4-banner-bg.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div className="container">
            <div className="heading mb-3">
              <div className="d-flex flex-wrap gap-16 align-items-center justify-content-between">
                <h3 className=" ">
                  Tickets <span>Available</span>
                </h3>
              </div>
            </div>

            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="ticketing-slider">
                  <div className="ticket-container">
                    <div className="barcode-box">
                      <img
                        src="images/barcode-1.png"
                        alt=""
                        className="d-sm-flex d-none"
                      />
                      <img
                        src="images/barcode-2.png"
                        alt=""
                        className="d-sm-none d-block"
                      />
                    </div>
                    <div className="contest_maindiv_popup_inner">
                      <div className="contestheading">
                        <h2>
                          <span>For</span> ₹50,000 <span>Jackpot Prize</span>
                        </h2>
                      </div>

                      <div className="contesttickeprice">
                        <p>
                          {" "}
                          Ticket :
                          <span>
                            <i className="fa fa-inr" aria-hidden="true"></i>{" "}
                            49/-
                          </span>{" "}
                        </p>
                      </div>

                      <div className="contest_quantity_para_div">
                        <div className="addcart_contst_textinfo">
                          <img src="images/ball_icon.png" />
                          <h2>
                            Use Add and subtract button for increase and
                            decrease your tickets
                          </h2>
                        </div>
                        <div className="addcart_contst_textinfo">
                          <img src="images/ball_icon.png" />
                          <h2>Max 75 tickets per person</h2>
                        </div>
                      </div>

                      <div className="d-flex flex-wrap gap-16 align-items-center mt-3 ">
                        <a
                          href="javascript:void(0)"
                          className="btn btn-primary text-uppercase rounded-2"
                        >
                          buy Now
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <section
                  className="video-section-02"
                  style={{
                    backgroundImage: "url(images/home-4-banner-bg.jpg)",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100% 100%",
                    position: "relative",
                    zIndex: 1,
                    height: "266px",
                    borderRadius: "10px",
                  }}
                >
                  <div className="container">
                    <div className="row justify-content-center">
                      <div className="col-md-10 col-lg-9 col-xl-7">
                        <div className="video-style-04">
                          <a
                            href="https://youtu.be/n_Cn8eFo7u8"
                            className="play-btn circle b-round popup-youtube video-btn"
                          >
                            <i className="fa-solid fa-play"></i>
                          </a>
                          <h2>How To Play</h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Banner;
