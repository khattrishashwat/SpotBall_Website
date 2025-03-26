import React, { useEffect, useState, useCallback } from "react";
import Banner from "./Banner";
import News from "./News";
import Faqs from "./Faqs";
import axios from "axios";
import GeolocationPopup from "../Location/GeolocationPopup";
import GameUnavailablePopup from "../Location/GameUnavailablePopup";
import Swal from "sweetalert2";

function Home() {
  const [restrictedStates, setRestrictedStates] = useState([]);
  const [apk, setApk] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [news, setNews] = useState([]);
  const [livs, setLivs] = useState([]);
  const [contests, setContests] = useState([]);
  const [discounts, setDiscounts] = useState([]);

  const [isGeolocationPopupVisible, setGeolocationPopupVisible] =
    useState(false);
  const [isUnavailablePopupVisible, setIsUnavailablePopupVisible] =
    useState(false);

  useEffect(() => {
    let isMounted = true; // Prevents state update if unmounted
    const fetchData = async () => {
      const token = localStorage.getItem("Web-token");
      if (!token) return;

      try {
        const response = await axios.get("/app/dashboard/public", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response?.data?.data && isMounted) {
          setRestrictedStates(response.data.data.restrictedStates || []);
          setLivs(response.data.data.livelinks || []);
          setContests(response.data.data.contests || []);
          setDiscounts(response.data.data.discounts || []);
          setFaqs(response.data.data.faqs || []);
          setNews(response.data.data.press || []);
          setApk(response.data.data.apkLinks || []);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
    return () => {
      isMounted = false; // Cleanup function to prevent memory leaks
    };
  }, []);

  useEffect(() => {
    const fetchLocation = async () => {
      if (navigator.geolocation) {
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

              console.log(
                "State Name:",
                stateName,
                "Country Name:",
                countryName
              );

              // Ensure restrictedStates is not null or undefined
              const restrictedAreaStates = restrictedStates || [];
              // console.log("restrictedAreaStates", restrictedAreaStates);

              // Check if the country is not India
              if (countryName.toLowerCase() !== "india") {
                Swal.fire({
                  title: "Area Restricted",
                  text: `Access is restricted outside India. Current location: ${stateName}, ${countryName}`,
                  icon: "error",
                  confirmButtonText: "OK",
                });

                localStorage.removeItem("location");
                localStorage.setItem(
                  "restrictedArea",
                  JSON.stringify({ stateName, countryName })
                );

                setIsUnavailablePopupVisible(true);
                return;
              }

              // Check if the state is restricted
              const isRestrictedState = restrictedAreaStates.some(
                (restrictedState) =>
                  restrictedState.toLowerCase() === stateName.toLowerCase()
              );

              if (isRestrictedState) {
                localStorage.removeItem("location");
                localStorage.setItem(
                  "restrictedArea",
                  JSON.stringify({ stateName, countryName })
                );

                setIsUnavailablePopupVisible(true);
                return;
              }

              // If not restricted, store location and remove restrictedArea
              localStorage.removeItem("restrictedArea");
              localStorage.setItem(
                "location",
                JSON.stringify({ stateName, countryName })
              );

              // console.log("Location saved:", { stateName, countryName });
            } catch (err) {
              console.error("Error fetching geocode data:", err);
            }
          },
          (error) => {
            console.error("Geolocation error:", error.message);
          }
        );
      }
    };
    const token = localStorage.getItem("Web-token");
    if (token) {
      fetchLocation();
    }
    // fetchLocation();
  }, [restrictedStates]);

  return (
    <>
      <Banner data={{ livs, contests, discounts }} />
      {news.length > 0 && <News data={{ news }} />}
      {faqs.length > 0 && <Faqs data={{ apk, faqs }} />}
      {isGeolocationPopupVisible && (
        <GeolocationPopup
          onClose={() => setGeolocationPopupVisible(false)}
          Area={restrictedStates}
        />
      )}
      {isUnavailablePopupVisible && (
        <GameUnavailablePopup
          onOk={() => setIsUnavailablePopupVisible(false)}
        />
      )}
    </>
  );
}

export default Home;
