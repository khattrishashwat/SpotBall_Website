import React, { useState, useEffect } from "react";
import axios from "axios";

function PalyVedio({ isON, isOFF }) {
  // Destructure props correctly
  const [movies, setMovies] = useState("");

  const fetchVideoData = async () => {
    const token = localStorage.getItem("Web-token");
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

  const playVideo = () => {
    const videoElement = document.getElementById("video_howtoplay");
    if (videoElement) {
      videoElement.play();
    }
  };

  const videoData = movies.length > 0 ? movies[0] : null;

  return (
    <div
      className={`howtoplay_popup_new ${isON ? "show" : ""}`} // Dynamically show or hide the modal
      id="howtoplaypopup_new"
      style={{ display: isON ? "block" : "none" }} // Use isON prop to toggle visibility
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
                  onClick={isOFF}
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
                          // style={{ width: "100%", height: "auto" }} // Optional: responsive styles
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
                            onClick={playVideo}
                            style={{ cursor: "pointer" }} // Add cursor pointer for better UX
                          >
                            {/* You can add your play icon here */}
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
  );
}

export default PalyVedio;
