import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import Swal from "sweetalert2";

function Screen() {
  const navigate = useNavigate();

  const location = useLocation();
  const { quantity, responseData } = location.state.payload || {};

  const [usedTickets, setUsedTickets] = useState(0);
  const [totalTickets, setTotalTickets] = useState(
    responseData.ticket_limit || ""
  );
  const [tickets, setTickets] = useState([]);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [clickedPoints, setClickedPoints] = useState([]);
  const [clickCount, setClickCount] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleAddTicket = () => {
    if (usedTickets < totalTickets) {
      const newTicket = {
        id: usedTickets + 1,
        xCord: "____",
        yCord: "____",
      };
      setTickets((prev) => [...prev, newTicket]);
      setUsedTickets((prev) => prev + 1);
    } else {
      // Use a toast notification here instead of alert
      alert("No more tickets available.");
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
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id ? { ...ticket, xCord: "____", yCord: "____" } : ticket
      )
    );
  };

  const handleMouseMove = (e) => {
    setCoordinates({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    });
  };

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleClick = (e) => {
    if (clickCount >= quantity) {
      alert("You have used all your chances.");
      return;
    }

    const image = e.target;
    const rect = image.getBoundingClientRect();
    const x = (e.clientX - rect.left).toFixed(2); // Format to two decimal places
    const y = (e.clientY - rect.top).toFixed(2); // Format to two decimal places

    const updatedTickets = [...tickets];
    const ticketIndex = updatedTickets.findIndex(
      (ticket) => ticket.xCord === "____" && ticket.yCord === "____"
    );

    if (ticketIndex !== -1) {
      updatedTickets[ticketIndex] = {
        xCord: x,
        yCord: y,
        id: updatedTickets[ticketIndex].id,
      }; // Maintain ticket ID
      setTickets(updatedTickets);
      setClickedPoints((prev) => [...prev, { x, y }]);
      setClickCount((prev) => prev + 1);
    } else {
      alert("All tickets are already filled.");
    }
  };

  const handleCheckout = async () => {
    const contest_id = responseData._id; // Assuming responseData has concertId
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
    console.log("ceckied--", values);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("add-to-cart", values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response:", response.data);

      Swal.fire({
        icon: "success",
        title: response.data.message,
        showConfirmButton: false,
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
      });
    }
  };

  return (
    <>
      <section className="playgame_section">
        <div className="container contfld_playgame">
          <div className="row rowmain_playgame">
            <div className="col-md-8 col9playgame_mainscreen">
              <div className="gamescreenimg_right">
                <img
                  src={responseData?.player_image?.file_url || ""}
                  onMouseMove={handleMouseMove}
                  onClick={handleClick}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  style={{ cursor: "crosshair" }}
                  alt="Player"
                />
                {clickedPoints.map((point, index) => (
                  <div
                    key={index}
                    style={{
                      position: "absolute",
                      left: `${parseFloat(point.x).toFixed(2)}px`,
                      top: `${parseFloat(point.y).toFixed(2)}px`,
                    }}
                  >
                    <RxCross2
                      style={{
                        color: "black",
                        fontSize: "30px",
                        position: "absolute",
                      }}
                    />
                  </div>
                ))}
                {showTooltip && (
                  <div
                    style={{
                      position: "absolute",
                      left: coordinates.x + 10, // Offset for visibility
                      top: coordinates.y + 10, // Offset for visibility
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                      color: "#fff",
                      padding: "1px 1px",
                      pointerEvents: "none",
                    }}
                  >
                    <p>
                      ({"X-" + coordinates.x}, {"Y-" + coordinates.y})
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
                  <div className="threeicons_action footer_howtoplayfaqlink">
                    <img
                      src={`${process.env.PUBLIC_URL}/images/user_guide_icon.png`}
                    />
                  </div>
                  <div className="threeicons_action" onClick={handleAddTicket}>
                    <img
                      src={`${process.env.PUBLIC_URL}/images/ticket_icon.png`}
                      alt="Add Ticket"
                    />
                  </div>
                  <div className="threeicons_action" onClick={handleRefreshAll}>
                    <img
                      src={`${process.env.PUBLIC_URL}/images/refresh_icon.png`}
                      alt="Refresh"
                    />
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
                            <h3>₹{responseData.jackpot_price} Contest</h3>
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
                            <div className="actionicondiv">
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
    </>
  );
}

export default Screen;
