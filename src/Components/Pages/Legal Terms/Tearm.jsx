import React,{useState,useEffect} from 'react'
import axios from 'axios';


function Tearm() {

  const[terms,setTerms]=useState('');

  const fetchCondition = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "/get-all-static-content/terms_and_condition",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
        setTerms(response.data.data[0]?.description);
        // console.log("ye",response.data.data);
    } catch (error) {
      console.error("Error data:", error);
    }
  };

  useEffect(() => {
    fetchCondition();
  }, []);


  return (
    <>
      <div className="legaltermsdata_div">
        <div className="innerlegal_heaidngwithpara">
          <div dangerouslySetInnerHTML={{ __html: terms }} />
        </div>
      </div>
    </>
  );
}

export default Tearm
