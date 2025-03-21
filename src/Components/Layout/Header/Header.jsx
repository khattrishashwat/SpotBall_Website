import React from "react";

function Header() {
  return (
    <>
      <header className="header header-sticky default header-style-02">
        <div className="">
          <div className="topfirstbar">
            <div className="ends_compititionssiv_top">
              <a className="topmainbar">
                <div className="newbtn_top">New</div>
                <div className="instantimgdiv">
                  <img src="images/instant-win.svg" />
                </div>
                <div className="endscompititions">
                  Competition End :{" "}
                  <span id="countdown1">
                    3 days: 11 hours: 46 minutes: 7 seconds
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
        <nav className="navbar navbar-static-top navbar-expand-xl">
          <div className="container main-header position-relative">
            <a className="navbar-brand d-flex d-xl-none" href="index.html">
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
            </a>
            <div className="navbar-collapse collapse">
              <ul className="nav navbar-nav">
                <li className="nav-item navbar-brand-item">
                  <a className="navbar-brand" href="index.html">
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
                  </a>
                </li>
              </ul>
            </div>
            <div className="add-listing">
              <div className="side-menu">
                <a
                  href="#"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasRight"
                  aria-controls="offcanvasRight"
                >
                  <img src="./images/svg/menu.svg" alt="#" />
                  <img
                    className="menu-dark"
                    src="./images/svg/menu.svg"
                    alt="#"
                  />
                </a>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
