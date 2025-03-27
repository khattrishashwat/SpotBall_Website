import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";

const locales = ["en-GB", "hi-IN", "ta-IN", "te-IN"];

// function getFlagSrc(countryCode) {
//   return /^[A-Z]{2}$/.test(countryCode)
//     ? `https://flagsapi.com/${countryCode.toUpperCase()}/shiny/64.png`
//     : "";
// }

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [headerClass, setHeaderClass] = useState("");
  const [notification, setNotification] = useState("");
  const [profile, setProfile] = useState({});
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isNot, setIsNot] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState(locales[0]);
  const [islangOpen, setIslangOpen] = useState(false);

  useEffect(() => {
    const browserLang = new Intl.Locale(navigator.language).language;
    const matchedLocale = locales.find(
      (locale) => new Intl.Locale(locale).language === browserLang
    );
    if (matchedLocale) {
      setSelectedLocale(matchedLocale);
    }
  }, []);

  const handleSelectLocale = (locale) => {
    setSelectedLocale(locale);
    setIslangOpen(false);
  };

  const intlLocale = new Intl.Locale(selectedLocale);
  const langName = new Intl.DisplayNames(["en"], { type: "language" }).of(
    intlLocale.language
  );

  const toggleMenu = () => {
    setIsMenuVisible((prevState) => !prevState); // Toggle the state
  };

  // const handleClickOutside = (event) => {
  //   // Menu elements
  //   const menuButton = document.querySelector(".menubaricons");
  //   const menuList = document.querySelector(".menulist_divmanin");

  //   // Notification elements
  //   const notificationButton = document.querySelector(
  //     ".notificationclick .itmelink_menus"
  //   );
  //   const notificationList = document.querySelector(".notificationdiv_popup");

  //   // Close menu if clicked outside
  //   if (
  //     menuButton &&
  //     menuList &&
  //     !menuButton.contains(event.target) &&
  //     !menuList.contains(event.target)
  //   ) {
  //     setIsMenuVisible(false); // Hide the menu
  //   }

  //   // Close notification dropdown if clicked outside
  //   if (
  //     notificationButton &&
  //     notificationList &&
  //     !notificationButton.contains(event.target) &&
  //     !notificationList.contains(event.target)
  //   ) {
  //     setIsNot(false); // Hide the notifications
  //   }
  // };

  // const isHomePage = location.pathname === "/";

  // useEffect(() => {
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);
  const isHomePage = location.pathname === "/";
  const token = localStorage.getItem("Web-token");

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

      const response = await axios.get(
        "app/notifications/get-notifications?skip=0&limit=10",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotification(response.data.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const updateNotifications = async () => {
    try {
      const token = localStorage.getItem("Web-token");
      if (!token) return;

      await axios.patch(
        "app/notifications/mark-as-read",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchNotification();
    } catch (error) {
      console.error("Error updating notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotification();
  }, []);

  const unreadCount = Array.isArray(notification)
    ? notification.filter((item) => !item.isRead).length
    : 0;

  const handleNotificationClick = () => {
    setIsNot((prev) => !prev);
    updateNotifications();
  };
  const NotificationClose = () => {
    setIsNot(false);
  };
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    isCompetitionStart: false,
  });

  const getTargetTime = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
    const currentHours = now.getHours();

    const nextMondayNoon = new Date(now);
    nextMondayNoon.setDate(now.getDate() + ((7 - dayOfWeek + 1) % 7)); // Next Monday
    nextMondayNoon.setHours(12, 0, 0, 0); // Monday 12:00 PM

    const nextSundayEnd = new Date(now);
    nextSundayEnd.setDate(now.getDate() + ((7 - dayOfWeek) % 7)); // Next Sunday
    nextSundayEnd.setHours(23, 59, 59, 999); // Sunday 23:59

    let targetTime;
    let isStart = false;

    if (dayOfWeek === 0) {
      // **Sunday**
      if (currentHours < 12) {
        targetTime = nextMondayNoon.getTime(); // Countdown to Monday 12:00 PM
        isStart = true;
      } else {
        targetTime = nextSundayEnd.getTime(); // Countdown to Sunday 23:59
      }
    } else if (dayOfWeek === 1 && currentHours < 12) {
      // **Monday before 12 PM**
      targetTime = nextMondayNoon.getTime(); // Countdown to Monday 12:00 PM
      isStart = true;
    } else {
      // **Monday 12:00 PM - Sunday 23:59**
      targetTime = nextSundayEnd.getTime(); // Countdown to Sunday 23:59
    }

    return { targetTime, isStart };
  };

  useEffect(() => {
    let { targetTime, isStart } = getTargetTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance < 0) {
        ({ targetTime, isStart } = getTargetTime());
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
        isCompetitionStart: isStart,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header
        className={`header header-sticky default header-style-02 ${
          !isHomePage ? "innerheader_new" : ""
        }`}
      >
        <div className="">
          <div className="topfirstbar">
            <div className="ends_compititionssiv_top">
              <a className="topmainbar">
                <div className="newbtn_top">New</div>
                <div className="instantimgdiv">
                  <img src="images/instant-win.svg" />
                </div>
                <div className="endscompititions">
                  {timeLeft.isCompetitionStart
                    ? `Competition Start : ${timeLeft.days} days: ${timeLeft.hours} hours: ${timeLeft.minutes} minutes: ${timeLeft.seconds} seconds`
                    : `Competition End : ${timeLeft.days} days: ${timeLeft.hours} hours: ${timeLeft.minutes} minutes: ${timeLeft.seconds} seconds`}
                </div>
              </a>
            </div>
          </div>
        </div>
        {/* <nav className="navbar navbar-static-top navbar-expand-xl header3">
          <div className="container main-header position-relative">
            <Link to="/" className="navbar-brand d-flex d-xl-none">
              <img
                className="logo img-fluid"
                src="images/logo.png"
                alt="logo"
              />
              <img
                className="sticky-logo img-fluid"
                src="images/logo.png"
                alt="logo"
              />
            </Link>
            <div className="navbar-collapse collapse">
              <ul className="nav navbar-nav">
                <li className="nav-item navbar-brand-item">
                  <Link to="/" className="navbar-brand">
                    <img
                      className="logo img-fluid"
                      src="images/logo.png"
                      alt="logo"
                    />
                    <img
                      className="sticky-logo img-fluid"
                      src="images/logo.png"
                      alt="logo"
                    />
                  </Link>
                </li>
              </ul>
            </div>
            <div className="add-listing">
              <div className="side-menu">
                <a
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasRight"
                  aria-controls="offcanvasRight"
                  onClick={toggleMenu}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/images/svg/menu.svg`}
                    // src="./images/svg/menu.svg"
                  />
                  <img
                    className="menu-dark"
                    src={`${process.env.PUBLIC_URL}/images/svg/menu.svg`}
                    // src="./images/svg/menu.svg"
                  />
                </a>
              </div>
            </div>
          </div>
        </nav> */}
        <nav className="navbar navbar-static-top navbar-expand-xl header3">
          <div className="container main-header position-relative">
            <div className="dropdown" tabIndex={0}>
              <button
                id="dropdown-btn"
                onClick={() => setIslangOpen(!islangOpen)}
              >
                {langName} <span className="arrow-down"></span>
              </button>
              {islangOpen && (
                <ul className="dropdown-content" id="dropdown-content">
                  {locales
                    .filter((locale) => locale !== selectedLocale)
                    .map((otherLocale) => {
                      const otherIntlLocale = new Intl.Locale(otherLocale);
                      const otherLangName = new Intl.DisplayNames(["en"], {
                        type: "language",
                      }).of(otherIntlLocale.language);

                      return (
                        <li
                          key={otherLocale}
                          onMouseDown={() => handleSelectLocale(otherLocale)}
                        >
                          {otherLangName}
                        </li>
                      );
                    })}
                </ul>
              )}
            </div>
            <Link to="/" className="navbar-brand d-flex d-xl-none">
              <img
                className="logo img-fluid"
                src={`${process.env.PUBLIC_URL}/images/logo.png`}
                // src="images/logo.png"
                alt="logo"
              />
              <img
                className="sticky-logo img-fluid"
                src={`${process.env.PUBLIC_URL}/images/logo.png`}
                // src="images/logo.png"
                alt="logo"
              />
            </Link>

            <div className="navbar-collapse collapse">
              <ul className="nav navbar-nav">
                <li className="nav-item navbar-brand-item">
                  <Link to="/" className="navbar-brand">
                    <img
                      className="logo img-fluid"
                      src="images/logo.png"
                      alt="logo"
                    />
                    <img
                      className="sticky-logo img-fluid"
                      src="images/logo.png"
                      alt="logo"
                    />
                  </Link>
                </li>
              </ul>
            </div>
            <div className="side-menu-flex">
              {token && (
                <div className="navbar-collapse newnavbarleft">
                  <ul className="navbar navbar_afterlogin">
                    {/* Notification Icon */}
                    <li className="nav-item afterlogin_icons_nav notificationclick">
                      <a
                        className="itmelink_menus"
                        onClick={handleNotificationClick}
                      >
                        <img src="/images/bell_icon.png" alt="Notifications" />
                        {unreadCount > 0 && (
                          <span className="cartcount">{unreadCount}</span>
                        )}
                      </a>

                      {/* Notification Popup */}
                      <div
                        className={`notificationdiv_popup ${isNot ? "" : ""}`}
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
                                <div className="notifystrip" key={item._id}>
                                  <Link
                                    to={`/notification/${item._id}`}
                                    className="notifylinkdiv"
                                  >
                                    <div className="notify-icondiv">
                                      <img
                                        className="notification_img"
                                        src="/image/favicon.png"
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
                                  </Link>
                                </div>
                              ))
                            ) : (
                              <p>No notifications available.</p>
                            )}
                          </div>
                          <div className="crossicondiv">
                            {/* Close Button */}
                            <button
                              type="button"
                              className="crossbtn_notification"
                              onClick={() => setIsNot(false)}
                            >
                              <img
                                src={`${process.env.PUBLIC_URL}/image/cross_icon.png`}
                                alt="close"
                              />{" "}
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>

                    {/* Cart Icon */}
                    <li className="nav-item afterlogin_icons_nav">
                      <Link to="/cart" className="itmelink_menus">
                        <img src="/image/cart_icon.png" alt="Cart" />
                      </Link>
                    </li>

                    {/* User Profile */}
                    <li className="nav-item afterlogin_icons_nav userprofilediv_new">
                      <Link
                        to="/my_account"
                        className="itmelink_menus usermenulink"
                      >
                        <div className="userimgdiv">
                          <img
                            src={
                              profile?.profile_url || "/image/user_image.png"
                            }
                            alt="User"
                          />
                        </div>
                        {profile?.is_verified_user && (
                          <div className="userverifyimg">
                            <img src="/image/verify.png" alt="Verified User" />
                          </div>
                        )}
                      </Link>
                    </li>
                  </ul>
                </div>
              )}

              <div className="add-listing">
                <div className="side-menu">
                  <a
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasRight"
                    aria-controls="offcanvasRight"
                    onClick={toggleMenu}
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/images/svg/menu.svg`}
                      // src="./images/svg/menu.svg"
                    />
                    <img
                      className="menu-dark"
                      src={`${process.env.PUBLIC_URL}/images/svg/menu.svg`}
                      // src="./images/svg/menu.svg"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div
        className={`offcanvas offcanvas-end offcanvas-sidebar-menu ${
          isMenuVisible ? "show" : ""
        }`}
        // className={?offcanvas offcanvas-end offcanvas-sidebar-menu}
        tabIndex={-1}
        id="offcanvasRight"
      >
        <div className="offcanvas-header text-end justify-content-end p-4">
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={() => setIsMenuVisible(false)}
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div className="offcanvas-body p-4 p-sm-5 d-flex align-content-between flex-wrap justify-content-center">
          <div className="sidebar-menu">
            <div className="sidebar-logo">
              <Link to="/">
                <img
                  className="logo img-fluid"
                  src="images/logo.png"
                  alt="logo"
                />
              </Link>
            </div>
            <div className="navbar-collapse">
              <ul className="nav navbar-nav">
                <li className="dropdown nav-item">
                  <Link
                    to="/who_we_are"
                    onClick={() => setIsMenuVisible(false)}
                    className="nav-link"
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/images/icon_who_we_are.png`}
                    />{" "}
                    Who We Are
                  </Link>
                </li>
                <li className="dropdown nav-item">
                  <Link
                    to="/the_winners_circle"
                    onClick={() => setIsMenuVisible(false)}
                    className="nav-link"
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/images/icon_the_winners_circle.png`}
                      // src="images/icon_the_winners_circle.png"
                    />
                    The Winners Circle
                  </Link>
                </li>
                <li className="dropdown nav-item">
                  <Link
                    to="/in_the_press"
                    onClick={() => setIsMenuVisible(false)}
                    className="nav-link"
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/images/icon_in_the_press.png`}
                    />
                    SpotsBall in the News
                  </Link>
                </li>
                <li className="dropdown nav-item">
                  <Link
                    to="/live_weekly_winner"
                    onClick={() => setIsMenuVisible(false)}
                    className="nav-link"
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/images/icon_live_weekly_winner.png`}
                    />
                    Monday Live Stream: Who Won
                  </Link>
                </li>
                <li className="dropdown nav-item">
                  <Link
                    to="/contact_us"
                    onClick={() => setIsMenuVisible(false)}
                    className="nav-link"
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/images/icon_contact_us.png`}
                    />
                    Contact us
                  </Link>
                </li>
                <li className="dropdown nav-item ">
                  <Link
                    to="/terms"
                    onClick={() => setIsMenuVisible(false)}
                    className="nav-link"
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/images/icon_legal.png`}
                    />
                    Legal
                  </Link>
                </li>
                <li className="dropdown nav-item ">
                  <Link
                    to="/tht"
                    onClick={() => setIsMenuVisible(false)}
                    className="nav-link"
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/images/icon_legal.png`}
                    />
                    THT
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
