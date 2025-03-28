import React, { useEffect, useState, useCallback } from "react";
import Banner from "./Banner";
import News from "./News";
import Faqs from "./Faqs";
import axios from "axios";
import Swal from "sweetalert2";
import {
  messaging,
  getToken,
  onMessage,
} from "../FirebaseCofig/FirebaseConfig";

function Home() {
  const [restrictedStates, setRestrictedStates] = useState([]);
  const [apk, setApk] = useState([]);
  const [banner, setBanner] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [news, setNews] = useState([]);
  const [livs, setLivs] = useState([]);
  const [contests, setContests] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [howItWorks, setHowItWorks] = useState([]);
  const [bannerGIFS, setBannerGIFS] = useState([]);
  const [movies, setMovies] = useState("");

  const requestFirebaseToken = async () => {
    try {
      const currentToken = await getToken(messaging, {
        vapidKey:
          "BC1L5qE6WKJSgEU46nuptM9bCKtljihEjAikiBrpzRIomSiw6Dd9Wq6jmM4CfIHJokkhmqblgU5qbVaqizNlmeo",
      });

      if (currentToken) {
        // console.log("FCM Token:", currentToken);
        localStorage.setItem("device_token", currentToken);

        // Optionally, send the token to your backend for push notifications
      } else {
        console.log("No FCM token available. Request permission.");
      }
    } catch (error) {
      console.error("FCM Token Error:", error);
      localStorage.setItem("device_token", "currentToken");
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("Web-token");
        let response;

        if (token) {
          response = await axios.get("/app/dashboard/authenticated", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          response = await axios.get("/app/dashboard/public");
        }

        if (response?.data?.data && isMounted) {
          setRestrictedStates(response.data.data.restrictedStates || []);
          setLivs(response.data.data.livelinks || []);
          setContests(response.data.data.contests || []);
          setDiscounts(response.data.data.discounts || []);
          setFaqs(response.data.data.faqs || []);
          setNews(response.data.data.press || []);
          setApk(response.data.data.apkLinks || []);
          setBanner(response.data.data.banner_details || []);
          setHowItWorks(response.data.data.howItWorks || []);
          setBannerGIFS(response.data.data.bannerGifs || []);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
    requestFirebaseToken();
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchVideoData = async () => {
    const token = localStorage.getItem("Web-token");
    try {
      const response = await axios.get("app/how-to-play/get-how-to-play", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data?.data) {
        setMovies(response.data.data[0]);
        console.log("new", response.data.data[0]);
      }
    } catch (error) {
      console.error("Error fetching video data:", error);
    }
  };

  useEffect(() => {
    fetchVideoData();
  }, []);

  return (
    <>
      <Banner
        data={{
          movies,
          restrictedStates,
          livs,
          howItWorks,
          banner,
          contests,
          discounts,
          bannerGIFS,
        }}
      />
      {news.length > 0 && <News data={{ news }} />}
      {faqs.length > 0 && <Faqs data={{ apk, faqs }} />}
    </>
  );
}

export default Home;
