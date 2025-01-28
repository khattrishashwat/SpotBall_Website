import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader/Loader";

function Press() {
  const [isLoading, setIsLoading] = useState(false);
  const [press, setPress] = useState([]);
  const navigate = useNavigate();

  // Function to generate a URL-friendly slug from the title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-"); // Replace multiple hyphens with a single hyphen
  };

  const handleArticleClick = (id, title) => {
    const slug = generateSlug(title);
    navigate(`/press-details/${id}/${slug}`);
  };

  const fetchPress = async () => {
    const token = localStorage.getItem("Web-token");
    try {
      setIsLoading(true);
      const response = await axios.get("app/press/get-press", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.data) {
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

  return (
    <section className="maincont_section">
      <div className="container contforinner_mainheading">
        <div className="row rowmainheading_inner">
          <div className="col-md-12 colmainheading_innerpages">
            <div className="pageheading_main">
              <h2>Trending Articles </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="container cont_inthepress">
        {isLoading ? (
          <Loader />
        ) : press.length > 0 ? (
          <div className="row inthepress_mainrow">
            {press.map((pressItem, index) => {
              const words = pressItem.description.split(" ").slice(0, 30);
              const shortDescription =
                words.join(" ") + (words.length >= 30 ? "..." : "");

              return (
                <div className="col-md-4 col4pressdi" key={pressItem._id}>
                  <div className="inthepressdivmain">
                    <img
                      src={pressItem.press_banner}
                      alt="In the Press"
                      className="press-banner-image"
                    />
                    <p
                      dangerouslySetInnerHTML={{ __html: shortDescription }}
                    ></p>
                    <a
                      className="seefullarticle_btn"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleArticleClick(pressItem._id, pressItem.title)
                      }
                    >
                      Read Full Article
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="row inthepress_mainrow">
            <div className="no-data-message">No Press Found</div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Press;
