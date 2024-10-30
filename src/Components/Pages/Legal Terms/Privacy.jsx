import React, { useState, useEffect } from "react";
import axios from "axios";

function Privacy() {
  const [isPrivacy, setIsPrivacy] = useState('');

    const fetchPrivacy = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "/get-all-static-content/privacy_policy",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsPrivacy(response.data.data[0]?.description);
      } catch (error) {
        console.error("Error data:", error);
      }
    };

    useEffect(() => {
      fetchPrivacy();
    }, []);

  return (
    <>
      <div className="legaltermsdata_div">
        <div className="innerlegal_heaidngwithpara">
          <div dangerouslySetInnerHTML={{ __html: isPrivacy }} />
        </div>
      </div>
    </>
  );
}

export default Privacy;
