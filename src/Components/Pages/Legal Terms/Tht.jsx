import React from "react";
import { Link } from "react-router-dom";

function Tht() {
  return (
    <>
      <div className="color-container">
        <div className="c1" />
        <div className="c2" />
        <div className="c3" />
        <div className="c4" />
        <div className="c6" />
        <div className="c5" />
        <div className="c7" />
        <div className="tht-section-breadcrum">
          <div className="tht-heading">
            <h3>
              {" "}
              Trust. Honestly. Transparency THT.
              <br />
              The SpotsBall Business Code of Conduct.
            </h3>
          </div>
        </div>
        <div className="tht-section">
          <div className="container">
            <div className="tht-1">
              <div className="tht-heading">
                <h6>Introduction</h6>
              </div>
              <div className="tht-para">
                <p>
                  SpotsBall Global Pvt Ltd is a legally incorporated business
                  entity, with its operational headquarters located in Indore,
                  India. The Company’s on-line spot the ball cricket challenge
                  has been fully vetted by two Indian law firms, both issuing
                  validating legal opinions that the SpotsBall game is a game of
                  skill, governed and permitted to operate on-line under all
                  applicable laws of Indian and being compliant with all
                  government on-line gaming rules and regulations.{" "}
                </p>
                <p>
                  A fully detailed description of SpotsBall’s{" "}
                  <strong>Trust, Honesty, Transparency (THT)</strong> gameplay
                  rules, processes and procedures can be found in our{" "}
                  <Link to="/rules">Rules of Play</Link> and{" "}
                  <Link to="/rules">FAQs</Link> document. Summarized below are
                  the key benchmark cornerstones of our THT business code of
                  conduct.{" "}
                </p>
              </div>
              <div className="tht-ul">
                <ul>
                  <li>
                    The SpotsBall cricket gaming challenge can only be played
                    inside of India. With our geo-fencing capabilities, we are
                    able to pinpoint your physical location from where you are
                    trying to access the on-line game (either the website or
                    through the mobile app).
                  </li>
                  <li>
                    The game is not available for play, and the on-line
                    platforms cannot be accessed to create User accounts, in
                    those Indian states that prohibit “on-line games of skill”
                    for cash prizes.{" "}
                  </li>
                  <li>
                    {" "}
                    To be eligible to play SpotsBall, you must have an active
                    Indian mobile phone number when creating your SpotsBall
                    User/Player account.
                  </li>
                  <li>
                    {" "}
                    All players must be of legal age. Minors are not permitted
                    to create a SpotsBall User account that enables gameplay.
                  </li>
                  <li>
                    The cricket action photos used by SpotsBall, for the weekly
                    on-line game, are owned by and are the legal property of
                    SpotsBall, taken during amateur cricket matches that it
                    organizes. Working with a professional photographer and
                    several amateur cricket teams, these gameplay photos are
                    100% original, and cannot be found anywhere on the internet
                    (thereby thwarting on-line “pixel indexing” searches).
                  </li>
                  <li>
                    We have created a secure, checks-and-balances chain of
                    custody process and timeline, whereby the determination of
                    each weekly winner is calculated only the morning after the
                    ticketing portal has been closed, and all contest entries
                    from the prior week have been analyzed.{" "}
                  </li>
                  <li>
                    SpotsBall has been created to be an on-line game of fun for
                    all cricket fans and followers, with everyone having the
                    same chances of winning. It is not designed to be a
                    lottery-type experience, where unlimited gameplay tickets
                    can be purchased to statistically increase the chance of
                    winning. Therefore, each individual is only permitted one
                    User/Player Account, and can only purchase a maximum of 75
                    entry tickets for each weekly game.{" "}
                  </li>
                  <li>
                    Each weekly game will have one or more jackpot winners, with
                    winning x,y entry coordinates being calculated as describe
                    in the{" "}
                    <a href="https://spotsball.blr1.digitaloceanspaces.com/file/DEC19%20How%20We%20Calculate%20the%20Game%20Winning%20X%2CY%20Coordinates.pdf">
                      How We Calculate the Game Winning X,Y Coordinates
                    </a>
                    document.{" "}
                  </li>
                  <li>
                    Our payment processing portal, CASHFREE, is a secure payment
                    gateway which users/players can use with confidence to
                    purchase their weekly gameplay tickets.
                  </li>
                  <li>
                    Not later than 24 hours after the “Weekly SpotsBall Winner
                    Show” is streamed each Monday night at 2100hrs IST on social
                    media networks, we will contact the player(s) of the winning
                    x,y coordinates to get the needed banking/ financial details
                    for the payment of their jackpot winnings. We keep detailed
                    paper records and audit trails, so all tax withholdings,
                    payments and filings fully apply to Indian government tax
                    regulations, and conform with Indian GAAP (Generally
                    Accepted Accounting Principles) regulations and guidelines.
                  </li>
                </ul>
              </div>
              <div className="tht-head mt-5">
                <h3>
                  {" "}
                  Trust. Honestly. Transparency. THT.
                  <br />
                  The SpotsBall Business Code of Conduct.
                </h3>
              </div>
              <div className="tht-para">
                <p>
                  At SpotsBall, we are dedicated to continually manage our
                  company, conduct business operations, and operate our
                  SpotsBall gaming platforms under the THT Business Code of
                  Conduct.{" "}
                </p>
                <p>
                  Questions?...Issues...Problems? We are headquartered in
                  Indore, India with local customer service reps ready to
                  receive your email communications and address your concerns.
                  After sending an email to{" "}
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=support.in@spotsball.com"
                    target="_blank"
                  >
                    support.in@spotsball.com
                  </a>
                  , we will promptly get back to you with answers to your
                  questions.{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Tht;
