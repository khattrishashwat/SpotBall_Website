import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import Swal from "sweetalert2";

function Screen() {
  const navigate = useNavigate();
  const imgRef = useRef(null);

  const [colorIndex, setColorIndex] = useState(""); // Track the current color index

  const location = useLocation();
  const { quantity, responseData, leftticket } = location.state.payload || {};
  console.log("leftticket", leftticket);

  const [usedTickets, setUsedTickets] = useState(0);
  const [totalTickets, setTotalTickets] = useState(quantity || "");
  const [tickets, setTickets] = useState(
    Array.from({ length: quantity }, (_, i) => ({
      id: i + 1,
      xCord: "____",
      yCord: "____",
    }))
  );
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [clickedPoints, setClickedPoints] = useState([]);
  const [clickCount, setClickCount] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  const [isModals, setIsModals] = useState("");
  const [movies, setMovies] = useState("");

  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  const handleImageLoad = () => {
    if (imgRef.current) {
      const { width, height } = imgRef.current.getBoundingClientRect();
      setImageDimensions({ width, height });
    }
  };

  const open = async () => {
    setIsModals(true);
  };
  const close = () => {
    setIsModals(false);
    const videoElement = document.getElementById("video_howtoplay");
    if (videoElement) {
      videoElement.pause(); // Pause video on close
      videoElement.currentTime = 0; // Reset video time on close
    }
  };

  const fetchVideoData = async () => {
    const token = localStorage.getItem("Web-token");
    try {
      const response = await axios.get("app/how-to-play/get-how-to-play", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.data) {
        console.log("Fetched video data:", response.data.data);
        setMovies(response.data.data);
      } else {
        console.error("No video data found.");
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

  useEffect(() => {
    setUsedTickets(
      tickets.filter(
        (ticket) => ticket.xCord !== "____" && ticket.yCord !== "____"
      ).length
    );
  }, [tickets]);

  // const handleTicket = () => {
  //   // Check if totalTickets is less than responseData.maxTickets
  //   if (totalTickets < responseData.maxTickets) {
  //     const newTicket = {
  //       id: tickets.length + 1,
  //       xCord: "____",
  //       yCord: "____",
  //     };

  //     setTickets((prev) => [...prev, newTicket]);
  //     setTotalTickets((prev) => prev + 1); // Increment totalTickets, but not usedTickets yet
  //   } else {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "Maximum ticket limit reached",
  //       text: `You cannot add more than ${responseData.maxTickets} tickets.`,
  //       confirmButtonText: "OK",
  //       allowOutsideClick: false,
  //     });
  //   }
  // };
  const handleTicket = () => {
    const choosedTicket = responseData.maxTickets - leftticket; // Calculate choosedTicket

    // Check if totalTickets is less than responseData.maxTickets
    if (
      totalTickets < responseData.maxTickets &&
      totalTickets + 1 <= leftticket
    ) {
      const newTicket = {
        id: tickets.length + 1,
        xCord: "____",
        yCord: "____",
      };

      setTickets((prev) => [...prev, newTicket]);
      setTotalTickets((prev) => prev + 1); // Increment totalTickets, but not usedTickets yet
    } else {
      Swal.fire({
        icon: "warning",
        title: "Maximum ticket limit reached",
        text:
          leftticket === 0
            ? "There are no tickets left to add."
            : `You can only purchase a maximum of ${responseData.maxTickets} tickets per person, but you have already bought ${choosedTicket} tickets. You have only (${leftticket}) ticket left to purchase .`,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // const handleAddTicket = () => {
  //   // Check if usedTickets is less than maxTickets
  //   if (
  //     usedTickets < responseData.maxTickets &&
  //     totalTickets < responseData.maxTickets
  //   ) {
  //     const newTicket = {
  //       id: tickets.length + 1, // Increment ID based on the current length of tickets
  //       xCord: "____",
  //       yCord: "____",
  //     };

  //     // Add the new ticket
  //     setTickets((prev) => [...prev, newTicket]);

  //     // Increment usedTickets and totalTickets
  //     setUsedTickets((prev) => prev + 1); // Increment usedTickets
  //     setTotalTickets((prev) => prev + 1); // Update totalTickets
  //   } else {
  //     // Show a message if the maximum limit is reached
  //     Swal.fire({
  //       icon: "warning",
  //       title: "Maximum ticket limit reached",
  //       text: `You cannot add more than ${responseData.maxTickets} tickets.`,
  //       confirmButtonText: "OK",
  //       allowOutsideClick: false,
  //     });
  //   }
  // };

  const handleAddTicket = () => {
    const choosedTicket = responseData.maxTickets - leftticket; // Calculate choosedTicket

    // Check if we can add more tickets without exceeding the leftticket count
    if (
      usedTickets < responseData.maxTickets &&
      totalTickets < responseData.maxTickets &&
      leftticket > 0 && // Check if there are tickets left
      totalTickets + 1 <= leftticket // Ensure totalTickets doesn't exceed leftticket
    ) {
      const newTicket = {
        id: tickets.length + 1, // Increment ID based on the current length of tickets
        xCord: "____",
        yCord: "____",
      };

      // Add the new ticket
      setTickets((prev) => [...prev, newTicket]);

      // Increment usedTickets and totalTickets
      setUsedTickets((prev) => prev + 1); // Increment usedTickets
      setTotalTickets((prev) => prev + 1); // Update totalTickets
    } else {
      // Show a message if the maximum limit is reached or no tickets left
      Swal.fire({
        icon: "warning",
        title: "Cannot add more tickets",
        text:
          leftticket === 0
            ? "There are no tickets left to add."
            : `You can only purchase a maximum of ${responseData.maxTickets} tickets per person, but you have already bought  ${choosedTicket} tickets.You have only (${leftticket})  ticket left to purchase`,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    }
  };

  const handleRefreshAll = () => {
    setTickets((prev) =>
      prev.map((ticket) => ({
        ...ticket,
        xCord: "____",
        yCord: "____",
      }))
    );
    setClickedPoints([]);
    setClickCount(0);
  };

  const handleDeleteTicket = (id) => {
    const ticketToDelete = tickets.find((ticket) => ticket.id === id);

    if (!ticketToDelete) {
      return; // Exit if the ticket doesn't exist
    }

    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this ticket?",
      icon: "warning",
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with deletion
        const updatedTickets = tickets.filter((ticket) => ticket.id !== id);

        const reindexedTickets = updatedTickets.map((ticket, index) => ({
          ...ticket,
          id: index + 1,
        }));

        setTickets(reindexedTickets);

        // Check if xCord and yCord are valid
        if (ticketToDelete.xCord && ticketToDelete.yCord) {
          setClickedPoints((prev) =>
            prev.filter(
              (point) =>
                point.x !== ticketToDelete.xCord &&
                point.y !== ticketToDelete.yCord
            )
          );

          setClickCount((prev) => prev - 1); // Decrement click count
          setUsedTickets((prev) => prev - 1); // Decrement used tickets
        }

        // Decrement total tickets only if there are any left
        if (totalTickets > 0) {
          setTotalTickets((prev) => prev - 1);
        }

        Swal.fire("Deleted!", "The ticket has been removed.", "success");
      } else {
        Swal.fire("Cancelled", "Your ticket is safe.", "error");
      }
    });
  };

  const handleReply = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this coordinate?",
      icon: "warning",
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedTickets = tickets.map((ticket) =>
          ticket.id === id
            ? { ...ticket, xCord: "____", yCord: "____" }
            : ticket
        );

        setTickets(updatedTickets);

        const ticketToUpdate = tickets.find((ticket) => ticket.id === id);
        if (ticketToUpdate) {
          setClickedPoints((prev) =>
            prev.filter(
              (point) =>
                point.x !== ticketToUpdate.xCord ||
                point.y !== ticketToUpdate.yCord
            )
          );

          // Decrement clickCount and usedTickets in one go
          setClickCount((prevClickCount) => prevClickCount - 1);
          setUsedTickets((prevUsedTickets) => prevUsedTickets - 1);
        }
        Swal.fire("Deleted!", "The Coordinates has been removed.", "success");
      } else {
        Swal.fire("Cancelled", "Your Coordinates is safe.", "error");
      }
    });
  };

  const handleMouseMove = (e) => {
    const image = e.target;
    const rect = image.getBoundingClientRect();

    // Calculate the X and Y position relative to the displayed image
    const xRelative = e.clientX - rect.left;
    const yRelative = e.clientY - rect.top;

    // Map the coordinates to the original image dimensions
    const x = ((xRelative / rect.width) * image.naturalWidth).toFixed(2);
    const y = ((yRelative / rect.height) * image.naturalHeight).toFixed(2);

    setCoordinates({ x, y });
  };

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleClick = (e) => {
    setColorIndex(responseData.cursor_color);
    // Check if the user has used all their chances
    if (clickCount >= totalTickets) {
      alert("You've used all your tickets. Click '+' to add more.");
      return;
    }

    const image = e.target;
    const rect = image.getBoundingClientRect(); // Get the image position and size in the viewport

    // Get the relative position of the click within the image
    const xRelative = e.clientX - rect.left; // X coordinate relative to the image
    const yRelative = e.clientY - rect.top; // Y coordinate relative to the image

    // Calculate the click's position based on the image's natural size
    const x = ((xRelative / rect.width) * image.naturalWidth).toFixed(2); // X based on image's intrinsic width
    const y = ((yRelative / rect.height) * image.naturalHeight).toFixed(2); // Y based on image's intrinsic height

    const updatedTickets = [...tickets];

    // Find a ticket with empty coordinates
    const ticketIndex = updatedTickets.findIndex(
      (ticket) => ticket.xCord === "____" && ticket.yCord === "____"
    );

    if (ticketIndex !== -1) {
      // Update the ticket's coordinates
      updatedTickets[ticketIndex] = {
        ...updatedTickets[ticketIndex],
        xCord: x,
        yCord: y,
      };

      // Update state
      setTickets(updatedTickets);
      setClickedPoints((prev) => [...prev, { x, y }]);
      setClickCount((prev) => prev + 1); // Increment clickCount

      // Only now increment usedTickets, since a ticket is now fully filled
      setUsedTickets((prev) => prev + 1);
    } else {
      alert("All tickets are already filled.");
    }
  };

  const handleCheckout = async () => {
    const contest_id = responseData._id;
    const usedTicketCoordinates = tickets
      .filter((ticket) => ticket.xCord !== "____" && ticket.yCord !== "____")
      .map((ticket) => ({
        x: ticket.xCord,
        y: ticket.yCord,
      }));

    const values = {
      contest_id,
      tickets_count: usedTickets,
      user_coordinates: usedTicketCoordinates,
    };

    try {
      const token = localStorage.getItem("Web-token");
      const response = await axios.post("app/contest/add-to-cart", values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: response.data.message,
        showConfirmButton: false,
        allowOutsideClick: false,
        timer: 2000,
      });

      navigate("/cart");
    } catch (error) {
      console.error(
        "failed:",
        error.response ? error.response.data : error.message
      );

      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response ? error.response.data.message : error.message,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    }
  };

  return (
    <>
      <section className="playgame_section">
        <div className="container contfld_playgame">
          <div className="row rowmain_playgame">
            <div className="col-md-8 col9playgame_mainscreen">
              <div
                className="gamescreenimg_right"
                style={{ position: "relative" }}
              >
                <img
                  ref={imgRef}
                  src={responseData?.player_image?.file_url || ""}
                  onMouseMove={handleMouseMove}
                  onClick={handleClick}
                  onLoad={handleImageLoad}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    cursor: "crosshair",
                    display: "block",
                    position: "relative",
                  }}
                  alt="Player"
                />

                {clickedPoints.map((point, index) => (
                  <div
                    key={index}
                    style={{
                      position: "absolute",
                      left: `${
                        (point.x / imgRef.current.naturalWidth) *
                        imgRef.current.clientWidth
                      }px`,
                      top: `${
                        (point.y / imgRef.current.naturalHeight) *
                        imgRef.current.clientHeight
                      }px`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <RxCross2
                      style={{
                        color: colorIndex,
                        fontSize: "40px",
                      }}
                    />
                  </div>
                ))}

                {showTooltip && (
                  <div
                    style={{
                      position: "absolute",
                      left: `${
                        (coordinates.x / imgRef.current.naturalWidth) *
                        imgRef.current.clientWidth
                      }px`,
                      top: `${
                        (coordinates.y / imgRef.current.naturalHeight) *
                        imgRef.current.clientHeight
                      }px`,
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                      color: "#fff",
                      pointerEvents: "none",
                      transform: "translate(-50%, -100%)", // Slightly above the cursor
                    }}
                  >
                    <p>
                      (X: {coordinates.x}, Y: {coordinates.y})
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-4 col3ticketscontest">
              <div className="ticketaxis_div">
                <div className="ticketheading">
                  <h3>Tickets</h3>
                </div>
                <div className="actionicon_btn">
                  <div
                    className="threeicons_action footer_howtoplayfaqlink"
                    onClick={open}
                  >
                    <div className="the_icon">
                      <img
                        src={`${process.env.PUBLIC_URL}/images/user_guide_icon.png`}
                      />
                    </div>

                    <p>Video</p>
                  </div>
                  <div className="threeicons_action" onClick={handleTicket}>
                    <div className="the_icon">
                      <img
                        src={`${process.env.PUBLIC_URL}/images/ticket_icon.png`}
                        alt="Add Ticket"
                      />
                    </div>
                    <p>Ticket</p>
                  </div>
                  <div className="threeicons_action" onClick={handleRefreshAll}>
                    <div className="the_icon">
                      <img
                        src={`${process.env.PUBLIC_URL}/images/refresh_icon.png`}
                        alt="Refresh"
                      />
                    </div>

                    <p>Refresh All</p>
                  </div>
                </div>
                <div className="ticketcount_div">
                  <div className="countoftotalticket">
                    <span className="usedticket">{usedTickets}</span>/
                    <span className="totalticket">{totalTickets}</span>
                  </div>
                </div>
                <div className="allticketmaindiv_contest">
                  {tickets.map((ticket) => (
                    <div className="contestticketdiv_main" key={ticket.id}>
                      <div className="contest_cordinates_div">
                        <div className="contestprice_tickets">
                          <div className="pricewithcontest">
                            <h3>
                              ₹
                              {Number(
                                responseData.jackpot_price
                              ).toLocaleString()}{" "}
                              Contest
                            </h3>
                          </div>
                          <div className="usedticket_withcheck">
                            <p className="ticketallforuse">
                              <span className="used">{ticket.id}</span>/
                              <span className="total">{totalTickets}</span>
                            </p>
                            <div className="checkuncheckdiv">
                              {ticket.xCord &&
                              ticket.yCord &&
                              ticket.xCord > 0 &&
                              ticket.yCord > 0 ? (
                                <img
                                  src={`${process.env.PUBLIC_URL}/images/cord_check.png`}
                                  alt="Checked"
                                />
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <div className="setcordinates">
                          <h4 className="maincordinates">
                            <span className="x-cord">X: {ticket.xCord}</span>,{" "}
                            <span className="y-cord">Y: {ticket.yCord}</span>
                          </h4>
                        </div>
                        <div className="contestaction_div">
                          <div className="cord_actiondiv">
                            <div
                              className="actionicondiv"
                              onClick={() => handleReply(ticket.id)}
                            >
                              <img
                                src={`${process.env.PUBLIC_URL}/images/refresh_cord.png`}
                              />
                            </div>
                            <p className="actionheading">Replay</p>
                          </div>
                          <div className="cord_actiondiv">
                            <div
                              className="actionicondiv"
                              onClick={handleAddTicket}
                            >
                              <img
                                src={`${process.env.PUBLIC_URL}/images/add_cord.png`}
                                alt="Add"
                              />
                            </div>
                            <p className="actionheading">Add</p>
                          </div>
                          <div className="cord_actiondiv">
                            <div
                              className="actionicondiv"
                              onClick={() => handleDeleteTicket(ticket.id)}
                            >
                              <img
                                src={`${process.env.PUBLIC_URL}/images/delete_cord.png`}
                              />
                            </div>
                            <p className="actionheading">Delete</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="ticketcheckout_btn">
                  <button
                    onClick={handleCheckout}
                    className="bottomcheckoutbtn"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                      // src="images/cross_icon.png"
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

export default Screen;
