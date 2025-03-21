import React, { useState, useEffect } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

function Circle() {
  const [links, setLinks] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);
  useEffect(() => {
    const fetchLinks = async () => {
      const token = localStorage.getItem("Web-token");
      try {
        const response = await axios.get(
          `app/contest/the-winners-circle/?year=${year}&month=${month}`,
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
  }, [year, month]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const groupByMonth = (data) => {
    return data.reduce((acc, item) => {
      const date = new Date(item.createdAt);
      const monthYear = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      if (!acc[monthYear]) acc[monthYear] = [];
      acc[monthYear].push(item);
      return acc;
    }, {});
  };

  const groupedLinks = groupByMonth(links);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleString("default", {
      month: "long",
    })} ${date.getDate()}, ${date.getFullYear()}`;
  };

  // Generate dynamic year options
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear + i);

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
              {/* Year Filter */}
              <div className="dropdownfilter yearlyfilte">
                <select value={year} onChange={(e) => setYear(e.target.value)}>
                  {Array.from({ length: 1 }, (_, index) => {
                    const currentYear = new Date().getFullYear();
                    return (
                      <option key={index} value={currentYear - index}>
                        {currentYear - index}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Month Filter */}
              <div className="dropdownfilter monthlyfilte">
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  <option value="">Select Month</option>
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="row winnercirlce_timeline_row">
          <div id="winner_circle-timeline">
            {Object.keys(groupedLinks)?.length === 0 ? (
              <div
                className="no-data-message"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                No data available on selected filter
              </div>
            ) : (
              <>
                <div className="winner_circle-center-line" data-aos="zoom-in" />
                <div
                  className="winner_circle-timeline-content"
                  data-aos="fade-right"
                >
                  {Object.keys(groupedLinks).map((monthYear) => (
                    <div
                      key={monthYear}
                      data-aos="fade-up"
                      data-aos-delay="300"
                    >
                      {groupedLinks[monthYear].map((item, index) => {
                        const isFirstChild = index === 0;
                        return (
                          <div
                            className={`timeline-article ${
                              isFirstChild ? "onlyforfisrtchild" : ""
                            }`}
                            key={item.id}
                            data-aos="fade-left"
                            data-aos-duration="1500"
                          >
                            <div
                              className={
                                index % 2 === 0
                                  ? "content-left-container"
                                  : "content-right-container"
                              }
                            >
                              <div className="row rowforwinner_boxes">
                                <div className="col-md-12 colmainwinnerbox">
                                  <div
                                    className="jackpotwinner_div"
                                    data-aos="zoom-in"
                                  >
                                    <div className="winnercrclimg">
                                      <img
                                        src={
                                          item?.userId?.profile_url ||
                                          `${process.env.PUBLIC_URL}/images/winner_img.png`
                                        }
                                        alt={`${item?.userId?.first_name} ${item.userId?.last_name}`}
                                        data-aos="flip-left"
                                      />
                                    </div>
                                    <div className="winnerabouttext">
                                      <h3>
                                        {`${item?.userId?.first_name} ${item?.userId?.last_name}`.toUpperCase()}
                                      </h3>
                                      <p>{`Jackpot ${formatDate(
                                        item?.createdAt
                                      )}`}</p>
                                      <p>
                                        Winning Coordinates:{" "}
                                        {`X: ${item?.contestId?.winning_coordinates?.x}, Y: ${item?.contestId?.winning_coordinates?.y}`}
                                      </p>
                                      <p>
                                        Closest Coordinate:{" "}
                                        {`X: ${item?.closestCoordinate?.x}, Y: ${item?.closestCoordinate?.y}`}
                                      </p>
                                      <h4>{`₹${item?.prize.toLocaleString(
                                        "en-IN"
                                      )}`}</h4>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div
                                className="monthwithyear_text"
                                data-aos="fade-down"
                              >
                                {monthYear}
                              </div>
                            </div>
                            <div className="meta-date" />
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Circle;
