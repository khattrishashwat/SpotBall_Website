import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Login from "../Auth/Login";
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";
import GeolocationPopup from "../Location/GeolocationPopup";
import PalyVedio from "../Pages/HowToPlay/PalyVedio";

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [corousal, setCorousal] = useState([]);
  const [movies, setMovies] = useState("");
  const [contests, setContests] = useState("");
  const [selectedContest, setSelectedContest] = useState("");
  const [isModals, setIsModals] = useState("");
  const [onCarts, setOnCarts] = useState("");
  const [links, setLinks] = useState("");
  const videoRef = useRef(null);
  const [isLoginPopup, setLoginPopup] = useState(false);
  const [banner, setBanner] = useState(false);
  const [quantity, setQuantity] = useState(3);
  const [isGeolocationPopupVisible, setGeolocationPopupVisible] =
    useState(false);

  const open = async () => {
    setIsModals(true);
  };
  // const handleBuyTicketClick = (contest) => {
  //   setSelectedContest(contest);
  //   setOnCarts(true);
  // };
  const handleBuyTicketClick = (contest) => {
    if (!contest.allowance) {
      Swal.fire({
        icon: "warning",
        title: "Participation Alert",
        text: "You have already participated in this contest!",
      });
    } else {
      setSelectedContest(contest);
      setOnCarts(true);
    }
  };

  const ClosedCarts = async () => {
    setOnCarts(false);
  };

  const token = localStorage.getItem("token");

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
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("get-how-to-play", {
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

  const playVideo = () => {
    const videoElement = document.getElementById("video_howtoplay");
    if (videoElement) {
      videoElement.play();
    }
  };

  const videoData = movies.length > 0 ? movies[0] : null;

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const getNextSunday = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilNextSunday = (7 - dayOfWeek) % 7;
    const nextSunday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + daysUntilNextSunday
    );
    nextSunday.setHours(23, 59, 59, 999);
    return nextSunday.getTime();
  };

  useEffect(() => {
    let countDownDate = getNextSunday();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      if (distance < 0) {
        countDownDate = getNextSunday();
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        const response = await axios.get("get-all-contests", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { banner_details, contests, livelinks } = response.data.data;
        setLinks(livelinks);
        setBanner(banner_details[0]);
        setContests(contests);
        setCorousal(banner_details[0]?.corousal);
      } else {
        const response = await axios.get("get-banner");

        setBanner(response.data.data[0]);
        setCorousal(response.data.data[0]?.corousal || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleIncrease = () => {
    if (quantity < selectedContest?.maxTickets) {
      setQuantity((prev) => prev + 1);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Max Ticket Limit Reached",
        text: `You can only purchase a maximum of ${selectedContest?.maxTickets} tickets per person.`,
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
    setQuantity(value);
  };

  const handlePlayNow = () => {
    const payload = {
      quantity: quantity,
      responseData: selectedContest,
    };

    navigate("/play_screen", { state: { payload } });
  };

  useEffect(() => {
    const location = JSON.parse(localStorage.getItem("location"));

    if (token && location && Object.keys(location).length > 0) {
      setGeolocationPopupVisible(false);
    } else if (token) {
      setGeolocationPopupVisible(true);
    } else if (location && Object.keys(location).length > 0) {
      setGeolocationPopupVisible(false);
    } else {
      setGeolocationPopupVisible(true);
    }
  }, [token]);

  const handleCloseGeolocationPopup = () => {
    setGeolocationPopupVisible(false);
  };

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
                  <img
                    // src={`${process.env.PUBLIC_URL}/images/cricket_contest.jpg`}
                    src={banner.banner_url}

                    // alt="Banner"
                  />
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

                    <h4>
                      {/* Can you pinpoint the hidden cricket ball? */}
                      {banner.title}
                    </h4>
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
                        play
                      </button>
                      {!token && (
                        <button
                          type="button"
                          className="bannerfixedbtn regis showsigninpopup_onclick"
                          onClick={OpenSignIn}
                        >
                          Sign Up/Sign In
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="entriesdate_withcountdown">
                    <div className="countdowndate_newshi">
                      <div className="countheading_endsin">
                        <h2>Ends in</h2>
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
          {token && contests && (
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
                              src={contests[0].contest_banner?.file_url}
                              alt="Contest Banner"
                              width="750" // Intrinsic width
                              height="500" // Intrinsic height
                              style={{
                                width: "459px",
                                height: "306px",
                                // objectFit: "cover",
                              }}
                            />
                            {/* <img
                              src={`${process.env.PUBLIC_URL}/images/cricket_contest.jpg`}
                            /> */}
                          </div>
                        </div>
                        <div className="compitionsbox">
                          <div className="compitiontextinfodivmain">
                            <div className="contestpoints_main">
                              <div className="contesteveryweekdiv">
                                <div className="contest_newtiming_strip">
                                  <img
                                    src={`${process.env.PUBLIC_URL}/images/ball_icon.png`}
                                    // src="images/ball_icon.png"
                                    alt="Ball Icon"
                                  />
                                  <h4>Every Week’s Contest Ends</h4>
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
                                    // src="images/ball_icon.png"
                                    alt="Ball Icon"
                                  />
                                  <h4>
                                    Every Week We Live Stream SpotsBall’s
                                    “Weekly Winner Show”
                                  </h4>
                                </div>
                                <div className="contestrightdaysdate">
                                  <h4 className="contslist_span_inner">
                                    Monday- 00:00hrs
                                  </h4>
                                </div>
                              </div>
                            </div>
                            <div className="everyweek_livewatchdiv">
                              <div className="watchondiv">
                                <h4>Watch On</h4>
                                {links?.facebookUrl && (
                                  <a
                                    href={links.facebookUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <img
                                      src={`${process.env.PUBLIC_URL}/images/fb_live_icon.png`}
                                      alt="Facebook Live"
                                    />
                                  </a>
                                )}
                                {links?.youtubeUrl && (
                                  <a
                                    href={links.youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <img
                                      src={`${process.env.PUBLIC_URL}/images/yb_live_icon.png`}
                                      alt="YouTube Live"
                                    />
                                  </a>
                                )}
                              </div>
                            </div>
                            <div className="jackpotpricewithpayment">
                              <div className="gamejackpotdiv">
                                <h4>
                                  Game Jackpot: ₹{contests[0].jackpot_price}
                                </h4>
                              </div>
                              <div className="gamejackpotdiv">
                                <h4>
                                  Ticket Price: ₹{contests[0].ticket_price}
                                </h4>
                              </div>
                            </div>
                            <div className="buyticketsbtndiv">
                              <div className="addtocardbtnicon">
                                <button
                                  type="button"
                                  className="buyticketbtn onclickcarticon_showcartpopup"
                                  onClick={() =>
                                    handleBuyTicketClick(contests[0])
                                  }
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
          )}
        </>
      )}
      <Login isVisible={isLoginPopup} onClose={ClosePopup} />
      {isGeolocationPopupVisible && (
        <GeolocationPopup
          onClose={handleCloseGeolocationPopup}
          contests={selectedContest}
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
          onCarts ? "show" : ""
        }`}
        style={{ display: onCarts ? "block" : "none" }}
      >
        <div className="addtocart_newpopup">
          <div className="addtocart_content_popup">
            <div className="contest_maindiv_popup_inner">
              <div className="contestheading">
                <h2>Weekly ₹{selectedContest?.jackpot_price} Jackpot Prize</h2>
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
                          id={`choosefor-${value}`} // Unique ID for each radio button
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
