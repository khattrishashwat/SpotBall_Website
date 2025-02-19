import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Login from "../../Auth/Login";
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../../LanguageContext";
import "../../../i18n";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [headerClass, setHeaderClass] = useState("");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [notification, setNotification] = useState("");
  const [profile, setProfile] = useState({});

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [islang, setIsLang] = useState(false);
  const [isLogout, setIsLogout] = useState("");
  const [loginPopup, setLoginPopup] = useState(false);
  const [isNot, setIsNot] = useState(false);
  const [notice, setNotice] = useState(false);
  const [androidLink, setAndroidLink] = useState("");

  const { t } = useTranslation();
  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext);

  const toggleLanguage = (e, lang) => {
    e.preventDefault();
    setSelectedLanguage(lang); // Pass language code here
  };

  useEffect(() => {
    if (location.pathname === "/") {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);
  const token = localStorage.getItem("Web-token");

  const handleLogoClick = () => {
    if (location.pathname === "/") {
      window.location.reload(); // Reload the page if already on the homepage
    } else {
      // Otherwise, navigate to the homepage
      navigate("/");
    }
  };
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
  const toggleMenulang = () => {
    setIsLang((prevState) => !prevState); // Toggle the state
  };
  const OpenLogout = () => {
    setIsLogout(true);
  };
  const CloseLogout = () => {
    setIsLogout(false);
  };

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

  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    isCompetitionStart: false, // Tracks if competition is starting or ending
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
      <header className={headerClass}>
        <div className="topfirstbar">
          <div className="ends_compititionssiv_top">
            <a className="topmainbar">
              <div className="newbtn_top">{t("new")}</div>
              <div className="instantimgdiv">
                <img src={`${process.env.PUBLIC_URL}/images/instant-win.svg`} />
              </div>
              <div className="endscompititions">
                {timeLeft.isCompetitionStart
                  ? `${t("Competition Start")}: ${timeLeft.days} ${t(
                      "days"
                    )}: ${timeLeft.hours} ${t("hours")}: ${
                      timeLeft.minutes
                    } ${t("minutes")}: ${timeLeft.seconds} ${t("seconds")}`
                  : `${t("Competition End")}: ${timeLeft.days} ${t("days")}: ${
                      timeLeft.hours
                    } ${t("hours")}: ${timeLeft.minutes} ${t("minutes")}: ${
                      timeLeft.seconds
                    } ${t("seconds")}`}
              </div>
            </a>
          </div>
        </div>
        <div className="topbar">
          <div className="header header3">
            <div className="po-relative">
              <div className="h3-navbar">
                <div className="container contmainformob_newshi">
                  <nav className="navbar navbar-expand-lg h3-nav navbar_mainnavdiv_shi">
                    <div
                      className="navbar-brand navbarlogodiv"
                      onClick={handleLogoClick}
                    >
                      <img
                        src={`${process.env.PUBLIC_URL}/images/logo.png`}
                        alt="logo"
                      />
                    </div>

                    {token ? (
                      <div className="navbar-collapse newnavbarleft">
                        <ul className="navbar navbar_afterlogin">
                          <li className="nav-item afterlogin_icons_nav lang_icons">
                            <a
                              className="itmelink_menus "
                              onClick={toggleMenulang}
                            >
                              <img
                                src={`${process.env.PUBLIC_URL}/images/language_icon.png`}
                                alt="language-icon"
                              />
                            </a>
                            <div
                              id="menu-list"
                              className="menulist_divmanin"
                              style={{
                                display: islang ? "block" : "none",
                              }}
                            >
                              <ul className="menubar_list_ul">
                                {[
                                  { name: "English", code: "en" },
                                  { name: "Hindi", code: "hi" },
                                  { name: "Tamil", code: "ta" },
                                  { name: "Telugu", code: "te" },
                                ].map((language, index) => (
                                  <li key={index} className="mainmenulist">
                                    <a
                                      onClick={(e) =>
                                        toggleLanguage(e, language.code)
                                      }
                                    >
                                      <div className="menubar_divmain">
                                        <div className="menuname_withicon">
                                          <div className="menuiconimgdiv">
                                            <img
                                              src={`${process.env.PUBLIC_URL}/images/icon_who_we_are.png`}
                                              alt={`${language.name}-icon`}
                                            />
                                          </div>
                                          <div className="menuname">
                                            <h4>{language.name}</h4>{" "}
                                            {/* Show the language name */}
                                          </div>
                                        </div>
                                        <div className="arrowicondiv">
                                          <img
                                            src={`${process.env.PUBLIC_URL}/images/menu_arrow_icon.png`}
                                            className="arrowicon_menu"
                                            alt="arrow-icon"
                                          />
                                        </div>
                                      </div>
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </li>

                          <li className="nav-item afterlogin_icons_nav notificationclick">
                            <a className="itmelink_menus">
                              <img
                                src={`${process.env.PUBLIC_URL}/images/bell_icon.png`}
                                alt="bell"
                                onClick={handleNotificationClick}
                              />
                              {unreadCount > 0 && (
                                <span className="cartcount">{unreadCount}</span>
                              )}
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
                                  <h2>{t("Notifications")}</h2>
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
                                    <p>{t("No notifications available.")}</p>
                                    // <p>No notifications available.</p>
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

                              {profile?.is_verified_user && (
                                <div className="userverifyimg">
                                  <img
                                    src={`${process.env.PUBLIC_URL}/images/verify.png`}
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
                              type="button"
                              className="menubaricons showmenus_clickbtn"
                              aria-controls="menu-list"
                              onClick={toggleMenu}
                            >
                              <span className="moretextmenu">{t("More")}</span>
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
                              <span className="moretextmenu">{t("More")}</span>
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
                        {/* {!token && (
                          <li className="mainmenulist">
                            <a
                              onClick={() => {
                                // OpenSignIn();
                                setIsMenuVisible(false);
                                setLoginPopup(!loginPopup);
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
                        )} */}

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
                                  {/* <h4>{t("Who We Are")}</h4> */}
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
                                  <h4>{t("The Winners Circle")}</h4>
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
                                <div
                                  className="menuname"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <h4>{t("SpotsBall In the News")}</h4>
                                  <img
                                    src="https://ges-inet.org/wp-content/uploads/2020/10/new-gif.gif"
                                    style={{
                                      width: 50,
                                      marginTop: 6,
                                      marginLeft: 10,
                                    }}
                                  />
                                </div>

                                {/* <div className="menuname">
                                  <h4>SpotsBall In the News</h4>
                                </div> */}
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
                                  <h4>{t("Monday Live Stream : Who Won")}</h4>
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
                                  <h4>{t("Contact Us")}</h4>
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
                                  <h4>{t("Legal")}</h4>
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
                                    <h4>{t("Logout")}</h4>
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
                <h2>{t("Logout")}</h2>
                <p>{t("Are you sure you want to logout?")}</p>
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
                  {t("Cancel")}
                </button>
              </div>
              <div className="actionbtn_delete">
                <a
                  className="delete_btn_delete actionbtnmain"
                  onClick={handleLogout}
                >
                  {t("Logout")}
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
