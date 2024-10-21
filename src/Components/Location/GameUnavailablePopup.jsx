import React from 'react'

const GameUnavailablePopup = ({ onOk }) => {
  return (
    <div
      className="geolocationmaindiv gameunavailable_popup"
      style={{ display: "block" }}
    >
      <div className="popupdivfor_grolocation">
        <div className="locationwantsdiv">
          <div className="locationicondiv">
            <img src="images/unvailable_icon.png" alt="Unavailable Icon" />
          </div>
          <div className="locationtextwithheading">
            <h2>Game Unavailable in Your Region</h2>
            <p>
              Sorry, SpotsBall is not available in your current location due to
              local regulations.
            </p>
          </div>
          <div className="locationactionbtndiv">
            <div className="gameunavila_action">
              <button
                type="button"
                className="okbtn_gameunavail"
                onClick={onOk}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameUnavailablePopup
