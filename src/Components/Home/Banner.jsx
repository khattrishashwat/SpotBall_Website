import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GeolocationPopup from "../Location/GeolocationPopup";
import GameUnavailablePopup from "../Location/GameUnavailablePopup";
import { Dialog, DialogContent, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function Banner({ data }) {
  const {
    livs,
    movies,
    restrictedStates,
    howItWorks,
    banner,
    contests,
    discounts,
    bannerGIFS,
  } = data || {};
  const navigate = useNavigate();
  const title = howItWorks?.title || "";
  const words = title.split(" ");
  const [leftticket, setLeftticket] = useState("");

  const [quantity, setQuantity] = useState(3);

  const [onCloseComptition, setOnCloseComptition] = useState("");
  const [selectedContest, setSelectedContest] = useState("");
  const [onCarts, setOnCarts] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState("");
  const [isGeolocationPopupVisible, setGeolocationPopupVisible] =
    useState(false);
  const [isUnavailablePopupVisible, setIsUnavailablePopupVisible] =
    useState(false);
  const [countdownType, setCountdownType] = useState("ends"); // "starts" or "ends"
  const token = localStorage.getItem("Web-token");
  const [open, setOpen] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  // Function to get the next countdown time
  const getTargetTime = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    const nextMondayNoon = new Date(now);
    nextMondayNoon.setDate(now.getDate() + ((7 - dayOfWeek + 1) % 7)); // Get the next Monday
    nextMondayNoon.setHours(12, 0, 0, 0); // Monday 12:00 PM

    const nextSundayEnd = new Date(now);
    nextSundayEnd.setDate(now.getDate() + ((7 - dayOfWeek) % 7)); // Get the next Sunday
    nextSundayEnd.setHours(23, 59, 59, 999); // Sunday 23:59

    const mondayMorning = new Date(nextMondayNoon);
    mondayMorning.setHours(0, 5, 0, 0); // Monday 00:05 AM

    if (dayOfWeek === 0) {
      // **Sunday**
      if (currentHours >= 0 && currentHours < 12) {
        setCountdownType("starts");
        return nextMondayNoon.getTime(); // Countdown to Monday 12:00 PM
      } else {
        setCountdownType("ends");
        return nextSundayEnd.getTime(); // Countdown to Sunday 23:59
      }
    } else if (dayOfWeek === 1 && currentHours >= 0 && currentHours < 12) {
      // **Monday before 12:00 PM**
      setCountdownType("starts");
      return nextMondayNoon.getTime(); // Countdown to Monday 12:00 PM
    } else {
      // **Monday 12:00 PM - Sunday 23:59**
      setCountdownType("ends");
      return nextSundayEnd.getTime(); // Countdown to Sunday 23:59
    }
  };

  useEffect(() => {
    let countDownDate = getTargetTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      if (distance < 0) {
        countDownDate = getTargetTime();
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   const checkGeolocation = () => {
  //     const location = localStorage.getItem("location");
  //     const restrictedArea = localStorage.getItem("restrictedArea");
  //     // const location = JSON.parse(localStorage.getItem("location"));
  //     // const restrictedArea = JSON.parse(localStorage.getItem("restrictedArea"));
  //     const token = localStorage.getItem("Web-token");

  //     const hasLocation = location && Object.keys(location).length > 0;
  //     const hasRestrictedArea =
  //       restrictedArea && Object.keys(restrictedArea).length > 0;

  //     if (token) {
  //       setGeolocationPopupVisible(!(hasLocation || hasRestrictedArea));
  //     } else {
  //       setGeolocationPopupVisible(false);
  //     }
  //   };

  //   checkGeolocation();

  //   // Listen for localStorage changes
  //   const handleStorageChange = (event) => {
  //     if (event.key === "location" || event.key === "restrictedArea") {
  //       checkGeolocation();
  //     }
  //   };

  //   window.addEventListener("storage", handleStorageChange);

  //   return () => {
  //     window.removeEventListener("storage", handleStorageChange);
  //   };
  // }, [token]);

  const handleAskToPaly = () => {
    const restrictedArea = localStorage.getItem("restrictedArea");
    const location = localStorage.getItem("location");
    const token = localStorage.getItem("Web-token");

    if (!token) {
      Swal.fire({
        icon: "info",
        title: "Login Required",
        text: "Please login to participate in this contest!",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    if (restrictedArea) {
      setGeolocationPopupVisible(false);
      setIsUnavailablePopupVisible(true);
      return;
    }

    // handleBuyTicketClick(contests[0], discounts);
    if (location) {
      handleBuyTicketClick(contests[0], discounts);
    } else {
      //   console.log("Location not found in localStorage");
    }
  };

  const handleBuyTicketClick = (contest, discount) => {
    const token = localStorage.getItem("Web-token"); // Replace with your token retrieval method

    if (contest.totalTickets === 75) {
      Swal.fire({
        icon: "error",
        title: "No More Tickets",
        text: "You have already participated in this contest! You have chosen all the tickets.",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
      return;
    }

    console.log(
      "is_active value:",
      contest.is_active,
      typeof contest.is_active
    );

    if (contest.is_active === false) {
      console.log("Contest is NOT active");
      setOnCloseComptition(true);
      return;
    }

    // If contest is active, proceed with normal flow
    setSelectedContest(contest);
    setOnCarts(true);
    setSelectedDiscount(discount);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: false,
    centerPadding: 10,
    responsive: [
      {
        breakpoint: 768, // For mobile devices
        settings: {
          slidesToShow: 1, // Show 1 slide on mobile
          slidesToScroll: 1, // Scroll 1 slide on mobile
        },
      },
      {
        breakpoint: 1024, // For tablets
        settings: {
          slidesToShow: 2, // Show 2 slides on tablets
          slidesToScroll: 1,
        },
      },
    ],
  };
  const handleIncrease = () => {
    const ticketsLeft =
      selectedContest.maxTickets - selectedContest.totalTickets;
    setLeftticket(ticketsLeft);

    if (quantity < selectedContest?.maxTickets && quantity < ticketsLeft) {
      setQuantity((prev) => prev + 1);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Max Ticket Limit Reached",
        text: `You can only purchase a maximum of ${selectedContest?.maxTickets} tickets per person, but you have already bought ${selectedContest?.totalTickets} tickets. You have only ${ticketsLeft} ticket(s) left to purchase.`,
        allowOutsideClick: false,
        confirmButtonText: "OK",
      });
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleBulkSelect = (value) => {
    const ticketsLeft =
      selectedContest.maxTickets - selectedContest.totalTickets;
    setLeftticket(ticketsLeft);
    // If the selected value exceeds the available tickets, show an error
    if (value > ticketsLeft) {
      Swal.fire({
        icon: "error",
        title: "Ticket Limit Exceeded",
        text: `You can only purchase a maximum of ${selectedContest?.maxTickets} tickets per person, but you have already bought ${selectedContest?.totalTickets} tickets. You have only ${ticketsLeft} ticket(s) left to purchase.`,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
      return; // Stop execution if the selection is invalid
    }
    setQuantity(value);
  };

  const handlePlayNow = () => {
    const ticketsLeft =
      selectedContest.maxTickets - selectedContest.totalTickets;
    setLeftticket(ticketsLeft);

    // Ensure the default quantity (3) doesn't exceed available tickets
    if (ticketsLeft === 0) {
      Swal.fire({
        icon: "error",
        title: "No Tickets Available",
        text: "There are no tickets left for this contest.",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
      return;
    }

    if (quantity > ticketsLeft) {
      Swal.fire({
        icon: "error",
        title: "Not Enough Tickets Available",
        text: `Only ${ticketsLeft} tickets are available. Please select a valid quantity.`,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
      return;
    }

    const payload = {
      leftticket: ticketsLeft,
      quantity: quantity > ticketsLeft ? ticketsLeft : quantity, // Ensure quantity does not exceed available tickets
      responseData: selectedContest,
    };

    localStorage.setItem(
      "quantity",
      quantity > ticketsLeft ? ticketsLeft : quantity
    );

    navigate("/play_screen", { state: { payload } });
  };
  const ClosedCarts = async () => {
    setOnCarts(false);
    setOnCloseComptition(false);
    setQuantity(3);
  };

  useEffect(() => {
    const fetchLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            console.log("Latitude:", latitude, "Longitude:", longitude);

            try {
              const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyA8pM5yXTJ3LM8zBF-EkZHEyxlPXSttsl0`
              );

              const results = response.data.results;
              if (!results || results.length === 0) {
                console.error("No results found in geocode response.");
                return;
              }

              const addressComponents = results[0].address_components || [];
              let stateName = "";
              let countryName = "";

              // Extract state and country from address components
              addressComponents.forEach((component) => {
                if (component.types.includes("administrative_area_level_1")) {
                  stateName = component.long_name;
                }
                if (component.types.includes("country")) {
                  countryName = component.long_name;
                }
              });

              console.log(
                "State Name:",
                stateName,
                "Country Name:",
                countryName
              );

              // Ensure restrictedStates is not null or undefined
              const restrictedAreaStates = restrictedStates || [];
              // console.log("restrictedAreaStates", restrictedAreaStates);

              // Check if the country is not India
              if (countryName.toLowerCase() !== "india") {
                Swal.fire({
                  title: "Area Restricted",
                  text: `Access is restricted outside India. Current location: ${stateName}, ${countryName}`,
                  icon: "error",
                  confirmButtonText: "OK",
                });

                localStorage.removeItem("location");
                localStorage.setItem(
                  "restrictedArea",
                  JSON.stringify({ stateName, countryName })
                );

                setIsUnavailablePopupVisible(true);
                return;
              }

              // Check if the state is restricted
              const isRestrictedState = restrictedAreaStates.some(
                (restrictedState) =>
                  restrictedState.toLowerCase() === stateName.toLowerCase()
              );

              if (isRestrictedState) {
                localStorage.removeItem("location");
                localStorage.setItem(
                  "restrictedArea",
                  JSON.stringify({ stateName, countryName })
                );

                setIsUnavailablePopupVisible(true);
                return;
              }

              // If not restricted, store location and remove restrictedArea
              localStorage.removeItem("restrictedArea");
              localStorage.setItem(
                "location",
                JSON.stringify({ stateName, countryName })
              );

              // console.log("Location saved:", { stateName, countryName });
            } catch (err) {
              console.error("Error fetching geocode data:", err);
            }
          },
          (error) => {
            console.error("Geolocation error:", error.message);
          }
        );
      }
    };
    const token = localStorage.getItem("Web-token");
    if (token) {
      fetchLocation();
    }
  }, [restrictedStates]);

  useEffect(() => {
    const checkGeolocation = () => {
      const location = JSON.parse(localStorage.getItem("location") || "null");
      const restrictedArea = JSON.parse(
        localStorage.getItem("restrictedArea") || "null"
      );

      const hasLocation = location && Object.keys(location).length > 0;
      const hasRestrictedArea =
        restrictedArea && Object.keys(restrictedArea).length > 0;

      if (token) {
        setGeolocationPopupVisible(!(hasLocation || hasRestrictedArea));
      } else {
        setGeolocationPopupVisible(false);
      }
    };

    checkGeolocation();

    // Listen for localStorage changes
    const handleStorageChange = (event) => {
      if (event.key === "location" || event.key === "restrictedArea") {
        checkGeolocation();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [token]);

  useEffect(() => {
    if (onCarts || onCloseComptition) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [onCarts, onCloseComptition]);
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
            paddingTop: 150,
            paddingBottom: 150,
            top: "-65px",
          }}
        >
          <div className="container">
            <div id="main-slider1" className="swiper-container">
              <div className="swiper-wrapper1">
                <div className="swiper-slide1 align-items-center d-flex slide-01 header-position">
                  <div
                    className="pattern-01"
                    data-swiper-animation="fadeIn"
                    data-duration="1.5s"
                    data-delay="1.0s"
                  >
                    <img
                      className="img-fluid vert-move"
                      src={`${process.env.PUBLIC_URL}/images/home-01/pattern-01.png`}
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
                      src={`${process.env.PUBLIC_URL}/images/target.png`}
                      alt=""
                    />
                  </div>
                  <div className="pattern-04">
                    <img
                      className=""
                      src={`${process.env.PUBLIC_URL}/images/Artboard 2@4x.png`}
                      alt=""
                    />
                  </div>
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-md-7 col-lg-7 position-relative">
                        {banner.length > 0 && (
                          <>
                            <h1
                              className="text-start"
                              data-swiper-animation="fadeInUp"
                              data-duration="1.5s"
                              data-delay="1.0s"
                            >
                              {banner[0].sub_title
                                .split(/(₹[\d,]+)/)
                                .map((part, index) =>
                                  part.match(/₹[\d,]+/) ? (
                                    <span key={index} className="fs-1 fw-800">
                                      {part}
                                    </span>
                                  ) : (
                                    part
                                  )
                                )}
                              !
                            </h1>

                            <h2
                              className="text-start"
                              data-swiper-animation="fadeInUp"
                              data-duration="1.5s"
                              data-delay="1.0s"
                            >
                              {banner[0].title.split("?")[0]}? <br />
                              {banner[0].title.split("?")[1]}
                            </h2>
                          </>
                        )}

                        <div className="d-flex align-items-center gap-2">
                          {!token && (
                            <Link
                              to="/login"
                              className="btn btn-white mt-3 mt-md-4"
                              data-swiper-animation="fadeInUp"
                              data-duration="1.5s"
                              data-delay="3.0s"
                            >
                              Sign In
                            </Link>
                          )}

                          <a
                            className="btn btn-white color-green mt-3 mt-md-4 popup-youtube video-btn"
                            data-swiper-animation="fadeInUp"
                            data-duration="1.5s"
                            data-delay="3.0s"
                            onClick={(e) => {
                              e.preventDefault(); // Prevent default link behavior
                              setOpen(true);
                            }}
                          >
                            How To Play
                          </a>

                          <Dialog
                            open={open}
                            onClose={() => setOpen(false)}
                            maxWidth="md"
                            fullWidth
                          >
                            <DialogContent
                              style={{
                                position: "relative",
                                padding: "16px",
                              }}
                            >
                              {/* Close Button (X)
                              // <IconButton
                              //   className="custom-close-btn"
                              //   onClick={() => setOpen(false)}
                              // >
                              //   <CloseIcon />
                              // </IconButton> */}

                              <div
                                style={{
                                  position: "relative",
                                  paddingBottom: "56.25%",
                                  height: 0,
                                }}
                              >
                                <iframe
                                  width="100%"
                                  height="100%"
                                  style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                  }}
                                  src={movies.video_url}
                                  title="video"
                                  frameBorder="0"
                                  allowFullScreen
                                ></iframe>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <div className="btn_tdy p-3 px-3">
                          <span>
                            {!token && <Link to="/signup"> Sign Up </Link>}
                            Today, Play and Win the game
                          </span>
                        </div>
                      </div>
                      <div className="col-md-5 col-lg-5 d-none d-lg-flex justify-content-center">
                        <div className="banner-img">
                          <img
                            className="img-fluid hori-move"
                            src={`${process.env.PUBLIC_URL}/images/aaa.png`}
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
            <div className="row g-3 gallery-wrap">
              {bannerGIFS?.bannerGifs?.map((gif, index) => (
                <div className="col" key={index}>
                  <span className="gradient-border" id="box">
                    <img
                      className="img-fluid"
                      src={gif}
                      alt={`Banner ${index + 1}`}
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="working-process pt-2">
          <div className="container">
            <div className="section-title">
              <h2 className="title">
                {words.slice(0, -1).join(" ")}{" "}
                {/* Join all words except the last one */}
                <span> {words[words.length - 1]}</span>{" "}
                {/* Wrap the last word in span */}
              </h2>
              ;<h3 className="sub-title">{howItWorks.description}</h3>
            </div>
          </div>

          <div className="pset">
            <div className="container">
              <div className="row listar-feature-items">
                {howItWorks?.steps?.map((step, index) => (
                  <div
                    key={step._id}
                    className="col-xs-12 col-sm-6 col-md-4 listar-feature-item-wrapper"
                  >
                    <div className="listar-feature-item listar-feature-has-link">
                      <div className="listar-feature-item-inner">
                        <div className="listar-feature-block-content-wrapper">
                          <div className="listar-feature-icon-wrapper">
                            <div className="listar-feature-icon-inner">
                              <div>
                                <img
                                  alt={step.title}
                                  className="listar-image-icon"
                                  src={step.icon_image || "default-image.png"}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="listar-feature-content-wrapper">
                            <div className="listar-feature-item-title">
                              <span>
                                <span>
                                  {String(index + 1).padStart(2, "0")}
                                </span>{" "}
                                {step.title}
                              </span>
                            </div>
                            <div className="listar-feature-item-excerpt">
                              {step.description || "No description available"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                        src={`${process.env.PUBLIC_URL}/images/batsman.png`}
                        alt=""
                      />
                    </div>
                    <div className="entriesdiv_inner opendiv_entries">
                      <h3>Entries Open</h3>
                      <p>Monday: 12:00 hrs</p>
                    </div>
                  </div>
                  <div className="live-match-block">
                    <div className="text-label">
                      <h5 className="white text-uppercase">upcoming Contest</h5>
                    </div>
                    <div className="live-box">
                      <img
                        src={`${process.env.PUBLIC_URL}/images/live-text.png`}
                        alt=""
                        className="live-image"
                      />
                      <div className="counter-box">
                        <ul className="unstyled countdown-left">
                          <li>
                            <h2 id="days">{timeLeft.days}D:</h2>
                          </li>
                          <li>
                            <h2 id="hours">{timeLeft.hours}H:</h2>
                          </li>
                          <li>
                            <h2 id="minutes">{timeLeft.minutes}M:</h2>
                          </li>
                          <li>
                            <h2 id="seconds">{timeLeft.seconds}S</h2>
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
                        src={`${process.env.PUBLIC_URL}/images/bowler.png`}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="working-process ct  pb-0">
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
                <img
                  className="side-curve"
                  src={`${process.env.PUBLIC_URL}/images/golfer-1.png`}
                />
                {contests?.length > 0 &&
                  contests[0]?.contest_banner?.file_url && (
                    <img
                      className="main-pic"
                      src={contests[0].contest_banner.file_url}
                      alt="Contest Banner"
                    />
                  )}{" "}
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
                    src={`${process.env.PUBLIC_URL}/images/target.png`}
                    alt=""
                  />
                </div>
                <div className="pattern-04 banner1">
                  <img
                    className=""
                    src={`${process.env.PUBLIC_URL}/images/Artboard 2@4x.png`}
                    alt=""
                  />
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
                    src={`${process.env.PUBLIC_URL}/images/Artboard 2@4x.png`}
                    alt=""
                  />
                </div>

                <div className="compitiontextinfodivmain">
                  <div className="contestpoints_main">
                    <div className="contesteveryweekdiv">
                      <div className="contest_newtiming_strip">
                        <span className="line-img">
                          <img
                            src={`${process.env.PUBLIC_URL}/images/calendar.png`}
                          />
                        </span>
                        <h4>Every Week’s Contest Ends</h4>
                      </div>
                      <div className="contestrightdaysdate contest_newtiming_strip mb-0">
                        <span className="line-img calendar">
                          <img
                            src={`${process.env.PUBLIC_URL}/images/wall-clock.png`}
                          />
                        </span>
                        <h4 className="contslist_span_inner">
                          Sunday- 23:59hrs
                        </h4>
                      </div>
                    </div>
                    <div className="contesteveryweekdiv">
                      <div className="contest_newtiming_strip">
                        <span className="line-img ">
                          <img
                            src={`${process.env.PUBLIC_URL}/images/calendar.png`}
                          />
                        </span>
                        <h4>
                          Every Week Live Stream <br /> SpotsBall’s “Weekly
                          Winner Show”
                        </h4>
                      </div>
                      <div className="contestrightdaysdate contest_newtiming_strip mb-0">
                        <span className="line-img calendar">
                          <img
                            src={`${process.env.PUBLIC_URL}/images/wall-clock.png`}
                          />
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
                        {livs?.Facebook_Streaming && (
                          <a
                            href={livs.Facebook_Streaming}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span className="fb">
                              <i className="fa-brands fa-facebook"></i> Watch on
                              Facebook
                            </span>
                          </a>
                        )}
                        {livs?.Youtube_Streaming && (
                          <a
                            href={livs.Youtube_Streaming}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span className="yt">
                              <i className="fa-brands fa-youtube"></i> Watch on
                              YouTube
                            </span>
                          </a>
                        )}
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
                  {discounts?.map((discount, index) => (
                    <div
                      className={`card ${
                        index === 0 ? "first" : index === 1 ? "second" : "third"
                      }`}
                      key={discount._id}
                    >
                      <div className="main">
                        <div className="co-img">
                          <img
                            src={`${process.env.PUBLIC_URL}/images/target.png`}
                            alt="Discount"
                          />
                        </div>
                        <div className="vertical"></div>
                        <div className="content">
                          <h2>
                            Tickets: {discount.minTickets}-{discount.maxTickets}
                          </h2>
                          <h1>
                            {discount.discountPercentage}% <span>Discount</span>
                          </h1>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <section
          className="tickets-section  py-80"
          style={{
            backgroundImage: "url(./images/home-4-banner-bg.jpg)",
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
                        src={`${process.env.PUBLIC_URL}/images/barcode-1.png`}
                        alt=""
                        className="d-sm-flex d-none"
                      />
                      <img
                        src={`${process.env.PUBLIC_URL}/images/barcode-2.png`}
                        alt=""
                        className="d-sm-none d-block"
                      />
                    </div>
                    <div className="contest_maindiv_popup_inner">
                      <div className="contestheading">
                        <h2>
                          <span>For</span> ₹
                          {contests[0]?.jackpot_price?.toLocaleString()}{" "}
                          <span>Grand Prize</span>
                        </h2>
                      </div>

                      <div className="contesttickeprice">
                        <p>
                          {" "}
                          Ticket :
                          <span>
                            <i className="fa fa-inr" aria-hidden="true"></i>
                            {contests[0]?.ticket_price}/-
                          </span>{" "}
                        </p>
                      </div>

                      <div className="contest_quantity_para_div">
                        <div className="addcart_contst_textinfo">
                          <img
                            src={`${process.env.PUBLIC_URL}/images/ball_icon.png`}
                          />
                          <h2>
                            Use Add and subtract button for increase and
                            decrease your tickets
                          </h2>
                        </div>
                        <div className="addcart_contst_textinfo">
                          <img
                            src={`${process.env.PUBLIC_URL}/images/ball_icon.png`}
                          />
                          <h2>Max 75 tickets per person</h2>
                        </div>
                      </div>

                      <div className="d-flex flex-wrap gap-16 align-items-center mt-3 ">
                        <a
                          onClick={handleAskToPaly}
                          className="btn btn-primary text-uppercase rounded-2"
                        >
                          buy Now
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="col-lg-6">
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
                </div> */}
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
                          {/* Play Button to Open Popup */}
                          <a
                            href="#"
                            className="play-btn circle b-round popup-youtube video-btn"
                            onClick={(e) => {
                              e.preventDefault(); // Prevent default link behavior
                              setOpen(true);
                            }}
                          >
                            <i className="fa-solid fa-play"></i>
                          </a>
                          <h2>How To Play</h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Material-UI Dialog (Popup) */}
                <Dialog
                  open={open}
                  onClose={() => setOpen(false)}
                  maxWidth="md"
                  fullWidth
                >
                  <DialogContent
                    style={{ position: "relative", padding: "16px" }}
                  >
                    {/* Close Button (X) */}
                    <IconButton
                      style={{ position: "absolute", right: "10", top: "10" }}
                      className="custom-close-btn"
                      onClick={() => setOpen(false)}
                    >
                      <CloseIcon />
                    </IconButton>

                    {/* Embedded YouTube Video */}
                    <div
                      style={{
                        position: "relative",
                        paddingBottom: "56.25%",
                        height: 0,
                      }}
                    >
                      <iframe
                        width="100%"
                        height="100%"
                        style={{ position: "absolute", top: 0, left: 0 }}
                        src={movies.video_url}
                        frameBorder="0"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div
        className={`cartpopup_main cartpopupfor_contest ${
          onCloseComptition ? "show" : ""
        }`}
        style={{ display: onCloseComptition ? "block" : "none" }}
      >
        <div className="addtocart_newpopup">
          <div className="addtocart_content_popup">
            <div className="contest_maindiv_popup_inner">
              <div className="contestheading text-center">
                <h2>
                  <i className="fa fa-gamepad" aria-hidden="true"></i> Game Play
                  Closed!
                </h2>
              </div>

              <div className="quantity_contest text-center mt-3">
                <h3 className="text-white">
                  The current gameplay has been closed.
                </h3>
                <h4 className="text-white">
                  But don't worry, a new competition launches this Monday at
                  12:00 HRS!
                </h4>
              </div>
              <div className="contest_quantity_para_div">
                <div className="addcart_contst_textinfo">
                  <i
                    className="fa fa-calendar"
                    style={{
                      background: "aliceblue",
                      color: "#000",
                      width: "30px",
                      height: "30px",
                      fontSize: "15px",
                      padding: "0px",
                      lineHeight: "30px",
                      textAlign: "center",
                      borderRadius: "50%",
                    }}
                  ></i>{" "}
                  <h2 className="text-white ">
                    Mark your calendars and get ready to join the fun!
                  </h2>
                </div>
                <div className="addcart_contst_textinfo">
                  <i
                    className="fa fa-television"
                    style={{
                      background: "aliceblue",
                      color: "#000",
                      width: "42px",
                      height: "30px",
                      fontSize: "15px",
                      padding: "0px",
                      lineHeight: "30px",
                      textAlign: "center",
                      borderRadius: "50%",
                    }}
                  ></i>
                  <h2 className="text-white">
                    Don’t forget to tune in to our live streaming every Monday
                    at 21:00 HRS to catch all the excitement.
                  </h2>
                </div>
              </div>
              <div className="everyweek_livewatchdiv text-center">
                <h4 className="text-white">Watch On Live Streams</h4>
                <div className="watchondiv justify-content-center">
                  {livs?.Facebook_Streaming && (
                    <a
                      href={livs.Facebook_Streaming}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={`${process.env.PUBLIC_URL}/image/face.png`}
                        alt="Facebook Live"
                      />
                    </a>
                  )}
                  {livs?.Youtube_Streaming && (
                    <a
                      href={livs.Youtube_Streaming}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={`${process.env.PUBLIC_URL}/image/you.png`}
                        alt="YouTube Live"
                      />
                    </a>
                  )}
                </div>
              </div>

              <div className="addtocart_btn_popup_div">
                <button className="addcartbtn_inpopup" onClick={ClosedCarts}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`cartpopup_main cartpopupfor_contest ${
          onCarts ? "show" : ""
        }`}
        style={{ display: onCarts ? "block" : "none" }}
      >
        <div className="addtocart_newpopup">
          <div className="addtocart_content_popup">
            <div className="contest_maindiv_popup_inner">
              <div className="contestheading">
                <h2>
                  Weekly ₹
                  {selectedContest?.jackpot_price
                    ? Number(selectedContest.jackpot_price).toLocaleString()
                    : "0"}{" "}
                  Grand Prize
                </h2>
              </div>
              <div className="contesttickeprice">
                <p>
                  Ticket Price:{" "}
                  <span>
                    <i className="fa fa-inr" aria-hidden="true" />{" "}
                    {selectedContest?.ticket_price}
                  </span>
                </p>
              </div>
              <div className="quantity_contest">
                <h4>Quantity</h4>
                <div className="quantity">
                  <button
                    className="minus"
                    onClick={handleDecrease}
                    aria-label="Decrease"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    className="quantity_input-box"
                    value={quantity}
                    readOnly
                  />
                  <button
                    className="plus"
                    onClick={handleIncrease}
                    aria-label="Increase"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="contest_quantity_para_div">
                <div className="addcart_contst_textinfo">
                  <img
                    src={`${process.env.PUBLIC_URL}/images/ball_icon.png`}
                    // src="images/ball_icon.png"
                    alt="Icon"
                  />
                  <h2>
                    Use Add and subtract buttons to increase or decrease your
                    tickets
                  </h2>
                </div>
                <div className="addcart_contst_textinfo">
                  <img
                    src={`${process.env.PUBLIC_URL}/images/ball_icon.png`}
                    // src="images/ball_icon.png"
                    alt="Icon"
                  />
                  <h2>Max {selectedContest?.maxTickets} tickets per person</h2>
                </div>
              </div>
              <div className="dis-pop">
                <h5>Discount</h5>

                <Slider {...settings}>
                  {Array.isArray(selectedDiscount) &&
                    selectedDiscount.map((discount) => (
                      <div key={discount._id} className="card first dis_card">
                        <div className="main">
                          <div className="co-img">
                            <img
                              src={`${process.env.PUBLIC_URL}/images/target.png`}
                              alt="Discount"
                            />
                          </div>
                          <div className="vertical" />
                          <div className="content">
                            <h2>
                              Tickets: {discount.minTickets} -{" "}
                              {discount.maxTickets}
                            </h2>
                            <h1>
                              {discount.discountPercentage}%{" "}
                              <span>Discount</span>
                            </h1>
                          </div>
                        </div>
                      </div>
                    ))}
                </Slider>
              </div>
              <div className="bulkticketdiv">
                <div className="buybulkticket_heaidng">
                  <h2 className="bulkticketheading">Buy Bulk Tickets</h2>
                </div>
                <div className="chooseforinputsdiv_bulkticket">
                  {(selectedContest?.quantities || []).map((value) => (
                    <div className="choosefor_input action" key={value}>
                      <label htmlFor={`choosefor-${value}`}>
                        <input
                          type="radio"
                          id={`choosefor-${value}`}
                          name="choosefor"
                          className="radio-custom"
                          onChange={() => handleBulkSelect(value)}
                          checked={quantity === value}
                        />
                        <span className="radio-custom-dummy" />
                        <span className="spanforcheck">{value} Tickets</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="addtocart_btn_popup_div">
                <button className="addcartbtn_inpopup" onClick={handlePlayNow}>
                  Play Now
                </button>
              </div>
            </div>
            <div className="contestcrossbtndiv">
              <button
                type="button"
                className="crossbtn_popupclose"
                onClick={ClosedCarts}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/image/cross_icon.png`}
                  // src="images/cross_icon.png"
                  alt="Close"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      {isGeolocationPopupVisible && (
        <GeolocationPopup
          onClose={() => setGeolocationPopupVisible(false)}
          Area={restrictedStates}
        />
      )}
      {isUnavailablePopupVisible && (
        <GameUnavailablePopup
          onOk={() => setIsUnavailablePopupVisible(false)}
        />
      )}
    </>
  );
}

export default Banner;
