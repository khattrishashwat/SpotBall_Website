import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Login from "../Auth/Login";
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";
import GeolocationPopup from "../Location/GeolocationPopup";
import GameUnavailablePopup from "../Location/GameUnavailablePopup";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

function Home() {
  const navigate = useNavigate();
  const spacing = 2;
  const [countdownType, setCountdownType] = useState("ends"); // "starts" or "ends"

  const [loading, setLoading] = useState(false);
  const [leftticket, setLeftticket] = useState("");
  const [corousal, setCorousal] = useState([]);
  const [movies, setMovies] = useState("");
  const [contests, setContests] = useState("");
  const [discounts, setDiscounts] = useState("");
  const [selectedContest, setSelectedContest] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState("");
  const [isModals, setIsModals] = useState("");
  const [onCarts, setOnCarts] = useState("");
  const [onCloseComptition, setOnCloseComptition] = useState("");
  const [links, setLinks] = useState("");
  const [countss, setCountss] = useState("");
  const [restrictedStates, setRestrictedStates] = useState("");
  const videoRef = useRef(null);
  const [loginPopup, setLoginPopup] = useState(false);
  const [banner, setBanner] = useState(false);
  const [quantity, setQuantity] = useState(3);
  const [isGeolocationPopupVisible, setGeolocationPopupVisible] =
    useState(false);
  const [isUnavailablePopupVisible, setIsUnavailablePopupVisible] =
    useState(false);

  // const location = useLocation();

  const open = async () => {
    setIsModals(true);
  };

  useEffect(() => {
    const fetchLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            // console.log("Latitude:", latitude, "Longitude:", longitude);

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

              // console.log(
              //   "State Name:",
              //   stateName,
              //   "Country Name:",
              //   countryName
              // );

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
    // fetchLocation();
  }, [restrictedStates]);

  // const handleBuyTicketClick = (contest, discount) => {
  //   setSelectedContest(contest);
  //   SetOnCloseComptition(true);
  //   setOnCarts(true);
  //   setSelectedDiscount(discount);
  // };
  const handleBuyTicketClick = (contest, discount) => {
    const token = localStorage.getItem("Web-token"); // Replace with your token retrieval method

    if (!token) {
      Swal.fire({
        icon: "info",
        title: "Login Required",
        text: "Please login to participate in this contest!",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
      return;
    }

    // if (!contest.allowance) {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Participation Alert",
    //     text: "You have already participated in this contest!",
    //     confirmButtonText: "OK",
    //     allowOutsideClick: false,
    //   });
    //   return;
    // }

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


    if (!contest.is_active) {
      setOnCarts(false);
      setOnCloseComptition(true);
      return;
    }

    // If contest is active, proceed with normal flow
    setSelectedContest(contest);
    setOnCarts(true);
    setSelectedDiscount(discount);
  };
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
      });
      return; // Stop execution if no token
    }

    if (restrictedArea) {
      setGeolocationPopupVisible(false);
      setIsUnavailablePopupVisible(true);
      return;
    }

    if (location) {
      handleBuyTicketClick(contests[0], discounts);
    } else {
      console.log("Location not found in localStorage");
    }
  };

  {
    /*--------------
    
    const MAX_TICKETS = 75;

const handleBuyTicketClick = (contest, discount) => {
  const token = localStorage.getItem("Web-token");

  if (!token) {
    Swal.fire({
      icon: "info",
      title: "Login Required",
      text: "Please login to participate in this contest!",
      confirmButtonText: "OK",
      allowOutsideClick: false,
    });
    return;
  }

  if (!contest.allowance) {
    Swal.fire({
      icon: "warning",
      title: "Participation Alert",
      text: "You have already participated in this contest!",
      confirmButtonText: "OK",
      allowOutsideClick: false,
    });
    return;
  }

  if (!contest.is_active) {
    setOnCarts(false);
    setOnCloseComptition(true);
    return;
  }

  // Ensure tickets chosen do not exceed 75
  let availableTickets = contest.chooseticket || 0; // Ensure it has a valid number
  if (availableTickets > MAX_TICKETS) {
    Swal.fire({
      icon: "warning",
      title: "Ticket Limit Exceeded",
      text: `You can only choose up to ${MAX_TICKETS} tickets.`,
      confirmButtonText: "OK",
      allowOutsideClick: false,
    });
    return;
  }

  // Subtract selected tickets from max allowed tickets
  let remainingTickets = MAX_TICKETS - availableTickets;

  if (remainingTickets >= 0) {
    setSelectedContest(contest);
    setOnCarts(true);
    setSelectedDiscount(discount);

    console.log(`You have chosen ${availableTickets} tickets.`);
    console.log(`Remaining tickets you can choose: ${remainingTickets}`);
  } else {
    Swal.fire({
      icon: "error",
      title: "Invalid Ticket Selection",
      text: `You cannot choose more than ${MAX_TICKETS} tickets.`,
      confirmButtonText: "OK",
      allowOutsideClick: false,
    });
  }
};

const handleAskToPlay = () => {
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
    });
    return;
  }

  if (restrictedArea) {
    setGeolocationPopupVisible(false);
    setIsUnavailablePopupVisible(true);
    return;
  }

  if (location) {
    handleBuyTicketClick(contests[0], discounts);
  } else {
    console.log("Location not found in localStorage");
  }
};

    -------------*/
  }
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    CenterPadding: 10,
  };
  const ClosedCarts = async () => {
    setOnCarts(false);
    setOnCloseComptition(false);
    setQuantity(3);
  };

  const token = localStorage.getItem("Web-token");

  const close = () => {
    setIsModals(false);
    const videoElement = document.getElementById("video_howtoplay");
    if (videoElement) {
      videoElement.pause();
      videoElement.currentTime = 0;
    }
  };

  const OpenSignIn = () => {
    setLoginPopup(true);
  };

  const ClosePopup = () => {
    setLoginPopup(false);
  };

  const fetchVideoData = async () => {
    const token = localStorage.getItem("Web-token");
    try {
      const response = await axios.get("app/how-to-play/get-how-to-play", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response) {
        setMovies(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching video data:", error);
    }
  };

  useEffect(() => {
    fetchVideoData();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const playVideo = () => {
    const videoElement = document.getElementById("video_howtoplay");
    if (videoElement) {
      videoElement.play();
    }
  };

  const videoData = movies.length > 0 ? movies[0] : null;

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
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("Web-token");

      if (token) {
        const response = await axios.get("app/contest/get-all-contests", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log("get-all-contest", response.data.data);
        const {
          banner_details,
          unreadCount,
          contests,
          discounts,
          restrictedStates,
          livelinks,
        } = response.data.data;
        setLinks(livelinks);
        setBanner(banner_details[0]);
        setContests(contests);
        setDiscounts(discounts);
        setCorousal(banner_details[0]?.corousal);
        setCountss(unreadCount);
        setRestrictedStates(restrictedStates);
      } else {
        const response = await axios.get("app/banner/get-banner");

        // console.log("get", response.data.data);
        const { bannerDetails, contests, liveLinks, restrictedStates } =
          response.data.data;
        setLinks(liveLinks);

        setRestrictedStates(restrictedStates);
        setBanner(bannerDetails[0]);
        setContests(contests);
        setCorousal(bannerDetails[0].corousal || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // const fetchData = async () => {
  //   try {
  //     const token = localStorage.getItem("Web-token");
  //     const now = new Date();
  //     const day = now.getDay(); // 0 = Sunday, 1 = Monday, ...
  //     const hours = now.getHours();

  //     // Sunday 23:59 se Monday 12:00 PM tak contests empty rakhna
  //     const shouldBeEmpty =
  //       (day === 0 && hours === 23) || (day === 1 && hours < 12);

  //     if (token) {
  //       const response = await axios.get("app/contest/get-all-contests", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //       const {
  //         banner_details,
  //         unreadCount,
  //         contests,
  //         discounts,
  //         restrictedStates,
  //         livelinks,
  //       } = response.data.data;

  //       setLinks(livelinks);
  //       setBanner(banner_details[0]);
  //       setDiscounts(discounts);
  //       setCorousal(banner_details[0]?.corousal);
  //       setCountss(unreadCount);
  //       setRestrictedStates(restrictedStates);

  //       // Agar shouldBeEmpty true hai to contests empty set karein
  //       setContests(shouldBeEmpty ? [] : contests);
  //     } else {
  //       const response = await axios.get("app/banner/get-banner");
  //       const { bannerDetails, contests, liveLinks, restrictedStates } =
  //         response.data.data;

  //       setLinks(liveLinks);
  //       setRestrictedStates(restrictedStates);
  //       setBanner(bannerDetails[0]);
  //       setCorousal(bannerDetails[0]?.corousal || []);

  //       // Agar shouldBeEmpty true hai to contests empty set karein
  //       setContests(shouldBeEmpty ? [] : contests);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, [token]);

  // console.log("setRestrictedStates", restrictedStates);
  // console.log("contest -->", contests);

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

  // const handlePlayNow = () => {

  //   const payload = {
  //     leftticket: leftticket,
  //     quantity: quantity,
  //     responseData: selectedContest,
  //   };

  //   navigate("/play_screen", { state: { payload } });
  // };
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

    navigate("/play_screen", { state: { payload } });
  };

  useEffect(() => {
    const checkGeolocation = () => {
      const location = JSON.parse(localStorage.getItem("location"));
      const restrictedArea = JSON.parse(localStorage.getItem("restrictedArea"));

      if (token) {
        if (
          (location && Object.keys(location).length > 0) ||
          (restrictedArea && Object.keys(restrictedArea).length > 0)
        ) {
          setGeolocationPopupVisible(false);
        } else {
          setGeolocationPopupVisible(true);
        }
      } else {
        if (
          !location ||
          Object.keys(location).length === 0 ||
          !restrictedArea ||
          Object.keys(restrictedArea).length === 0
        ) {
          setGeolocationPopupVisible(false);
        } else {
          setGeolocationPopupVisible(true);
        }
      }
    };

    checkGeolocation();

    // Add event listener for storage changes
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

  const handleUnavailableOk = () => {
    setIsUnavailablePopupVisible(false); // Close GameUnavailablePopup
  };
  const handleCloseGeolocationPopup = () => {
    setGeolocationPopupVisible(false);
  };

  // console.log("live",links);

  useEffect(() => {
    if (isModals || onCarts) {
      document.body.style.overflow = "hidden"; // Disable background scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable background scrolling
    }

    // Cleanup on component unmount or modal close
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModals, onCarts]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <section className="bannersection">
            <div className="container-fluid contfld_mainvideobanner">
              <div className="mainbannervideodiv">
                <div className="banner_video">
                  <img src={banner.banner_url} />
                </div>
                <div className="autoscroll_section">
                  <div className="marquee">
                    <div className="track">
                      <div className="srcolltext_div">
                        {corousal.map((text, index) => (
                          <React.Fragment key={index}>
                            <div
                              className={
                                text.includes("JACKPOT")
                                  ? "jackpottext"
                                  : "guranteewinnertext"
                              }
                            >
                              {text}
                            </div>
                            <div className="auto_scroll_staricon_cntr">
                              <img
                                src={`${process.env.PUBLIC_URL}/images/star.png`}
                                // src="images/star.png"
                                alt="star icon"
                              />
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="banner_fixedtext_div_top">
                  <div className="everyweekfixedtext">
                    <h4>
                      {(banner.sub_title || "")
                        .split(/(₹\d{1,3}(?:,\d{3})*)/)
                        .map((part, index) =>
                          part.match(/₹\d{1,3}(?:,\d{3})*/) ? (
                            <span key={index}>{part}</span>
                          ) : (
                            part
                          )
                        )}
                    </h4>
                    <h4>{banner.title}</h4>
                  </div>
                </div>
                <div className="bottomfixedonbannertext_banner">
                  <div className="registerplay_btndiv">
                    <div className="play_regis_btn">
                      <button
                        type="button"
                        className="bannerfixedbtn howtoplay"
                        id="howtoplay_showonclick"
                        onClick={open}
                      >
                        <i className="fa fa-play" aria-hidden="true" /> How to
                        Play
                      </button>
                      {!token && (
                        <button
                          type="button"
                          className="bannerfixedbtn regis showsigninpopup_onclick"
                          // onClick={OpenSignIn}
                          onClick={() => setLoginPopup(!loginPopup)}
                        >
                          Sign in / Sign up
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="entriesdate_withcountdown">
                    <div className="countdowndate_newshi">
                      <div className="countheading_endsin">
                        <h2>
                          {countdownType === "starts"
                            ? "This Week's Game Starts In"
                            : "This Week's Game Ends In"}
                        </h2>
                      </div>
                      <div id="countdown" className="countdown">
                        <div className="countdown-number">
                          <span className="days countdown-time">
                            {timeLeft.days}
                          </span>
                          <span className="countdown-text">Days</span>
                        </div>
                        <div className="countdown_doubledots">:</div>
                        <div className="countdown-number">
                          <span className="hours countdown-time">
                            {timeLeft.hours}
                          </span>
                          <span className="countdown-text">Hours</span>
                        </div>
                        <div className="countdown_doubledots">:</div>
                        <div className="countdown-number">
                          <span className="minutes countdown-time">
                            {timeLeft.minutes}
                          </span>
                          <span className="countdown-text">Minutes</span>
                        </div>
                        <div className="countdown_doubledots">:</div>
                        <div className="countdown-number">
                          <span className="seconds countdown-time">
                            {timeLeft.seconds}
                          </span>
                          <span className="countdown-text">Seconds</span>
                        </div>
                      </div>
                    </div>
                    <div className="saprationdiv" />
                    <div className="entriesdate_div">
                      <div className="entries_openclosediv">
                        <div className="entriesdiv_inner opendiv_entries">
                          <h3>Entries Open:</h3>
                          <p>Monday</p>
                          <p>12:00 hrs</p>
                        </div>
                        <div className="entriesdiv_inner closediv_entries">
                          <h3>Entries Close:</h3>
                          <p>Sunday</p>
                          <p>23:59 hrs</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {contests && contests.length > 0 ? (
            <section className="compitionsection" id="compitions_div">
              <div className="container contcompitions">
                <div className="col-md-12 col12maincompitions">
                  <div className="row rowcompititionsmaindiv">
                    <div className="upcomingame_div_fortext">
                      <h2>
                        Current <span>contest</span>
                      </h2>
                    </div>
                    <div className="col-md-12 col3compitions">
                      <div className="pricecompitionmaindiv">
                        <div className="compitionleftside_new">
                          <div className="compititonmgdivnew">
                            <img
                              src={contests[0]?.contest_banner?.file_url}
                              alt="Contest Banner"
                              className="play-img"
                            />
                            <p className="hidball">
                              Mark the hidden ball in the picture!
                            </p>
                          </div>
                        </div>
                        <div className="compitionsbox">
                          <div className="compitiontextinfodivmain">
                            <div className="contestpoints_main">
                              <div className="contesteveryweekdiv">
                                <div className="contest_newtiming_strip">
                                  <img
                                    src={`${process.env.PUBLIC_URL}/images/ball_icon.png`}
                                    alt="Ball Icon"
                                  />
                                  <h4> Weekly contest ends </h4>
                                </div>
                                <div className="contestrightdaysdate">
                                  <h4 className="contslist_span_inner">
                                    Sunday- 23:59hrs
                                  </h4>
                                </div>
                              </div>
                              <div className="contesteveryweekdiv">
                                <div className="contest_newtiming_strip">
                                  <img
                                    src={`${process.env.PUBLIC_URL}/images/ball_icon.png`}
                                    alt="Ball Icon"
                                  />
                                  <h4>
                                    {" "}
                                    Live streaming of “Weekly Winner Show”{" "}
                                  </h4>
                                </div>
                                <div className="contestrightdaysdate">
                                  <h4 className="contslist_span_inner">
                                    Monday- 21:00hrs
                                  </h4>
                                </div>
                              </div>
                            </div>
                            <div className="everyweek_livewatchdiv">
                              <div className="watchondiv">
                                <h4>Watch On</h4>
                                {links?.Facebook_Streaming && (
                                  <a
                                    href={links.Facebook_Streaming}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <img
                                      src={`${process.env.PUBLIC_URL}/images/face.png`}
                                      alt="Facebook Live"
                                    />
                                  </a>
                                )}
                                {links?.Youtube_Streaming && (
                                  <a
                                    href={links.Youtube_Streaming}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <img
                                      src={`${process.env.PUBLIC_URL}/images/you.png`}
                                      alt="YouTube Live"
                                    />
                                  </a>
                                )}
                              </div>
                            </div>
                            <div className="jackpotpricewithpayment">
                              <div className="gamejackpotdiv">
                                <h4>
                                  Game Jackpot: ₹
                                  {contests[0]?.jackpot_price.toLocaleString()}
                                </h4>
                                {/* <h4>
                                  Game Jackpot: ₹
                                  {contests?.jackpot_price !== undefined &&
                                  contests?.jackpot_price !== null
                                    ? Number(
                                        contests.jackpot_price
                                      ).toLocaleString()
                                    : "0"}
                                </h4> */}
                              </div>
                              <div className="gamejackpotdiv">
                                <h4>
                                  Ticket Price: ₹{contests[0]?.ticket_price}
                                </h4>
                              </div>
                            </div>
                            <div className="buyticketsbtndiv">
                              <div className="addtocardbtnicon">
                                <button
                                  type="button"
                                  className="buyticketbtn onclickcarticon_showcartpopup"
                                  // onClick={() =>
                                  //   handleBuyTicketClick(contests[0], discounts)
                                  // }
                                  onClick={handleAskToPaly}
                                >
                                  Buy Tickets to Play
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="no-contest-section">
              {/* <div className="container text-center">
                <h2>No Current Contest Available</h2>
                <p>
                  Stay tuned for upcoming contests and exciting opportunities!
                </p>
              </div> */}
            </section>
          )}
          {isUnavailablePopupVisible && (
            <GameUnavailablePopup onOk={handleUnavailableOk} />
          )}
        </>
      )}
      <Login isVisible={loginPopup} onClose={ClosePopup} />
      {isGeolocationPopupVisible && (
        <GeolocationPopup
          onClose={handleCloseGeolocationPopup}
          Area={restrictedStates}
        />
      )}

      <div
        className={`howtoplay_popup_new ${isModals ? "show" : ""}`}
        id="howtoplaypopup_new"
        style={{ display: isModals ? "block" : "none" }}
      >
        <div className="howtoplay_innerdiv">
          <div className="conthowtoplay_videocont">
            <div className="rowhowtoplay">
              <div className="colhowtoplaydiv">
                <div className="howtoplaydiv_video">
                  <button
                    type="button"
                    className="howtoplay_crossicon"
                    id="crossbtn_popuphowtoplay"
                    onClick={close}
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/images/cross_icon.png`}
                      alt="Close"
                    />
                  </button>
                  <div className="howtoplay_textdiv">
                    <h2>{movies ? movies.title : "How to Play?"}</h2>
                  </div>
                  <div className="video-wrapper">
                    <div className="video-container" id="video-container">
                      {videoData ? (
                        <>
                          <video
                            controls
                            id="video_howtoplay"
                            preload="metadata"
                            poster={videoData.thumbnail_url} // Set the thumbnail
                            style={{ width: "100%", height: "auto" }} // Optional: responsive styles
                          >
                            <source
                              src={videoData.video_url} // Use the video URL from the fetched data
                              type="video/mp4"
                            />
                            Your browser does not support the video tag.
                          </video>
                          <div className="play-button-wrapper">
                            <div
                              title="Play video"
                              className="play-gif"
                              id="circle-play-b"
                              onClick={() => {
                                playVideo();
                              }}
                              style={{ cursor: "pointer" }} // Add cursor pointer for better UX
                            ></div>
                          </div>
                        </>
                      ) : (
                        <p>Loading video...</p> // Display loading message if no video data is available
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
              {/* <div className="contesttickeprice">
                <p>
                  Ticket:{" "}
                  <span>
                    <i className="fa fa-inr" aria-hidden="true" />{" "}
                    {selectedContest?.ticket_price}
                  </span>
                </p>
              </div> */}
              <div className="quantity_contest text-center mt-3">
                <h3 className="text-white">
                  The current gameplay has been closed.
                </h3>
                <h4 className="text-white">
                  But don't worry, a new competition launches this Monday at
                  12:00 HRS!
                </h4>
                {/* <div className="quantity">
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
                </div> */}
              </div>
              <div className="contest_quantity_para_div">
                <div className="addcart_contst_textinfo">
                  {/* <img
                    src={`${process.env.PUBLIC_URL}/images/ball_icon.png`}
                    src="images/ball_icon.png"
                    alt="Icon"
                  /> */}
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
                      // marginRight: spacing + "em",
                    }}
                  ></i>{" "}
                  <h2 className="text-white ">
                    Mark your calendars and get ready to join the fun!
                  </h2>
                </div>
                <div className="addcart_contst_textinfo">
                  {/* <img
                    src={`${process.env.PUBLIC_URL}/images/ball_icon.png`}
                    src="images/ball_icon.png"
                    alt="Icon"
                  /> */}

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
                      // marginRight: spacing + "em",
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
                  {links?.Facebook_Streaming && (
                    <a
                      href={links.Facebook_Streaming}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={`${process.env.PUBLIC_URL}/images/face.png`}
                        alt="Facebook Live"
                      />
                    </a>
                  )}
                  {links?.Youtube_Streaming && (
                    <a
                      href={links.Youtube_Streaming}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={`${process.env.PUBLIC_URL}/images/you.png`}
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
            {/* <div className="contestcrossbtndiv">
              <button
                type="button"
                className="crossbtn_popupclose"
                onClick={ClosedCarts}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/images/cross_icon.png`}
                  alt="Close"
                />
              </button>
            </div> */}
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
                  Jackpot Prize
                </h2>
              </div>
              <div className="contesttickeprice">
                <p>
                  Ticket:{" "}
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
              <div className="discount_cousal">
                <h5>Discount</h5>
                <Slider {...settings}>
                  {Array.isArray(selectedDiscount) &&
                    selectedDiscount.map((discount) => (
                      <div key={discount._id} className="discount_card">
                        <img
                          src={`${process.env.PUBLIC_URL}/images/discount_img.png`}
                        />
                        {/* <h6>{discount.name}</h6> */}
                        <p>
                          Tickets: {discount.minTickets} - {discount.maxTickets}
                        </p>
                        <p>Discount: {discount.discountPercentage}%</p>
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
                  src={`${process.env.PUBLIC_URL}/images/cross_icon.png`}
                  // src="images/cross_icon.png"
                  alt="Close"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
