import React, { useState, useEffect } from "react";
import axios from "axios";



function Rules() {
  const [rules, setRules] = useState("");

  const fetchRules = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "/get-all-static-content/rules_of_play",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRules(response.data.data[0]?.description);
      // setRules(response.data.data);
      console.log("ye", response.data.data);
    } catch (error) {
      console.error("Error data:", error);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  return (
    <>
      <div className="legaltermsdata_div">
        <div className="rowfortermscondition_data">
          
          <div className="termsdatainner">
           
            <div className="innerdata_eaidngwithpara">
              <div dangerouslySetInnerHTML={{ __html: rules }} />
            </div>
           
          </div>
        </div>
      </div>
    </>
  );
}

export default Rules;
