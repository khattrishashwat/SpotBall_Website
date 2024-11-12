import React, { useState, useEffect } from "react";
import axios from "axios";

function Circle() {
  const [links, setLinks] = useState([]);
  const [year, setYear] = useState("2024");

  useEffect(() => {
    const fetchLinks = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `v1/app/contest/the-winners-circle/?year=${year}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLinks(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchLinks();
  }, [year]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  return (
    <section className="maincont_section">
      <div className="container contforinner_mainheading">
        <div className="row rowmainheading_inner">
          <div className="col-md-12 colmainheading_innerpages">
            <div className="pageheading_main">
              <h2>The Winners Circle</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="container contmain_winnercircle">
        <div className="row rowwinnercircle_filter">
          <div className="col-md-12 col12filterwinner">
            <div className="filterinputdiv_winners">
              <div className="dropdownfilter yearlyfilte">
                <select value={year} onChange={(e) => setYear(e.target.value)}>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>
              </div>
              <div className="dropdownfilter monthlyfilte">
                <select>
                  <option>January</option>
                  <option>February</option>
                  <option>March</option>
                  <option>April</option>
                  <option>May</option>
                  <option>June</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="row winnercirlce_timeline_row">
          <div id="winner_circle-timeline">
            <div className="winner_circle-center-line" />
            <div className="winner_circle-timeline-content">
              {links.map((item, index) => {
                const isLeftContainer = index % 2 === 0;
                const winnerName =
                  `${item.userId.first_name} ${item.userId.last_name}`.toUpperCase();
                const formattedDate = formatDate(item.createdAt);
                const formattedPrize = item.prize.toLocaleString("en-IN");

                return (
                  <div className="timeline-article" key={item._id}>
                    <div
                      className={
                        isLeftContainer
                          ? "content-left-container"
                          : "content-right-container"
                      }
                    >
                      <div className="row rowforwinner_boxes">
                        <div className="col-md-12 colmainwinnerbox">
                          <div className="jackpotwinner_div">
                            <div className="winnercrclimg">
                              <img
                                src={
                                  item.userId.profile_url ||
                                  `${process.env.PUBLIC_URL}/images/winner_img.png`
                                }
                                alt={`${winnerName}'s profile`}
                              />
                            </div>
                            <div className="winnerabouttext">
                              <h3>{winnerName}</h3>
                              <p>Jackpot {formattedDate}</p>
                              <h4>₹{formattedPrize}</h4>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="monthwithyear_text">{formattedDate}</div>
                    </div>
                    <div className="meta-date" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Circle;
