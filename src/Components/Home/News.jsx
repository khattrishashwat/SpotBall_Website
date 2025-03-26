import React from "react";
import { Link } from "react-router-dom";

function News({ data }) {
  if (!data || !data.news) {
    return null;
  }

  const newsList = data.news.slice(0, 5);

  return (
    <section className="space-ptb latest-news-players-rank">
      <img className="pattern-4" src="images/home-04/pattern-04.png" alt="" />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-title text-center">
              <h2 className="mb-0">
                SpotsBall <span>News</span>
              </h2>
            </div>
          </div>
        </div>
        <div className="row mt-4">
          {/* First Column */}
          <div className="col-xl-4 col-lg-6 col-md-6 mb-4 mb-xl-0">
            {newsList.slice(0, 2).map((news) => (
              <div key={news._id} className="blog-post post-style-04 mb-4">
                <div className="blog-image">
                  <img
                    className="img-fluid"
                    src={news.press_banner}
                    alt={news.title}
                  />
                  <div className="blog-post-details">
                    <h5 className="blog-title">
                      <Link
                        to={news.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {news.title}
                      </Link>
                    </h5>
                    <Link
                      to={news.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-link"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Second Column */}
          <div className="col-xl-4 col-lg-6 col-md-6 mb-4 mb-xl-0">
            {newsList.slice(2, 3).map((news) => (
              <div key={news._id} className="blog-post post-style-04">
                <div className="blog-image long">
                  <img
                    className="img-fluid"
                    src={news.press_banner}
                    alt={news.title}
                  />
                  <div className="blog-post-details">
                    <h5 className="blog-title">
                      <Link
                        to={news.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {news.title}
                      </Link>
                    </h5>
                    <Link
                      to={news.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-link"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Third Column */}
          <div className="col-xl-4 col-lg-6 col-md-6 mb-4 mb-xl-0">
            {newsList.slice(3, 5).map((news) => (
              <div key={news._id} className="blog-post post-style-04 mb-4">
                <div className="blog-image">
                  <img
                    className="img-fluid"
                    src={news.press_banner}
                    alt={news.title}
                  />
                  <div className="blog-post-details">
                    <h5 className="blog-title">
                      <Link
                        to={news.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {news.title}
                      </Link>
                    </h5>
                    <Link
                      to={news.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-link"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default News;
