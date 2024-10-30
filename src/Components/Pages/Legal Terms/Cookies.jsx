import React, { useState, useEffect } from "react";
import axios from "axios";

function Cookies() {
  const [isCookies, setIsCookies] = useState("");

  const fetchCookies = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "/get-all-static-content/cookie_policy",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsCookies(response.data.data[0]?.description);
    } catch (error) {
      console.error("Error data:", error);
    }
  };

  useEffect(() => {
    fetchCookies();
  }, []);
  return (
    <>
      <div className="legaltermsdata_div">
        <div className="innerlegal_heaidngwithpara">
          <div dangerouslySetInnerHTML={{ __html: isCookies }} />
        </div>
      </div>
    </>
  );
}

export default Cookies;
