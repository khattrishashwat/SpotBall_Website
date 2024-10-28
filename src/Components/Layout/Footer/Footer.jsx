import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';

function Footer() {
  const [footer, setFooter] = useState({});
  const [movies, setMovies] = useState("");
  const [isModals, setIsModals] = useState("");

 const open = async () => {
   setIsModals(true);
 };

  const close = () => {
    setIsModals(false);
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
        setMovies(response.data.data);
      } 
    } catch (error) {
      console.error("Error fetching video data:", error);
    }
  };

  useEffect(() => {
    fetchVideoData();
  }, []);
  const fetchFooter = async () => {
    try {
      const response = await axios.get("/get-all-static-content/footer");

      if (response) {
        setFooter(response.data.data[0]?.description||{});
      } 
    } catch (error) {
      console.error("Error fetching video data:", error);
    }
  };

  useEffect(() => {
    fetchFooter();
  }, []);

  const playVideo = () => {
    const videoElement = document.getElementById("video_howtoplay");
    if (videoElement) {
      videoElement.play();
    }
  };

  const videoData = movies.length > 0 ? movies[0] : null;

  return (
    <>
      <footer className="footermaindiv_section">
        <div className="container contfootermain">
          <div className="col-md-12 col12mainfooter">
            <div className="row rowmainfooter">
              <div className="col-md-4 col4footerightside">
                <div className="footertextinfodiv">
                  <div className="winnergurantee_footer">
                    <div dangerouslySetInnerHTML={{ __html: footer }} />
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
                          <a
                            className="linksanchor footer_howtoplayfaqlink"
                            onClick={open}
                          >
                            How to Play{" "}
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
                    <img
                      src={`${process.env.PUBLIC_URL}/images/cross_icon.png`}
                      alt="Close"
                    />
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
                            poster={videoData.thumbnail_url} // Set the thumbnail
                            style={{ width: "100%", height: "auto" }} // Optional: responsive styles
                            // onPlay={() => console.log(videoData.video_url)} // Log URL when video plays
                          >
                            <source
                              src={videoData.video_url} // Use the video URL from the fetched data
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
                            >
                              {/* <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 80 80"
                              >
                                <path d="M40 0a40 40 0 1040 40A40 40 0 0040 0zM26 61.56V18.44L64 40z" />
                              </svg> */}
                            </div>
                          </div>
                        </>
                      ) : (
                        <p>Loading video...</p> // Display loading message if no video data is available
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer
