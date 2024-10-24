import React from 'react'

function Circle() {
  return (
    <>
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
                  <select>
                    <option>2025</option>
                    <option>2024</option>
                    <option>2023</option>
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
                <div className="timeline-article onlyforfisrtchild">
                  <div className="content-left-container">
                    <div className="row rowforwinner_boxes">
                      <div className="col-md-12 colmainwinnerbox">
                        <div className="jackpotwinner_div">
                          <div className="winnercrclimg">
                            <img
                              src={`${process.env.PUBLIC_URL}/images/winner_img.png`}
                              // src="images/winner_img.png"
                            />
                          </div>
                          <div className="winnerabouttext">
                            <h3>SHASHWAT KHATTRI</h3>
                            <p>Jackpot March 06, 2024</p>
                            <h4>₹1,50,000</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="monthwithyear_text">Aug 2024</div>
                  </div>
                  <div className="meta-date" />
                </div>
                <div className="timeline-article">
                  <div className="content-right-container">
                    <div className="row rowforwinner_boxes">
                      <div className="col-md-12 colmainwinnerbox">
                        <div className="jackpotwinner_div">
                          <div className="winnercrclimg">
                            <img
                              src={`${process.env.PUBLIC_URL}/images/winner_img.png`}
                              // src="images/winner_img.png"
                            />
                          </div>
                          <div className="winnerabouttext">
                            <h3>RAVI</h3>
                            <p>Jackpot March 06, 2024</p>
                            <h4>₹1,50,000</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="monthwithyear_text">July 2024</div>
                  </div>
                  <div className="meta-date" />
                </div>
                <div className="timeline-article">
                  <div className="content-left-container">
                    <div className="row rowforwinner_boxes">
                      <div className="col-md-6 colmainwinnerbox">
                        <div className="jackpotwinner_div">
                          <div className="winnercrclimg">
                            <img
                              src={`${process.env.PUBLIC_URL}/images/winner_img2.png`}
                              // src="images/winner_img2.png"
                            />
                          </div>
                          <div className="winnerabouttext">
                            <h3>Subbiah T</h3>
                            <p>Jackpot March 06, 2024</p>
                            <h4>₹1,50,000</h4>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 colmainwinnerbox">
                        <div className="jackpotwinner_div">
                          <div className="winnercrclimg">
                            <img
                              src={`${process.env.PUBLIC_URL}/images/winner_img2.png`}
                              // src="images/winner_img2.png"
                            />
                          </div>
                          <div className="winnerabouttext">
                            <h3>Subbiah T</h3>
                            <p>Jackpot March 06, 2024</p>
                            <h4>₹1,50,000</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="monthwithyear_text">June 2024</div>
                  </div>
                  <div className="meta-date" />
                </div>
                <div className="timeline-article">
                  <div className="content-right-container">
                    <div className="row rowforwinner_boxes">
                      <div className="col-md-6 colmainwinnerbox">
                        <div className="jackpotwinner_div">
                          <div className="winnercrclimg">
                            <img
                              src={`${process.env.PUBLIC_URL}/images/winner_img2.png`}
                              // src="images/winner_img2.png"
                            />
                          </div>
                          <div className="winnerabouttext">
                            <h3>Subbiah T</h3>
                            <p>Jackpot March 06, 2024</p>
                            <h4>₹1,50,000</h4>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 colmainwinnerbox">
                        <div className="jackpotwinner_div">
                          <div className="winnercrclimg">
                            <img
                              src={`${process.env.PUBLIC_URL}/images/winner_img2.png`}
                              // src="images/winner_img2.png"
                            />
                          </div>
                          <div className="winnerabouttext">
                            <h3>Subbiah T</h3>
                            <p>Jackpot March 06, 2024</p>
                            <h4>₹1,50,000</h4>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 colmainwinnerbox">
                        <div className="jackpotwinner_div">
                          <div className="winnercrclimg">
                            <img
                              src={`${process.env.PUBLIC_URL}/images/winner_img.png`}
                              // src="images/winner_img.png"
                            />
                          </div>
                          <div className="winnerabouttext">
                            <h3>Subbiah T</h3>
                            <p>Jackpot March 06, 2024</p>
                            <h4>₹1,50,000</h4>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 colmainwinnerbox">
                        <div className="jackpotwinner_div">
                          <div className="winnercrclimg">
                            <img
                              src={`${process.env.PUBLIC_URL}/images/winner_img2.png`}
                              // src="images/winner_img2.png"
                            />
                          </div>
                          <div className="winnerabouttext">
                            <h3>Subbiah T</h3>
                            <p>Jackpot March 06, 2024</p>
                            <h4>₹1,50,000</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="monthwithyear_text">May 2024</div>
                  </div>
                  <div className="meta-date" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Circle
