// import React, { useState, useEffect } from "react";
// import axios from "axios";

// function Circle() {
//   const [links, setLinks] = useState([]);
//   const [year, setYear] = useState("2024");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchLinks = async () => {
//       const token = localStorage.getItem("token");
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await axios.get(
//           `v1/app/contest/the-winners-circle/?year=${year}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setLinks(response.data.data);
//       } catch (err) {
//         setError("Failed to fetch data. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchLinks();
//   }, [year]);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const month = date.toLocaleString("default", { month: "long" });
//     const year = date.getFullYear();
//     return `${month} ${year}`;
//   };

//   return (
//     <section className="maincont_section">
//       <div className="container contforinner_mainheading">
//         <div className="row rowmainheading_inner">
//           <div className="col-md-12 colmainheading_innerpages">
//             <div className="pageheading_main">
//               <h2>The Winners Circle</h2>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container contmain_winnercircle">
//         <div className="row rowwinnercircle_filter">
//           <div className="col-md-12 col12filterwinner">
//             <div className="filterinputdiv_winners">
//               <div className="dropdownfilter yearlyfilte">
//                 <select value={year} onChange={(e) => setYear(e.target.value)}>
//                   <option value="2025">2025</option>
//                   <option value="2024">2024</option>
//                   <option value="2023">2023</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         {loading ? (
//           <p>Loading winners...</p>
//         ) : error ? (
//           <p className="error">{error}</p>
//         ) : (
//           <div className="row winnercirlce_timeline_row">
//             <div id="winner_circle-timeline">
//               <div className="winner_circle-center-line" />
//               <div className="winner_circle-timeline-content">
//                 {links.map((item, index) => {
//                   const isLeftContainer = index % 2 === 0;
//                   const winnerName =
//                     `${item.userId.first_name} ${item.userId.last_name}`.toUpperCase();
//                   const formattedDate = formatDate(item.createdAt);
//                   const formattedPrize = item.prize.toLocaleString("en-IN");
//                   const profileImage =
//                     item.userId.profile_url ||
//                     `${process.env.PUBLIC_URL}/images/winner_img.png`;

//                   return (
//                     <div className="timeline-article" key={item._id}>
//                       <div
//                         className={
//                           isLeftContainer
//                             ? "content-left-container"
//                             : "content-right-container"
//                         }
//                       >
//                         <div className="row rowforwinner_boxes">
//                           <div className="col-md-12 colmainwinnerbox">
//                             <div className="jackpotwinner_div">
//                               <div className="winnercrclimg">
//                                 <img
//                                   src={profileImage}
//                                   alt={`${winnerName}'s profile`}
//                                 />
//                               </div>
//                               <div className="winnerabouttext">
//                                 <h3>{winnerName}</h3>
//                                 <p>Jackpot {formattedDate}</p>
//                                 <h4>₹{formattedPrize}</h4>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="monthwithyear_text">
//                           {formattedDate}
//                         </div>
//                       </div>
//                       <div className="meta-date" />
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

// export default Circle;

import React, { useState, useEffect } from "react";
import axios from "axios";

function Circle() {
  const [links, setLinks] = useState([]);
  const [year, setYear] = useState("2024");
  const [month, setMonth] = useState("");

  useEffect(() => {
    const fetchLinks = async () => {
      const token = localStorage.getItem("Web-token");
      try {
        const response = await axios.get(
          `v1/app/contest/the-winners-circle/?year=${year}&month=${month}`,
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
                  <option value="2028">2028</option>
                  <option value="2027">2027</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>

              {/* Month Filter */}
              <div className="dropdownfilter monthlyfilte">
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  <option value="">
                    Select Month
                  </option>
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
            <div className="winner_circle-center-line" />
            <div className="winner_circle-timeline-content">
              {Object.keys(groupedLinks).length > 0 ? (
                Object.entries(groupedLinks).map(([monthYear, items]) => (
                  <div className="timeline-article" key={monthYear}>
                    <div className="content-right-container">
                      <div className="row rowforwinner_boxes">
                        {items.map((item, index) => {
                          const isLeftContainer = index % 2 === 0;

                          const winnerName =
                            `${item.userId.first_name} ${item.userId.last_name}`.toUpperCase();
                          const formattedDate = formatDate(item.createdAt);
                          const formattedPrize =
                            item.prize.toLocaleString("en-IN");

                          return (
                            <div
                              className={`col-md-6 colmainwinnerbox ${
                                isLeftContainer
                                  ? "content-left-container"
                                  : "content-right-container"
                              }`}
                              key={item._id}
                            >
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
                          );
                        })}
                      </div>
                      <div className="monthwithyear_text">{monthYear}</div>
                    </div>
                    <div className="meta-date" />
                  </div>
                ))
              ) : (
                <p>No data available for the selected filters.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Circle;
