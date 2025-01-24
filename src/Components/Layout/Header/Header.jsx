import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Login from "../../Auth/Login";
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [headerClass, setHeaderClass] = useState("");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [notification, setNotification] = useState("");
  const [profile, setProfile] = useState({});

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isLogout, setIsLogout] = useState("");
  const [loginPopup, setLoginPopup] = useState(false);
  const [isNot, setIsNot] = useState(false);
  const [notice, setNotice] = useState(false);

  useEffect(() => {
    if (location.pathname === "/") {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);
  const token = localStorage.getItem("Web-token");

  const NotificationOpen = () => {
    setIsNot((prevState) => !prevState);
  };

  const NotificationClose = () => {
    setIsNot(false);
  };

  const OpenSignIn = () => {
    setLoginPopup(true);
  };

  const ClosePopup = () => {
    setLoginPopup(false);
  };
  const toggleMenu = () => {
    setIsMenuVisible((prevState) => !prevState); // Toggle the state
  };
  const OpenLogout = () => {
    setIsLogout(true);
  };
  const CloseLogout = () => {
    setIsLogout(false);
  };

  // const handleClickOutside = (event) => {
  //   if (menuRef.current && !menuRef.current.contains(event.target)) {
  //     setIsMenuVisible(false);
  //   }
  // };
  // useEffect(() => {
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  const handleClickOutside = (event) => {
    // Menu elements
    const menuButton = document.querySelector(".menubaricons");
    const menuList = document.querySelector(".menulist_divmanin");

    // Notification elements
    const notificationButton = document.querySelector(
      ".notificationclick .itmelink_menus"
    );
    const notificationList = document.querySelector(".notificationdiv_popup");

    // Close menu if clicked outside
    if (
      menuButton &&
      menuList &&
      !menuButton.contains(event.target) &&
      !menuList.contains(event.target)
    ) {
      setIsMenuVisible(false); // Hide the menu
    }

    // Close notification dropdown if clicked outside
    if (
      notificationButton &&
      notificationList &&
      !notificationButton.contains(event.target) &&
      !notificationList.contains(event.target)
    ) {
      setIsNot(false); // Hide the notifications
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const isHomePage = location.pathname === "/";
  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
      setHeaderClass(
        isHomePage ? "headerfixed" : "innerheader_new headerfixed"
      );
    } else {
      setHeaderClass(isHomePage ? "" : "innerheader_new");
    }

    setLastScrollY(currentScrollY);

    setIsNot(false);
    setIsMenuVisible(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY, isHomePage]);

  const handleLogout = () => {
    setIsLogout(false);

    localStorage.removeItem("Web-token");
    Swal.fire({
      icon: "success",
      title: "Logout Successful",
      text: "You have been logged out successfully.",

      allowOutsideClick: false,
      timer: 2000,
      showConfirmButton: false,
    });
    navigate("/");
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("Web-token");
      if (!token) return;
      const response = await axios.get("app/profile/get-profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(response.data.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);
  const fetchNotification = async () => {
    try {
      const token = localStorage.getItem("Web-token");
      if (!token) return;
      const response = await axios.get("app/notifications/get-notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotification(response.data.data);
      // setNotice(response.data.data.length);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchNotification();
  }, []);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompetitionStart: true, // Flag to track whether it's competition start or end
  });

  useEffect(() => {
    const checkAndReloadAtNoon = () => {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // Check if it's Monday at 12:00 PM
      if (dayOfWeek === 1 && hours === 12 && minutes === 0) {
        // Reload the page at 12:00 PM on Monday
        window.location.reload();
      }
    };

    // Set interval to check every minute (60000 ms)
    const interval = setInterval(checkAndReloadAtNoon, 60000);

    return () => clearInterval(interval); // Clear interval when component unmounts
  }, []);


  const getNextMonday05AM = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilNextMonday = (7 - dayOfWeek + 1) % 7; // Next Monday
    const nextMonday05AM = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + daysUntilNextMonday,
      0, // 00:05 AM
      5, // 5 minutes
      0, // seconds
      0 // milliseconds
    );
    return nextMonday05AM.getTime();
  };

  const getNextMondayNoon = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilNextMonday = (7 - dayOfWeek + 1) % 7; // Next Monday
    const nextMondayNoon = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + daysUntilNextMonday,
      12, // 12:00 PM
      0, // minutes
      0, // seconds
      0 // milliseconds
    );
    return nextMondayNoon.getTime();
  };

  const getNextSunday = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilNextSunday = (7 - dayOfWeek) % 7; // Next Sunday
    const nextSunday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + daysUntilNextSunday,
      23, // 11:59 PM
      59, // minutes
      59, // seconds
      999 // milliseconds
    );
    return nextSunday.getTime();
  };

  useEffect(() => {
    let countDownDate;
    const now = new Date().getTime();

    // Determine if it's before or after Monday 12:00 PM
    if (now < getNextMondayNoon()) {
      // It's before Monday 12:00 PM, so show competition start countdown
      countDownDate = getNextMonday05AM(); // Start at Monday 00:05 AM
    } else {
      // It's after Monday 12:00 PM, so show competition ends countdown
      countDownDate = getNextSunday(); // Ends at Sunday 11:59 PM
    }

    const updateCountdown = () => {
      const now = new Date().getTime();
      let distance = countDownDate - now;

      if (distance < 0) {
        // If countdown is finished, reset depending on the case
        if (countDownDate === getNextMonday05AM()) {
          // If it was competition start, then show competition ends
          countDownDate = getNextSunday();
        } else {
          // Otherwise show competition start (next Monday 00:05 AM)
          countDownDate = getNextMonday05AM();
        }
        distance = countDownDate - now; // Reset distance
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Format all values to always display two digits
      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
        isCompetitionStart: countDownDate === getNextMonday05AM(), // Set flag to determine if it's competition start
      });
    };

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const [isActive, setIsActive] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const labelRef = useRef(null);
  const counterRef = useRef(null);

  const handleDownload = () => {
    setIsActive(true);
    setIsDownloading(true);
    setProgress(0);
    setIsDone(false);

    // Simulate a download progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 100) {
          return prevProgress + 10;
        } else {
          clearInterval(interval);
          setIsDone(false);
          return 100;
        }
      });
    }, 1000); // Update progress every second

    // After 10 seconds, reset to the default state
  };

  useEffect(() => {
    if (isDone) {
      const timeout = setTimeout(() => {
        setIsActive(false);
        setProgress(0);
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [isDone]);

  return (
    <>
      <header className={headerClass}>
        <div className="topfirstbar">
          <div className="ends_compititionssiv_top">
            <a className="topmainbar">
              <div className="newbtn_top">New</div>
              <div className="instantimgdiv">
                {" "}
                <img
                  src={`${process.env.PUBLIC_URL}/images/instant-win.svg`}
                />{" "}
              </div>
              <div className="endscompititions">
                {timeLeft.isCompetitionStart
                  ? `Competition Ends : ${timeLeft.days} days: ${timeLeft.hours} hours: ${timeLeft.minutes} minutes: ${timeLeft.seconds} seconds`
                  : `Competition Start : ${timeLeft.days} days: ${timeLeft.hours} hours: ${timeLeft.minutes} minutes: ${timeLeft.seconds} seconds`}
              </div>
              {/* <div className="endscompititions">
                Competition Ends:{" "}
                {`${timeLeft.days} days: ${timeLeft.hours} hours: ${timeLeft.minutes} minutes: ${timeLeft.seconds} seconds`}
              </div> */}
            </a>
          </div>
        </div>
        <div className="topbar">
          <div className="header header3">
            <div className="po-relative">
              <div className="h3-navbar">
                <div className="container contmainformob_newshi">
                  <nav className="navbar navbar-expand-lg h3-nav navbar_mainnavdiv_shi">
                    {/* <div className="download_app_icondiv">
                      <div className="appstoreicondiv">
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://www.google.com/"
                        >
                          <img
                            src={`${process.env.PUBLIC_URL}/images/google-play-store-badge.png`}
                            alt="Google Play Store"
                            className="w-100 mw-100"
                            style={{ marginTop: "-2px" }}
                          />
                        </a>
                      </div>
                    </div> */}

                    {/* <div className="download_app_icondiv">
                      <div className="appstoreicondiv">
                        <a
                          className={`dl-button ${isActive ? "active" : ""} ${
                            isDone ? "done" : ""
                          }`}
                          onClick={handleDownload}
                        >
                          <div>
                            <div className="icon">
                              <svg
                                className="arrow"
                                viewBox="0 0 20 18"
                                fill="currentColor"
                              >
                                <polygon points="8 0 12 0 12 9 15 9 10 14 5 9 8 9" />
                              </svg>
                              <svg
                                className="shape"
                                viewBox="0 0 20 18"
                                fill="currentColor"
                              >
                                <path d="M4.8,0 L15.2,0 C16,0 16.8,0.6 17.1,1.4 L19.7,10.4 C19.9,11 19.9,11.6 19.8,12.2 L19.2,16.3 C19,17.3 18.2,18 17.2,18 H2.8 C1.8,18 1,17.3 0.8,16.3 L0.1,12.2 C0.1,11.6 0.1,11 0.3,10.4 L2.9,1.4 C3.2,0.6 4,0 4.8,0 Z" />
                              </svg>
                            </div>
                            <div className="label" ref={labelRef}>
                              <div
                                className={`show default ${
                                  isDone ? "hide" : ""
                                }`}
                              >
                                Download
                              </div>
                              <div className="state">
                                <div className="counter" ref={counterRef}>
                                  <span>{progress}%</span>
                                </div>
                                {isDone && <span>Done</span>}
                              </div>
                            </div>
                            <div
                              className="progress"
                              style={{ transform: `scaleY(${progress / 100})` }}
                            ></div>
                          </div>{" "}
                         
                        </a>
                      </div>
                    </div> */}

                    {/* <div className="download_app_icondiv">
                      <div className="appstoreicondiv">
                        <a
                          className={`dl-button ${isActive ? "active" : ""} ${
                            isDone ? "done" : ""
                          }`}
                          onClick={handleDownload}
                        >
                          <div>
                            <div className="icon">
                              <div>
                                <svg
                                  className="arrow"
                                  viewBox="0 0 20 18"
                                  fill="currentColor"
                                >
                                  <polygon points="8 0 12 0 12 9 15 9 10 14 5 9 8 9" />
                                </svg>
                                <svg
                                  className="shape"
                                  viewBox="0 0 20 18"
                                  fill="currentColor"
                                >
                                  <path d="M4.82668561,0 L15.1733144,0 C16.0590479,0 16.8392841,0.582583769 17.0909106,1.43182334 L19.7391982,10.369794 C19.9108349,10.9490677 19.9490212,11.5596963 19.8508905,12.1558403 L19.1646343,16.3248465 C19.0055906,17.2910371 18.1703851,18 17.191192,18 L2.80880804,18 C1.82961488,18 0.994409401,17.2910371 0.835365676,16.3248465 L0.149109507,12.1558403 C0.0509788145,11.5596963 0.0891651114,10.9490677 0.260801785,10.369794 L2.90908938,1.43182334 C3.16071592,0.582583769 3.94095214,0 4.82668561,0 Z" />
                                </svg>
                              </div>
                              <span />
                            </div>
                            <div className="label" ref={labelRef}>
                              <div
                                className={
                                  isDownloading ? "default" : "show default"
                                }
                              >
                                {isDone ? "Downloading apk..." : "Download Apk"}
                              </div>

                              <div
                                className={`state ${
                                  isDownloading ? "show" : ""
                                } ${isDone ? "show" : ""}`}
                              >
                                <div
                                  className={
                                    isDownloading || isDone
                                      ? "counter show"
                                      : "counter "
                                  }
                                  ref={counterRef}
                                >
                                  {progress > 0 && !isDone && (
                                    <span>{progress}%</span>
                                  )}
                                </div>
                              </div>

                              {isDone && <span>Download Done</span>}
                            </div>
                            <div
                              className="progress"
                              style={{ transform: `scaleY(${progress / 100})` }}
                            ></div>
                          </div>
                        </a>
                      </div>
                    </div> */}

                    <Link
                      to="/"
                      className="navbar-brand navbarlogodiv"
                      // onClick={() => {
                      //   window.scrollTo(0, 0);
                      //   window.location.reload();
                      // }}
                    >
                      <img
                        src={`${process.env.PUBLIC_URL}/images/logo.png`}
                        alt="logo"
                      />
                    </Link>

                    {token ? (
                      <div className="navbar-collapse newnavbarleft">
                        <ul className="navbar navbar_afterlogin">
                          <li className="nav-item afterlogin_icons_nav notificationclick">
                            <a className="itmelink_menus">
                              <img
                                src={`${process.env.PUBLIC_URL}/images/bell_icon.png`}
                                alt="bell"
                                onClick={NotificationOpen}
                              />
                              {/* <span class="cartcount">3</span> */}
                            </a>
                            <div
                              className={`notificationdiv_popup ${
                                isNot ? "show" : ""
                              }`}
                              id="notificationPopup"
                              style={{ display: isNot ? "block" : "none" }}
                            >
                              <div
                                className="topnoticationdiv_main"
                                id="popupContent"
                              >
                                <div className="notificationheading">
                                  <h2>Notifications</h2>
                                </div>
                                <div className="notifi_innerdiv">
                                  {notification.length > 0 ? (
                                    notification.map((item) => (
                                      <div
                                        className="notifystrip"
                                        key={item._id}
                                      >
                                        <a className="notifylinkdiv">
                                          <div className="notify-icondiv">
                                            <img
                                              src={`${process.env.PUBLIC_URL}/images/get_notify_icon_.png`}
                                              alt="notification"
                                            />
                                          </div>
                                          <div className="notificationtext_heading">
                                            <h2>{item.title}</h2>
                                            <p>{item.body}</p>
                                            <div className="notif_timedate">
                                              <p>
                                                {moment(item.createdAt).format(
                                                  "ddd, D MMM, h:mm a"
                                                )}
                                              </p>
                                            </div>
                                          </div>
                                        </a>
                                      </div>
                                    ))
                                  ) : (
                                    <p>No notifications available.</p>
                                  )}
                                </div>
                                <div className="crossicondiv">
                                  <button
                                    type="button"
                                    className="crossbtn_notification"
                                    id="closeNotificationPopup"
                                    onClick={() => setIsNot(false)}
                                  >
                                    <img
                                      src={`${process.env.PUBLIC_URL}/images/cross_icon.png`}
                                      // src="images/cross_icon.png"
                                      alt="close"
                                    />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li className="nav-item afterlogin_icons_nav">
                            <Link to="/cart" className="itmelink_menus">
                              <img
                                src={`${process.env.PUBLIC_URL}/images/cart_icon.png`}
                                // src="images/cart_icon.png"
                                // alt="cart"
                              />
                              {/* <span className="cartcount">1</span> */}
                            </Link>
                          </li>
                          <li className="nav-item afterlogin_icons_nav userprofilediv_new">
                            <Link
                              to="/my_account"
                              className="itmelink_menus usermenulink"
                            >
                              <div className="userimgdiv">
                                <img
                                  src={
                                    profile?.profile_url ||
                                    `${process.env.PUBLIC_URL}/images/user_image.png`
                                  }
                                  alt="user"
                                />
                              </div>

                              {profile?.is_verified_user && ( // Conditionally render verify image
                                <div className="userverifyimg">
                                  <img
                                    src={`${process.env.PUBLIC_URL}/images/verify.png`}
                                    // src="images/verify.png"
                                    alt="verify"
                                  />
                                </div>
                              )}
                            </Link>
                          </li>
                        </ul>
                        <ul className="navbar moremenubar">
                          <li className="nav-item humbergermenulist">
                            <button
                              // type="button"
                              // className="menubaricons showmenus_clickbtn"
                              // // onClick={toggleMenu}
                              // onClick={() => setIsMenuVisible(!isMenuVisible)}
                              type="button"
                              className="menubaricons showmenus_clickbtn"
                              aria-controls="menu-list"
                              onClick={toggleMenu}
                            >
                              <span className="moretextmenu">More</span>
                              <img
                                src={`${process.env.PUBLIC_URL}/images/humbergur_menu.png`}
                                alt="menu"
                              />
                            </button>
                          </li>
                        </ul>
                      </div>
                    ) : (
                      <div className="navbar-collapse newnavbarleft">
                        <ul className="navbar moremenubar">
                          <li className="nav-item humbergermenulist">
                            <button
                              type="button"
                              className="menubaricons showmenus_clickbtn"
                              aria-controls="menu-list"
                              onClick={toggleMenu}
                            >
                              <span className="moretextmenu">More</span>
                              <img
                                src={`${process.env.PUBLIC_URL}/images/humbergur_menu.png`}
                                alt="menu"
                              />
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                    <div
                      id="menu-list"
                      // ref={menuRef}
                      className="menulist_divmanin"
                      style={{ display: isMenuVisible ? "block" : "none" }}
                    >
                      <ul className="menubar_list_ul">
                        {!token && (
                          <li className="mainmenulist">
                            <a
                              onClick={() => {
                                OpenSignIn();
                                setIsMenuVisible(false);
                              }}
                              className="showsigninpopup_onclick"
                            >
                              <div className="menubar_divmain">
                                <div className="menuname_withicon">
                                  <div className="menuiconimgdiv">
                                    <img
                                      src={`${process.env.PUBLIC_URL}/images/icon_logout.png`}
                                      alt="Sign In Icon"
                                    />
                                  </div>
                                  <div className="menuname">
                                    <h4>Sign In / Sign Up</h4>
                                  </div>
                                </div>
                                <div className="arrowicondiv">
                                  <img
                                    src={`${process.env.PUBLIC_URL}/images/menu_arrow_icon.png`}
                                    className="arrowicon_menu"
                                    alt="Menu Arrow"
                                  />
                                </div>
                              </div>
                            </a>
                          </li>
                        )}

                        <li className="mainmenulist">
                          <Link
                            to="/who_we_are"
                            onClick={() => setIsMenuVisible(false)}
                          >
                            <div className="menubar_divmain">
                              <div className="menuname_withicon">
                                <div className="menuiconimgdiv">
                                  <img
                                    src={`${process.env.PUBLIC_URL}/images/icon_who_we_are.png`}
                                  />
                                </div>
                                <div className="menuname">
                                  <h4>Who We Are</h4>
                                </div>
                              </div>
                              <div className="arrowicondiv">
                                <img
                                  src={`${process.env.PUBLIC_URL}/images/menu_arrow_icon.png`}
                                  className="arrowicon_menu"
                                />
                              </div>
                            </div>
                          </Link>
                        </li>

                        <li className="mainmenulist">
                          <Link
                            to="/the_winners_circle"
                            onClick={() => setIsMenuVisible(false)}
                          >
                            <div className="menubar_divmain">
                              <div className="menuname_withicon">
                                <div className="menuiconimgdiv">
                                  <img
                                    src={`${process.env.PUBLIC_URL}/images/icon_the_winners_circle.png`}
                                  />
                                </div>
                                <div className="menuname">
                                  <h4>The Winners Circle</h4>
                                </div>
                              </div>
                              <div className="arrowicondiv">
                                <img
                                  src={`${process.env.PUBLIC_URL}/images/menu_arrow_icon.png`}
                                  className="arrowicon_menu"
                                />
                              </div>
                            </div>
                          </Link>
                        </li>

                        <li className="mainmenulist">
                          <Link
                            to="/in_the_press"
                            onClick={() => setIsMenuVisible(false)}
                          >
                            <div className="menubar_divmain">
                              <div className="menuname_withicon">
                                <div className="menuiconimgdiv">
                                  <img
                                    src={`${process.env.PUBLIC_URL}/images/icon_in_the_press.png`}
                                  />
                                </div>
                                <div className="menuname">
                                  {/* <h4>Trending Articles</h4> */}
                                  <h4>SpotsBall In the News</h4>
                                </div>
                              </div>
                              <div className="arrowicondiv">
                                <img
                                  src={`${process.env.PUBLIC_URL}/images/menu_arrow_icon.png`}
                                  className="arrowicon_menu"
                                />
                              </div>
                            </div>
                          </Link>
                        </li>

                        <li className="mainmenulist">
                          <Link
                            to="/live_weekly_winner"
                            onClick={() => setIsMenuVisible(false)}
                          >
                            <div className="menubar_divmain">
                              <div className="menuname_withicon">
                                <div className="menuiconimgdiv">
                                  <img
                                    src={`${process.env.PUBLIC_URL}/images/icon_live_weekly_winner.png`}
                                  />
                                </div>
                                <div className="menuname">
                                  {/* <h4>Live Weekly Winner</h4> */}
                                  <h4>Monday Live Stream : Who Won</h4>
                                </div>
                              </div>
                              <div className="arrowicondiv">
                                <img
                                  src={`${process.env.PUBLIC_URL}/images/menu_arrow_icon.png`}
                                  className="arrowicon_menu"
                                />
                              </div>
                            </div>
                          </Link>
                        </li>

                        <li className="mainmenulist">
                          <Link
                            to="/contact_us"
                            onClick={() => setIsMenuVisible(false)}
                          >
                            <div className="menubar_divmain">
                              <div className="menuname_withicon">
                                <div className="menuiconimgdiv">
                                  <img
                                    src={`${process.env.PUBLIC_URL}/images/icon_contact_us.png`}
                                  />
                                </div>
                                <div className="menuname">
                                  <h4>Contact Us</h4>
                                </div>
                              </div>
                              <div className="arrowicondiv">
                                <img
                                  src={`${process.env.PUBLIC_URL}/images/menu_arrow_icon.png`}
                                  className="arrowicon_menu"
                                />
                              </div>
                            </div>
                          </Link>
                        </li>

                        <li className="mainmenulist">
                          <Link
                            to="/terms"
                            onClick={() => setIsMenuVisible(false)}
                          >
                            <div className="menubar_divmain">
                              <div className="menuname_withicon">
                                <div className="menuiconimgdiv">
                                  <img
                                    src={`${process.env.PUBLIC_URL}/images/icon_legal.png`}
                                  />
                                </div>
                                <div className="menuname">
                                  <h4>Legal</h4>
                                </div>
                              </div>
                              <div className="arrowicondiv">
                                <img
                                  src={`${process.env.PUBLIC_URL}/images/menu_arrow_icon.png`}
                                  className="arrowicon_menu"
                                />
                              </div>
                            </div>
                          </Link>
                        </li>

                        {token && (
                          <li className="mainmenulist">
                            <a
                              onClick={() => {
                                OpenLogout();
                                setIsMenuVisible(false);
                              }}
                            >
                              <div className="menubar_divmain">
                                <div className="menuname_withicon">
                                  <div className="menuiconimgdiv">
                                    <img
                                      src={`${process.env.PUBLIC_URL}/images/icon_logout.png`}
                                      alt="Logout Icon"
                                    />
                                  </div>
                                  <div className="menuname">
                                    <h4>Logout</h4>
                                  </div>
                                </div>
                                <div className="arrowicondiv">
                                  <img
                                    src={`${process.env.PUBLIC_URL}/images/menu_arrow_icon.png`}
                                    className="arrowicon_menu"
                                    alt="Menu Arrow"
                                  />
                                </div>
                              </div>
                            </a>
                          </li>
                        )}
                      </ul>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Login isVisible={loginPopup} onClose={ClosePopup} />
      </header>

      <div
        className={`modal fade deleteacc_mainpopup_mdl ${
          isLogout ? "show" : ""
        }`}
        id="logout_account_modal"
        role="dialog"
        style={{
          paddingRight: isLogout ? 17 : "",
          display: isLogout ? "block" : "none",
        }}
        aria-modal="true"
      >
        <div className="modal-dialog deleteacc_mdldlg dlgdlg_logoutpopup">
          <div className="modal-content mdlcnt_deleteacc">
            <button
              type="button"
              className="logoutpopup_crossicon"
              data-dismiss="modal"
              onClick={CloseLogout}
            >
              {" "}
              <img
                src={`${process.env.PUBLIC_URL}/images/cross_icon.png`}
                //  src="images/cross_icon.png"
              />{" "}
            </button>
            <div className="modal-body mdlbdy_delete_account logoutaccount_divmain">
              <div className="deleteacc_text_data logoutdatamain">
                <h2>Logout</h2>
                <p>Are you sure you want to logout?</p>
              </div>
            </div>
            <div className="mdlftr_delete_acc_actionbtn">
              <div className="actionbtn_delete">
                <button
                  type="button"
                  className="cncle_btn_delete actionbtnmain"
                  data-dismiss="modal"
                  onClick={CloseLogout}
                >
                  Cancel
                </button>
              </div>
              <div className="actionbtn_delete">
                <a
                  className="delete_btn_delete actionbtnmain"
                  onClick={handleLogout}
                >
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
