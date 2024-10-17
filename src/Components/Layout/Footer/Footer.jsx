import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <>
      <footer className="footermaindiv_section">
        <div className="container contfootermain">
          <div className="col-md-12 col12mainfooter">
            <div className="row rowmainfooter">
              <div className="col-md-4 col4footerightside">
                <div className="footertextinfodiv">
                  <div className="winnergurantee_footer">
                    <h2>A Guaranteed ₹50,000 Weekly Jackpot</h2>
                    <p>
                      SpotsBall operates skilled prize competitions resulting in
                      the allocation of prizes in accordance with the Terms and
                      Conditions of the website.
                    </p>
                    <p>
                      These Competitions are governed by Indian Law, and any
                      matters relating to the Competitions will be resolved
                      under Indian Law, and the Courts of India shall have
                      exclusive jurisdiction.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-8 col8rightfooterlinks">
                <div className="footerlinksmain_right">
                  <div className="footerlinksmaindiv_inner">
                    <div className="maindivforfooterlinks">
                      <h2 className="linksheading">Winners</h2>
                      <ul className="links_list_footer">
                        <li>
                          {" "}
                          <Link
                            to="/the_winners_circle"
                            className="linksanchor"
                          >
                            The Winners Circle
                          </Link>{" "}
                        </li>
                        <li>
                          {" "}
                          <Link
                            to="/live_weekly_winner"
                            className="linksanchor"
                          >
                            Live Weekly Winner
                          </Link>{" "}
                        </li>
                        <li>
                          {" "}
                          <Link to="/in_the_press" className="linksanchor">
                            In The Press
                          </Link>{" "}
                        </li>
                      </ul>
                    </div>
                    <div className="maindivforfooterlinks">
                      <h2 className="linksheading">About Us</h2>
                      <ul className="links_list_footer">
                        <li>
                          {" "}
                          <Link to="/who_we_are" className="linksanchor">
                            Who We Are?
                          </Link>{" "}
                        </li>
                        <li>
                          {" "}
                          <a className="linksanchor footer_howtoplayfaqlink">
                            How to Play/ FAQ’s{" "}
                          </a>{" "}
                        </li>
                        <li>
                          {" "}
                          <Link to="/contact_us" className="linksanchor">
                            Contact Us
                          </Link>{" "}
                        </li>
                      </ul>
                    </div>
                    <div className="maindivforfooterlinks">
                      <h2 className="linksheading">Legal</h2>
                      <ul className="links_list_footer">
                        <li>
                          {" "}
                          <Link to="/legal_terms" className="linksanchor">
                            Terms &amp; Conditions
                          </Link>{" "}
                        </li>
                        <li>
                          {" "}
                          <Link to="/legal_terms" className="linksanchor">
                            Privacy Policy
                          </Link>{" "}
                        </li>
                        <li>
                          {" "}
                          <Link to="/legal_terms" className="linksanchor">
                            Rules of Play &amp; FAQ's
                          </Link>{" "}
                        </li>
                        <li>
                          {" "}
                          <Link to="/legal_terms" className="linksanchor">
                            Cookie Policy
                          </Link>{" "}
                        </li>
                      </ul>
                    </div>
                    <div className="maindivforfooterlinks">
                      <h2 className="linksheading">Others</h2>
                      <ul className="links_list_footer">
                        <li>
                          {" "}
                          <a className="linksanchor">Loyalty Club</a>{" "}
                        </li>
                        <li>
                          {" "}
                          <a className="linksanchor">iOS App</a>{" "}
                        </li>
                        <li>
                          {" "}
                          <a className="linksanchor">Android App</a>{" "}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row rowmainfooter secondfootermaindiv">
              {/* <div class="col-md-4 col4footerightside">
					<div class="footertextinfodiv">
						
						<div class="nextbigwinnerdiv_footer">
							<h2>Be the next big winner!</h2>
							<a  class="bigwinner_signupbtn" id="footerregisbtn">Register</a>
						</div>
						
					</div>

				</div> */}
              <div className="col-md-8 col8rightfooterlinks">
                <div className="footerlinksmain_right footersocialwith_downloadicons">
                  <div className="footer_downloadapp_icons">
                    <div className="download_app_icondiv">
                      <div className="appstoreicondiv">
                        <a>
                          <img
                            src={`${process.env.PUBLIC_URL}/images/google-play-store-badge.png`}
                          />
                        </a>
                      </div>
                      <div className="appstoreicondiv">
                        <a>
                          <img
                            src={`${process.env.PUBLIC_URL}/images/apple-store-badge.png`}
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="footer_socialicons">
                    <ul>
                      <li>
                        {" "}
                        <a title="Facebook">
                          {" "}
                          <img
                            src={`${process.env.PUBLIC_URL}/images/facebook_icon.png`}
                          />{" "}
                        </a>{" "}
                      </li>
                      <li>
                        {" "}
                        <a title="Instagram">
                          {" "}
                          <img
                            src={`${process.env.PUBLIC_URL}/images/insta_icon.png`}
                          />{" "}
                        </a>{" "}
                      </li>
                      <li>
                        {" "}
                        <a title="Youtube">
                          {" "}
                          <img
                            src={`${process.env.PUBLIC_URL}/images/twiiter_x_icon.png`}
                          />{" "}
                        </a>{" "}
                      </li>
                      <li>
                        {" "}
                        <a title="Youtube">
                          {" "}
                          <img
                            src={`${process.env.PUBLIC_URL}/images/threads_icon.png`}
                          />{" "}
                        </a>{" "}
                      </li>
                      <li>
                        {" "}
                        <a title="Youtube">
                          {" "}
                          <img
                            src={`${process.env.PUBLIC_URL}/images/youtube_icon.png`}
                          />{" "}
                        </a>{" "}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <footer className="copyrightfooter">
        <div className="container contsecondfooter">
          <div className="col-md-12 col12secondfootermain">
            <div className="row rowmainforcopyrightwithcurrency">
              <div className="copyrightwithinrdropdown">
                <div className="divforcopyright">
                  <p>
                    © <Link to="/">SpotsBall</Link> 2024. All Rights Reserved
                    Designed by <a>Webmobril</a>{" "}
                  </p>{" "}
                  <span className="seprator">|</span>
                  <div className="currencyselectdiv">
                    <p>
                      Currency <i className="fa fa-inr" aria-hidden="true" />
                      <select>
                        <option>INR</option>
                        <option>INR</option>
                        <option>INR</option>
                      </select>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer
