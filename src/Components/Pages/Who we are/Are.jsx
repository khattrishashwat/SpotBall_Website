import React from 'react'

function Are() {
  return (
    <>
      <section className="maincont_section">
        <div className="container contforinner_mainheading">
          <div className="row rowmainheading_inner">
            <div className="col-md-12 colmainheading_innerpages">
              <div className="pageheading_main">
                <h2>Who We Are?</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="container cont_maindata_inner_aboutus">
          <div className="row rowmaindatainner_aboutus">
            <div className="col-md-8 colaboutusdiv_inner">
              <div className="aboutusdiv_text">
                <h3>About Us</h3>
                <p>
                  SpotsBall is a legally incorporated Indian company (SpotsBall
                  Indian Pvt. Ltd.), with its operations based in Delhi. Every
                  day our senior managers, technical support and help desk team
                  work to make sure that SpotsBall is anenjoyable and fun
                  on-line gaming experience for everyone to enjoy.{" "}
                </p>
              </div>
            </div>
            <div className="col-md-4 col4aboutus_imgdiv">
              <div className="about_img">
                <img
                  src={`${process.env.PUBLIC_URL}/images/about_us.png`}
                  // src="images/about_us.png"
                />
              </div>
            </div>
          </div>
          <div className="row rowmaindatainner_aboutus">
            <div className="col-md-4 col4aboutus_imgdiv">
              <div className="about_img">
                <img
                  src={`${process.env.PUBLIC_URL}/images/cricket_passion.png`}
                  // src="images/cricket_passion.png"
                />
              </div>
            </div>
            <div className="col-md-8 colaboutusdiv_inner">
              <div className="aboutusdiv_text">
                <h3>Our Cricket Passion</h3>
                <p>
                  Everyone at SpotsBall loves cricket; it’s the national sport
                  of our country! We all grew up following and playing the game,
                  and are passionate about our favorite teams and players. As
                  game developers, that’s why we chose cricket as the sport for
                  our new SpotsBall game. What about football, or field hockey?
                  Maybe in the future SpotsBall will look at these applications.
                  Sure, a SpotsBall game can be created for these games too -
                  but we needed to choose one sport to launch SpotsBall in
                  India, and cricket was the unanimous choice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Are;
