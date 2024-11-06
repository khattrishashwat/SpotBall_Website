import React from 'react'
import "./Pages.css";


function PageNot() {
  return (
    <div>
      <header className="top-header"></header>

      {/* Dust particles */}
      <div>
        <div className="starsec"></div>
        <div className="starthird"></div>
        <div className="starfourth"></div>
        <div className="starfifth"></div>
      </div>
      {/* Dust particle end */}

      <div className="lamp__wrap">
        <div className="lamp">
          <div className="cable"></div>
          <div className="cover"></div>
          <div className="in-cover">
            <div className="bulb"></div>
          </div>
          <div className="light"></div>
        </div>
      </div>
      {/* END Lamp */}

      <section className="autop">
        {/* Content */}
        <div className="autop__content">
          <div className="autop__message message">
            <h1 className="message__title">Page Not Found</h1>
            <p className="message__text">
              We're sorry, the page you were looking for isn't found here. The
              link you followed may either be broken or no longer exists. Please
              try again, or take a look at our.
            </p>
          </div>
          <div className="autop__nav e-nav">
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="e-nav__link"
            >
              Go to Home
            </a>
          </div>
        </div>
        {/* END Content */}
      </section>
    </div>
  );
}

export default PageNot
