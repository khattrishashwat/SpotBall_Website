import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Weekly() {
  const [links, setLinks] = useState(false); // Video state

  const fetchLinks = async () => {
    try {
      const response = await axios.get(
        "app/static-content/get-all-static-content/footer"
      );

      if (response) {
        setLinks(response.data.data?.liveLinks);
      }
    } catch (error) {
      console.error("Error fetching footer data:", error);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <section className="maincont_section liv_Weekly">
        <div className="container contforinner_mainheading">
          <div className="row rowmainheading_inner">
            <div className="col-md-12 colmainheading_innerpages">
              <div className="pageheading_main">
                <h2>Live Weekly Winner</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="container contfor_livewinner">
          <div className="row rowlivewinnermain">
            <div className="col-md-4 weeklywinner_boxcol4">
              <div className="winnerbox_live_imgdiv">
                <img
                  src={`${process.env.PUBLIC_URL}/images/weekly_winner.png`}
                  // src="images/weekly_winner.png"
                />
              </div>
            </div>
            <div className="col-md-8 weeklywinner_col8">
              <div className="weeklywinner_righttext">
                <div className="daystripe_div">
                  <h3>Every Sunday</h3>
                  <div className="gamewinnertimingdiv">
                    <img
                      src={`${process.env.PUBLIC_URL}/images/ball_icon.png`}
                      // src="images/ball_icon.png"
                    />
                    <h4>
                      entry deadline for last week’s contest{" "}
                      <span>- 23:59hrs</span>
                    </h4>
                  </div>
                </div>
                <div className="daystripe_div">
                  <h3>Every Monday</h3>
                  <div className="gamewinnertimingdiv">
                    <img
                      src={`${process.env.PUBLIC_URL}/images/ball_icon.png`}
                      // src="images/ball_icon.png"
                    />
                    <h4>
                      new weekly games begins&nbsp;<span>- 12:00hrs</span>
                    </h4>
                  </div>
                  <div className="gamewinnertimingdiv">
                    <img
                      src={`${process.env.PUBLIC_URL}/images/ball_icon.png`}
                      // src="images/ball_icon.png"
                    />
                    <h4>
                      live Facebook and YouTube stream of “The SpotsBall Weekly
                      Winner Show”<span>- 21:00hrs</span>
                    </h4>
                  </div>
                </div>
                <div className="watchlivediv_savebtn">
                  <div className="watchlivediv">
                    <h2>Watch Live</h2>
                    <div className="liveicons">
                      {links?.Facebook_Streaming && (
                        <a
                          href={links.Facebook_Streaming}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={`${process.env.PUBLIC_URL}/images/face.png`}
                            alt="Facebook Live"
                          />
                        </a>
                      )}
                      {links?.Youtube_Streaming && (
                        <a
                          href={links.Youtube_Streaming}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={`${process.env.PUBLIC_URL}/images/you.png`}
                            alt="YouTube Live"
                          />
                        </a>
                      )}
                    </div>
                  </div>
                  {/* <div className="savebtn">
                    <button type="button" className="savebtn_livewinner">
                      Save
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Weekly;
