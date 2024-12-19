import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../../Loader/Loader";
function Press() {
  const [isLoading, setIsLoading] = useState("");
  const [press, setPress] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);

  const fetchPress = async () => {
    const token = localStorage.getItem("Web-token");
    try {
      setIsLoading(true);
      const response = await axios.get("get-press", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.data) {
        console.log("Fetched ", response.data.data);
        setPress(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching :", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPress();
  }, []);

  const toggleDescription = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const truncateDescription = (description, index) => {
    const words = description.split(" ");
    if (words.length > 36) {
      return (
        <>
          {expandedIndex === index
            ? description
            : words.slice(0, 36).join(" ") + "..."}
          <button
            onClick={() => toggleDescription(index)}
            className="see-more-btn"
          >
            {expandedIndex === index ? "See Less" : "See More"}
          </button>
        </>
      );
    }
    return description;
  };

  return (
    <>
      <section className="maincont_section">
        <div className="container contforinner_mainheading">
          <div className="row rowmainheading_inner">
            <div className="col-md-12 colmainheading_innerpages">
              <div className="pageheading_main">
                <h2>In The Press</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="container cont_inthepress">
          {isLoading ? (
            <Loader />
          ) : press && press.length > 0 ? (
            <div className="row inthepress_mainrow">
              {press.map((pressItem, index) => (
                <div className="col-md-4 col4pressdi" key={index}>
                  <div className="inthepressdivmain">
                    <img
                      src={pressItem.press_banner}
                      alt="In the Press"
                      className="press-banner-image"
                    />
                    <p>{truncateDescription(pressItem.description, index)}</p>
                    <a
                      href={pressItem.link}
                      className="seefullarticle_btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      See Full Article
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="row inthepress_mainrow">
              <div className="no-data-message">No Press Found</div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Press;
