import React,{useState,useEffect} from 'react'
import axios from 'axios';


function Are() {
  const [whos,setWhos]=useState('');
  const [isLoading,setIsLoading]=useState('');



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
        console.error("Error fetching :", error);
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
        <div className="container contforinner_mainheading">
          <div className="row rowmainheading_inner">
            <div className="col-md-12 colmainheading_innerpages">
              <div className="pageheading_main">
                <h2>{whos[0]?.title}</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="container cont_maindata_inner_aboutus">
          {whos&&whos.map((item, index) => (
            <div className="row rowmaindatainner_aboutus" key={index}>
              <div className="col-md-8 colaboutusdiv_inner">
                <div className="aboutusdiv_text">
                  <h3>{item.subTitle}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
              <div className="col-md-4 col4aboutus_imgdiv">
                <div className="about_img">
                  <img src={item.images} alt={item.subTitle} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Are;
