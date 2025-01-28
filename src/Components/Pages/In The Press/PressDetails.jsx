import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function PressDetails() {
  const { id } = useParams(); // Fetch the article ID from the URL
  const [article, setArticle] = useState(null); // State to store article data
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `app/press/get-press-by-id?press_id=${id}`
        ); // Replace with your API URL
        setArticle(response.data.data);
        // console.log("Article Data: ", response.data.data);
      } catch (err) {
        setError("Failed to load article.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>; // Loading message
  }

  if (error) {
    return <div>{error}</div>; // Error message
  }

  if (!article) {
    return <div>No article found.</div>; // Handle case where no article is found
  }

  return (
    <section className="maincont_section">
      <div className="container contforinner_mainheading">
        <div className="row rowmainheading_inner">
          <div className="col-md-12 colmainheading_innerpages">
            <div className="pageheading_main">
              <h2 className="text-left">{article.title}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="container pressempty_cont">
        <div className="col-md-12 col12pressemptyscreen">
          <div className="row rowpressemptymain">
            <div className="mb-1">
              <div className="emptypresstext image-press">
                <img
                  src={article.press_banner}
                  alt="Press Banner"
                  className="w-100 mb-3"
                />
              </div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: article.description }} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default PressDetails;
