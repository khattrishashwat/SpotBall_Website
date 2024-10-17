import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Login from "../Auth/Login";
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState("");
  const [contests, setContests] = useState("");
  const [selectedContest, setSelectedContest] = useState("");
  const [isModals, setIsModals] = useState("");
  const [onCarts, setOnCarts] = useState("");
  const videoRef = useRef(null);
  const [isLoginPopup, setLoginPopup] = useState(false);
  const [banner, setBanner] = useState(false);
  const [quantity, setQuantity] = useState(3);

  const open = async () => {
    setIsModals(true);
  };
  const handleBuyTicketClick = (contest) => {
    setSelectedContest(contest);
    setOnCarts(true);
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
      videoElement.currentTime = 0; // Reset video time on close
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

      if (response.data.data) {
        console.log("Fetched video data:", response.data.data);
        setMovies(response.data.data);
      } else {
        console.error("No video data found.");
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

  // Function to get the next Sunday at 11:59 PM
  const getNextSunday = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilNextSunday = (7 - dayOfWeek) % 7; // Calculate how many days until next Sunday
    const nextSunday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + daysUntilNextSunday
    );
    nextSunday.setHours(23, 59, 59, 999); // Set time to 11:59 PM
    return nextSunday.getTime();
  };

  useEffect(() => {
    // Set the initial countdown date to the next Sunday
    let countDownDate = getNextSunday();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      if (distance < 0) {
        // If countdown is over, reset for the next week
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

    // Update the countdown every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    setLoading(true); // Set loading to true before fetching
    try {
      const response = await axios.get(
        token ? "get-all-contests" : "get-banner",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (token) {
        const { banner_details, contests } = response.data.data;
        setBanner(banner_details[0]);
        setContests(contests);
      } else {
        setBanner(response.data.data[0]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching or on error
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleIncrease = () => {
    if (quantity < selectedContest?.ticket_limit) {
      setQuantity((prev) => prev + 1);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Max Ticket Limit Reached",
        text: `You can only purchase a maximum of ${selectedContest?.ticket_limit} tickets per person.`,
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

  return (
    <>
      {loading ? (
        <Loader /> // Show loader
      ) : (
        <>
          <section className="bannersection">
            <div className="container-fluid contfld_mainvideobanner">
              <div className="mainbannervideodiv">
                <div className="banner_video">
                  <img src={banner.banner_url} alt="Banner" />
                </div>
                <div className="autoscroll_section">
                  <div className="marquee">
                    <div className="track">
                      <div className="srcolltext_div">
                        {/* Your existing scrolling text and stars */}
                        {/* ... */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="banner_fixedtext_div_top">
                  <div className="everyweekfixedtext">
                    <h4>{banner.sub_title}</h4>
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
                    {/* Countdown timer */}
                    {/* ... */}
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
                            />
                          </div>
                        </div>
                        <div className="compitionsbox">
                          <div className="compitiontextinfodivmain">
                            <div className="contestpoints_main">
                              {/* Contest details */}
                              {/* ... */}
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
                    <img src="images/cross_icon.png" alt="Close" />
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
                            poster={videoData.thumbnail_url}
                            style={{ width: "100%", height: "auto" }}
                          >
                            <source
                              src={videoData.video_url}
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
                        <p>Loading video...</p>
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
                  <img src="images/ball_icon.png" alt="Icon" />
                  <h2>
                    Use Add and subtract buttons to increase or decrease your
                    tickets
                  </h2>
                </div>
                <div className="addcart_contst_textinfo">
                  <img src="images/ball_icon.png" alt="Icon" />
                  <h2>
                    Max {selectedContest?.ticket_limit} tickets per person
                  </h2>
                </div>
              </div>
              <div className="bulkticketdiv">
                <div className="buybulkticket_heaidng">
                  <h2 className="bulkticketheading">Buy Bulk Tickets</h2>
                </div>
                <div className="chooseforinputsdiv_bulkticket">
                  {[3, 5, 7, 10].map((value) => (
                    <div className="choosefor_input action" key={value}>
                      <label>
                        <input
                          type="radio"
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
                <img src="images/cross_icon.png" alt="Close" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
