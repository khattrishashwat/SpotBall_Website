// GeolocationPopup.js
import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import GameDenyPopup from "./GameDenyPopup";
import GameUnavailablePopup from "./GameUnavailablePopup";
import LocationSettingPopup from "./LocationSettingPopup";

const GeolocationPopup = ({ contests, onClose }) => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isUnavailablePopupVisible, setUnavailablePopupVisible] =
    useState(false);
  const [showLocationSettingPopup, setShowLocationSettingPopup] =
    useState(false);

  const handleCancel = () => {
    setPopupVisible(false);
  };

  const handleKnowMore = () => {
    setShowLocationSettingPopup(true);
  };

  const handleAllow = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Latitude:", latitude, "Longitude:", longitude);

          try {
            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAZayBd_1QMbIZpRgTc9-QDvtrmuA-w-xI`
            );

            // Check if the results array exists and has at least one item
            if (response.data.results && response.data.results.length > 0) {
              const addressComponents =
                response.data.results[0].address_components || [];
              let stateName = "";
              let countryName = "";

              // Check that addressComponents is defined and an array
              if (Array.isArray(addressComponents)) {
                addressComponents.forEach((component) => {
                  if (component.types.includes("administrative_area_level_1")) {
                    stateName = component.long_name;
                  }
                  if (component.types.includes("country")) {
                    countryName = component.long_name;
                  }
                });
              }

              console.log(
                "State Name:",
                stateName,
                "Country Name:",
                countryName
              );

              const { restrictedStates } = contests || { restrictedStates: [] };

              if (
                Array.isArray(restrictedStates) &&
                (restrictedStates.some(
                  (restrictedState) => restrictedState === stateName
                ) ||
                  restrictedStates.some(
                    (restrictedState) => restrictedState === countryName
                  ))
              ) {
                setUnavailablePopupVisible(true);
                localStorage.removeItem("token");
              } else {
                localStorage.setItem(
                  "location",
                  JSON.stringify({ stateName, countryName })
                );
                console.log("location", stateName, countryName);
                onClose();
              }
            } else {
              console.error("No results found in geocode response.");
              onClose(); // Optionally handle this case
            }
          } catch (error) {
            console.error("Error fetching geocode:", error);
            onClose(); // Ensure onClose is defined
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setShowLocationSettingPopup(true);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleCloseLocationPopup = () => {
    setShowLocationSettingPopup(false); // Close LocationSettingPopup
  };

  const handleDeny = () => {
    setPopupVisible(true);
    // onClose();
  };

  const handleUnavailableOk = () => {
    setUnavailablePopupVisible(false); // Close GameUnavailablePopup
  };

  return (
    <>
      <div
        className="geolocationmaindiv enablelocationdiv_popup"
        style={{ display: "block" }}
      >
        <div className="popupdivfor_grolocation">
          <div className="locationwantsdiv">
            <div className="locationicondiv">
              <img src="images/location_icon.png" alt="Location Icon" />
            </div>
            <div className="locationtextwithheading">
              <h2>Enable Location Services</h2>
              <p>
                We need to access your location to ensure you're in a region
                where SpotsBall is available.
              </p>
            </div>
            <div className="locationactionbtndiv">
              <div className="denybtndiv actionbtn_loc">
                <button
                  type="button"
                  className="denybtn loc_btn"
                  onClick={handleDeny}
                >
                  Deny
                </button>
              </div>
              <div className="allowbtndiv actionbtn_loc">
                <button
                  type="button"
                  className="allowbtn loc_btn"
                  onClick={handleAllow} // Corrected to call handleAllow
                >
                  Allow
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isPopupVisible && (
        <GameDenyPopup onCancel={handleCancel} onKnowMore={handleKnowMore} />
      )}
      {isUnavailablePopupVisible && (
        <GameUnavailablePopup onOk={handleUnavailableOk} />
      )}
      {showLocationSettingPopup && (
        <LocationSettingPopup onCancles={handleCloseLocationPopup} />
      )}
    </>
  );
};

export default GeolocationPopup;
