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
      const response = await axios.get(
        "app/notifications/get-notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

      // Format all values to always display two digits
      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    };

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

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
              {/* <div className="endscompititions">
                Competition Ends: {formatTime(timeLeft)}
              </div> */}
              <div className="endscompititions">
                Competition Ends:{" "}
                {`${timeLeft.days} days: ${timeLeft.hours} hours: ${timeLeft.minutes} minutes: ${timeLeft.seconds} seconds`}
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
