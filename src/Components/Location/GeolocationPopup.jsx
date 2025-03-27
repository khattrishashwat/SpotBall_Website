// GeolocationPopup.js
import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import GameDenyPopup from "./GameDenyPopup";
import GameUnavailablePopup from "./GameUnavailablePopup";
import LocationSettingPopup from "./LocationSettingPopup";

const GeolocationPopup = ({ Area, onClose }) => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isUnavailablePopupVisible, setIsUnavailablePopupVisible] =
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
  //   if (!navigator.geolocation) {
  //     console.error("Geolocation is not supported by this browser.");
  //     return;
  //   }

  //   navigator.geolocation.getCurrentPosition(
  //     async (position) => {
  //       const { latitude, longitude } = position.coords;
  //       console.log("Latitude:", latitude, "Longitude:", longitude);

  //       try {
  //         const response = await axios.get(
  //           `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyA8pM5yXTJ3LM8zBF-EkZHEyxlPXSttsl0`
  //         );

  //         const results = response.data.results;
  //         if (!results || results.length === 0) {
  //           console.error("No results found in geocode response.");
  //           onClose(); // Ensure this function exists
  //           return;
  //         }

  //         const addressComponents = results[0].address_components || [];
  //         let stateName = "";
  //         let countryName = "";

  //         addressComponents.forEach((component) => {
  //           if (component.types.includes("administrative_area_level_1")) {
  //             stateName = component.long_name;
  //           }
  //           if (component.types.includes("country")) {
  //             countryName = component.long_name;
  //           }
  //         });

  //         console.log("State Name:", stateName, "Country Name:", countryName);

  //         // Safely access the restricted states
  //         const restrictedStates = Area || []; // Ensure `Area` is defined and an array
  //         if (
  //           !Array.isArray(restrictedStates) ||
  //           restrictedStates.length === 0
  //         ) {
  //           console.warn("No restricted states defined.");
  //           return;
  //         }

  //         const isRestricted = restrictedStates.some(
  //           (restrictedState) =>
  //             restrictedState.toLowerCase() === stateName.toLowerCase() ||
  //             restrictedState.toLowerCase() === countryName.toLowerCase()
  //         );
  //         console.log("isRestricted", isRestricted);

  //         if (isRestricted) {
  //           Swal.fire({
  //             title: "Area Restricted",
  //             text: `This area is restricted for this game. State: ${stateName} in Country: ${countryName}`,
  //             icon: "error",
  //             confirmButtonText: "OK",
  //           });

  //           // Remove the token if restricted
  //           localStorage.removeItem("Web-token");
  //         } else {
  //           localStorage.setItem(
  //             "location",
  //             JSON.stringify({ stateName, countryName })
  //           );
  //           console.log("Location saved:", { stateName, countryName });
  //           if (onClose) onClose();
  //         }
  //       } catch (error) {
  //         console.error("Error fetching geocode:", error);
  //         if (onClose) onClose();
  //       }
  //     },
  //     (error) => {
  //       console.error("Error getting location:", error.message);
  //       setShowLocationSettingPopup(true); // Ensure this state function exists
  //     }
  //   );
  // };

  // const handleAllow = () => {
  //   if (!navigator.geolocation) {
  //     console.error("Geolocation is not supported by this browser.");
  //     return;
  //   }

  //   navigator.geolocation.getCurrentPosition(
  //     async (position) => {
  //       const { latitude, longitude } = position.coords;
  //       console.log("Latitude:", latitude, "Longitude:", longitude);

  //       try {
  //         const response = await axios.get(
  //           `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyA8pM5yXTJ3LM8zBF-EkZHEyxlPXSttsl0`
  //         );

  //         const results = response.data.results;
  //         if (!results || results.length === 0) {
  //           console.error("No results found in geocode response.");
  //           onClose && onClose(); // Ensure this function exists
  //           return;
  //         }

  //         const addressComponents = results[0].address_components || [];
  //         let stateName = "";
  //         let countryName = "";

  //         addressComponents.forEach((component) => {
  //           if (component.types.includes("administrative_area_level_1")) {
  //             stateName = component.long_name;
  //           }
  //           if (component.types.includes("country")) {
  //             countryName = component.long_name;
  //           }
  //         });

  //         console.log("State Name:", stateName, "Country Name:", countryName);

  //         // Allow only if in India or Indian states
  //         if (countryName.toLowerCase() !== "india") {
  //           Swal.fire({
  //             title: "Area Restricted",
  //             text: `Access is restricted outside India. Current location: ${stateName}, ${countryName}`,
  //             icon: "error",
  //             confirmButtonText: "OK",
  //           });
  //           // localStorage.removeItem("Web-token");
  //           return;
  //         }

  //         // If in India, save location
  //         localStorage.setItem(
  //           "location",
  //           JSON.stringify({ stateName, countryName })
  //         );
  //         console.log("Location saved:", { stateName, countryName });

  //         // Close the popup if present
  //         onClose && onClose();
  //       } catch (error) {
  //         console.error("Error fetching geocode:", error);
  //         onClose && onClose();
  //       }
  //     },
  //     (error) => {
  //       console.error("Error getting location:", error.message);
  //       setShowLocationSettingPopup && setShowLocationSettingPopup(true); // Ensure this state function exists
  //     }
  //   );
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

          if (response.data.status !== "OK") {
            console.error("Geocode API Error:", response.data.status);
            return;
          }
          const results = response.data.results;
          console.log("result", results);

          if (!results || results.length === 0) {
            console.error("No results found in geocode response.");
            onClose && onClose(); // Ensure onClose exists
            return;
          }

          const addressComponents = results[0].address_components || [];
          let stateName = "";
          let countryName = "";

          // Extract state and country from address components
          addressComponents.forEach((component) => {
            if (component.types.includes("administrative_area_level_1")) {
              stateName = component.long_name;
            }
            if (component.types.includes("country")) {
              countryName = component.long_name;
            }
          });

          console.log("State Name:", stateName, "Country Name:", countryName);

          // Define restricted states
          const restrictedStates = Array.isArray(Area) ? Area : [];
          if (restrictedStates.length === 0) {
            console.warn("No restricted states defined.");
            return;
          }

          // Check if the country is not India
          if (countryName.toLowerCase() !== "india") {
            Swal.fire({
              title: "Area Restricted",
              text: `Access is restricted outside India. Current location: ${stateName}, ${countryName}`,
              icon: "error",
              confirmButtonText: "OK",
            });
            localStorage.setItem(
              "restrictedArea",
              JSON.stringify({ stateName, countryName })
            );

            setIsUnavailablePopupVisible(true); // Trigger the unavailable popup
            return;
          }

          // Check if the state is restricted
          const isRestrictedState = restrictedStates.some(
            (restrictedState) =>
              restrictedState.toLowerCase() === stateName.toLowerCase()
          );

          if (isRestrictedState) {
            Swal.fire({
              title: "Area Restricted",
              text: `Access is restricted in the state: ${stateName}`,
              icon: "error",
              confirmButtonText: "OK",
            });
            localStorage.setItem(
              "restrictedArea",
              JSON.stringify({ stateName, countryName })
            );

            setIsUnavailablePopupVisible(true); // Trigger the unavailable popup
            return;
          }

          // If valid, save the location
          localStorage.setItem(
            "location",
            JSON.stringify({ stateName, countryName })
          );
          console.log("Location saved:", { stateName, countryName });

          // Close the popup if present
          onClose && onClose();
        } catch (error) {
          console.error("Error fetching geocode:", error);
          onClose && onClose();
        }
      },
      (error) => {
        console.error("Error getting location:", error.message);
        setShowLocationSettingPopup && setShowLocationSettingPopup(true); // Ensure this state function exists
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
    setIsUnavailablePopupVisible(false); // Close GameUnavailablePopup
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
                src={`${process.env.PUBLIC_URL}/image/location_icon.png`}
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
