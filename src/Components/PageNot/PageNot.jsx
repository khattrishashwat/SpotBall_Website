import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Pages.css";

function PageNot() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHomeNavigation = () => {
    navigate("/");
    // if (location.pathname === "/") {
    //   window.location.reload(); // Reload the page if already on the homepage
    // } else {
    //   // Otherwise, navigate to the homepage
    //   navigate("/");
    // }
  };

  return (
    <div className="comming-soon not-found">
      <div className="comming-soon-info">
        <div className="comming-soon-inner">
          {/* Logo Start */}
          <div className="logo">
            <img src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="logo" />
          </div>
          {/* Logo End */}
          <div className="not-found-text">
            <h2>Page not found</h2>
            <h4>Sorry, this page doesn't appear to exist</h4>
            <div className="buyticketsbtndiv">
              <div className="addtocardbtnicon">
                <button
                  type="button"
                  className="buyticketbtn onclickcarticon_showcartpopup"
                  onClick={handleHomeNavigation}
                >
                  TAKE ME HOME
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageNot;
