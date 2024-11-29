import React,{useState,useEffect} from 'react'
import axios from 'axios';
import Loader from '../../Loader/Loader';
function Press() {
  const [isLoading,setIsLoading]=useState('');
  const [press,setPress]=useState('');

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
      }finally{
        setIsLoading(false);
      }
    };

    useEffect(() => {
      fetchPress();
    }, []);
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
        {/* ============= when press page is empty (start) ============== */}
        {/* <div className="container pressempty_cont" style={{ display: "none" }}>
          <div className="col-md-12 col12pressemptyscreen">
            <div className="row rowpressemptymain">
              <div className="presspageemptydiv">
                <div className="emptypresstext">
                  <h2>
                    Check back here for Stories and Press Coverage about
                    SpotsBall India
                  </h2>
                  <a href="#!" className="seefullartcle_btn">
                    See Full Article
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        {/* ============= when press page is empty (end)  ============== */}
        <div className="container cont_inthepress">
          {isLoading ? (
            <Loader/>
          ) : (
            <div className="row inthepress_mainrow">
              {press &&
                press.map((pressItem, index) => (
                  <div className="col-md-4 col4pressdi" key={index}>
                    <div className="inthepressdivmain">
                      <img src={pressItem.press_banner} alt="In the Press" />{" "}
                      <p>{pressItem.description}</p>{" "}
                      <a href={pressItem.link} className="seefullarticle_btn">
                        See Full Article
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Press;
