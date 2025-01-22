import React, { useState } from "react";
import LocationSettingPopup from "./LocationSettingPopup";

const GameDenyPopup = ({ onCancel }) => {
  const [showLocationSettingPopup, setShowLocationSettingPopup] =
    useState(false);

  const handleKnowMore = () => {
    setShowLocationSettingPopup(true); // Show the LocationSettingPopup
  };

  const handleCloseLocationPopup = () => {
    setShowLocationSettingPopup(false);
  };

  return (
    <>
      {!showLocationSettingPopup ? (
        <div
          className="geolocationmaindiv gamedenypopup"
          style={{ display: "block" }}
        >
          <div className="popupdivfor_grolocation">
            <div className="locationwantsdiv">
              <div className="locationicondiv">
                <img
                  src={`${process.env.PUBLIC_URL}/images/unvailable_icon.png`}
                  // src="images/unvailable_icon.png"
                  alt="Unavailable Icon"
                />
              </div>
              <div className="locationtextwithheading">
                <h2>Location Access Required</h2>
                <p>
                  To play SpotsBall, you need to enable location services.
                  Please allow access to your location.
                </p>
              </div>
              <div className="locationactionbtndiv">
                <div className="coutionactionbtn">
                  <button
                    type="button"
                    className="cnclbtn_coution"
                    onClick={onCancel}
                  >
                    Cancel
                  </button>
                </div>
                <div className="coutionactionbtn">
                  <button
                    type="button"
                    className="knowmorebtn_coution"
                    onClick={handleKnowMore}
                  >
                    Know More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <LocationSettingPopup onCancles={handleCloseLocationPopup} />
      )}
    </>
  );
};

export default GameDenyPopup;
