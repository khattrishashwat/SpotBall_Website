// GeolocationPopup.js
import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import GameDenyPopup from "./GameDenyPopup";
import GameUnavailablePopup from "./GameUnavailablePopup";
import LocationSettingPopup from "./LocationSettingPopup";

const GeolocationPopup = ({ Area, onClose }) => {
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

  // const handleAllow = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       async (position) => {
  //         const { latitude, longitude } = position.coords;
  //         console.log("Latitude:", latitude, "Longitude:", longitude);

  //         try {
  //           const response = await axios.get(
  //             `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyA8pM5yXTJ3LM8zBF-EkZHEyxlPXSttsl0`
  //           );

  //           // Check if the results array exists and has at least one item
  //           if (response.data.results && response.data.results.length > 0) {
  //             const addressComponents =
  //               response.data.results[0].address_components || [];
  //             let stateName = "";
  //             let countryName = "";

  //             // Extract state and country names
  //             if (Array.isArray(addressComponents)) {
  //               addressComponents.forEach((component) => {
  //                 if (component.types.includes("administrative_area_level_1")) {
  //                   stateName = component.long_name;
  //                 }
  //                 if (component.types.includes("country")) {
  //                   countryName = component.long_name;
  //                 }
  //               });
  //             }

  //             console.log(
  //               "State Name:",
  //               stateName,
  //               "Country Name:",
  //               countryName
  //             );

  //             // Safely access restrictedStates
  //             const restrictedStates = Area;

  //             // Log the restrictedStates to debug
  //             console.log("Restricted States:", Area);

  //             // Validate restrictedStates array
  //             if (
  //               Array.isArray(restrictedStates) &&
  //               restrictedStates.length > 0
  //             ) {
  //               const isRestricted = restrictedStates.some(
  //                 (restrictedState) =>
  //                   restrictedState.toLowerCase() === stateName.toLowerCase() ||
  //                   restrictedState.toLowerCase() === countryName.toLowerCase()
  //               );

  //               if (isRestricted) {
  //                 // Show the SweetAlert popup if restricted
  //                 Swal.fire({
  //                   title: "Area Restricted",
  //                   text: `This area is restricted for this game. State: ${stateName} in Country: ${countryName}`,
  //                   icon: "error",
  //                   confirmButtonText: "OK",
  //                 });

  //                 // Remove the token if restricted
  //                 localStorage.removeItem("Web-token");
  //               } else {
  //                 // Save the location in localStorage and close the popup
  //                 localStorage.setItem(
  //                   "location",
  //                   JSON.stringify({ stateName, countryName })
  //                 );
  //                 console.log("Location saved:", { stateName, countryName });
  //                 onClose();
  //               }
  //             } else {
  //               Swal.fire({
  //                 title: "Error",
  //                 text: "Restricted Area, You are not able to Play Game.",
  //                 icon: "error",
  //                 confirmButtonText: "OK",
  //               });
  //             }
  //           } else {
  //             console.error("No results found in geocode response.");
  //             onClose(); // Optionally handle this case
  //           }
  //         } catch (error) {
  //           console.error("Error fetching geocode:", error);
  //           onClose(); // Ensure onClose is defined
  //         }
  //       },
  //       (error) => {
  //         console.error("Error getting location:", error);
  //         setShowLocationSettingPopup(true);
  //       }
  //     );
  //   } else {
  //     console.error("Geolocation is not supported by this browser.");
  //   }
  // };

  const handleAllow = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Latitude:", latitude, "Longitude:", longitude);

        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyA8pM5yXTJ3LM8zBF-EkZHEyxlPXSttsl0`
          );

          const results = response.data.results;
          if (!results || results.length === 0) {
            console.error("No results found in geocode response.");
            onClose(); // Ensure this function exists
            return;
          }

          const addressComponents = results[0].address_components || [];
          let stateName = "";
          let countryName = "";

          addressComponents.forEach((component) => {
            if (component.types.includes("administrative_area_level_1")) {
              stateName = component.long_name;
            }
            if (component.types.includes("country")) {
              countryName = component.long_name;
            }
          });

          console.log("State Name:", stateName, "Country Name:", countryName);

          // Safely access the restricted states
          const restrictedStates = Area || []; // Ensure `Area` is defined and an array
          if (
            !Array.isArray(restrictedStates) ||
            restrictedStates.length === 0
          ) {
            console.warn("No restricted states defined.");
            return;
          }

          const isRestricted = restrictedStates.some(
            (restrictedState) =>
              restrictedState.toLowerCase() === stateName.toLowerCase() ||
              restrictedState.toLowerCase() === countryName.toLowerCase()
          );

          if (isRestricted) {
            Swal.fire({
              title: "Area Restricted",
              text: `This area is restricted for this game. State: ${stateName} in Country: ${countryName}`,
              icon: "error",
              confirmButtonText: "OK",
            });

            // Remove the token if restricted
            localStorage.removeItem("Web-token");
          } else {
            localStorage.setItem(
              "location",
              JSON.stringify({ stateName, countryName })
            );
            console.log("Location saved:", { stateName, countryName });
            if (onClose) onClose();
          }
        } catch (error) {
          console.error("Error fetching geocode:", error);
          if (onClose) onClose();
        }
      },
      (error) => {
        console.error("Error getting location:", error.message);
        setShowLocationSettingPopup(true); // Ensure this state function exists
      }
    );
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
              <img
                src={`${process.env.PUBLIC_URL}/images/location_icon.png`}
                // src="images/location_icon.png"
                alt="Location Icon"
              />
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
