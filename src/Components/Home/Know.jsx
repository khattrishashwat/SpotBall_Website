import React,{useState} from "react";

function Know() {
      const [onMondayContest, setOnMondayContest] = useState(false);

  return (
    <>
      
      <div
        className={`contest_main .contest_for_contest ${
          onMondayContest ? "show" : ""
        }`}
        style={{ display: onMondayContest ? "block" : "none" }}
      >
        <div className="contest_newpopup">
          <div className="addtocart_content_popup">
            <div className="contest_maindiv">
              <div className="contesthead">
                <h2>
                  This Week’s Game Is Now Over. The Ticketing Portal is Closed.
                </h2>
              </div>
              <div className="conteststextwithheading">
                {/* <h2>Enable Location Services</h2> */}
                <p>
                  Log in tomorrow MON night at 21:00hrs IST see the live stream
                  announcing the ₹ 50,000 Jackpot Winner.
                </p>
              </div>

              <div className="everymonday_livewatchdiv">
                <div className="watchondiv">
                  <h4>Watch On</h4>
                  {/* {links?.Facebook_Streaming && ( */}
                  <a
                    //   href={links.Facebook_Streaming}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/images/face.png`}
                      alt="Facebook Live"
                    />
                  </a>
                  {/* )} */}
                  {/* {links?.Youtube_Streaming && ( */}
                  <a
                    //   href={links.Youtube_Streaming}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/images/you.png`}
                      alt="YouTube Live"
                    />
                  </a>
                  {/* //   )} */}
                </div>
              </div>
              <div className="conteststextwithheading">
                {/* <h2>Enable Location Services</h2> */}
                <p>
                  Log in tomorrow MON night at 2100hrs IST see the live stream
                  announcing the ₹ 50,000 Jackpot Winner.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Know;
