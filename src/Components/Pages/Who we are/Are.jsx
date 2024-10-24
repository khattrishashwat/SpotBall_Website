import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../../Loader/Loader";

function Are() {
  const [whos, setWhos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWho = async () => {
    const token = localStorage.getItem("token");
    try {
      setIsLoading(true);
      const response = await axios.get("/get-all-static-content/who_we_are", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.data) {
        console.log("Fetched ", response.data.data);
        setWhos(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWho();
  }, []);

  return (
    <>
      <section className="maincont_section">
        {isLoading ? (
          <Loader /> 
        ) : (
          <div className="container contforinner_mainheading">
            <div className="row rowmainheading_inner">
              <div className="col-md-12 colmainheading_innerpages">
                <div className="pageheading_main">
                  <h2>{whos[0]?.title || ""}</h2>
                </div>
              </div>
            </div>
            <div className="container cont_maindata_inner_aboutus">
              <div className="row rowmaindatainner_aboutus">
                <div className="col-md-8 colaboutusdiv_inner">
                  <div className="aboutusdiv_text">
                    <h3>{whos[0]?.subTitle || ""}</h3>
                    <p>{whos[0]?.description}</p>
                  </div>
                </div>
                <div className="col-md-4 col4aboutus_imgdiv">
                  <div className="about_img">
                    <img src={whos[0]?.images || ""} alt="About Us" />
                  </div>
                </div>
              </div>
              <div className="row rowmaindatainner_aboutus">
                <div className="col-md-4 col4aboutus_imgdiv">
                  <div className="about_img">
                    <img src={whos[1]?.images} alt="Cricket Passion" />
                  </div>
                </div>
                <div className="col-md-8 colaboutusdiv_inner">
                  <div className="aboutusdiv_text">
                    <h3>{whos[1]?.subTitle}</h3>
                    <p>{whos[1]?.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default Are;
