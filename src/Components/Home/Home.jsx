import React, { useEffect, useState } from "react";
import Banner from "./Banner";
import News from "./News";
import Faqs from "./Faqs";
import axios from "axios";

function Home() {
  const [data, setData] = useState(null);
  const [apk, setApk] = useState(null);
  const [faqs, setFaqs] = useState(null);

  const fetchData = async () => {
    const token = localStorage.getItem("Web-token");
    try {
      const response = await axios.get("app/dashboard/public", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data?.data) {
        setData(response.data.data);
        setApk(response.data.data.apkLinks);
        setFaqs(response.data.data.faqs);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log("apks", apk);
  console.log("faqss", faqs);

  return (
    <>
      <Banner />
      <News />
      {faqs && <Faqs data={{ apk, faqs }} />}
    </>
  );
}

export default Home;
