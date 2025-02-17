// import { useLocation, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";

// function PopupCheckout() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [timer, setTimer] = useState(60); // Set an initial timer value, e.g., 10 seconds

//   useEffect(() => {
//     const params = new URLSearchParams(location.search); // Parse the query string
//     const orderId = params.get("order_id"); // Get the order_id from query string

//     if (orderId) {
//       const OrderStatus = async (order_id) => {
//         try {
//           const token = localStorage.getItem("Web-token");
//           if (token) {
//             const response = await axios.post(
//               `app/cashfree/update-order-status?order_id=${order_id}`,
//               {},
//               {
//                 headers: {
//                   Authorization: `Bearer ${token}`,
//                 },
//               }
//             );
//             console.log("update-order-status", response.data); // Handle response as needed
//           }
//         } catch (error) {
//           console.error(error.response?.data || error.message); // Handle the error appropriately
//         }
//       };

//       // Trigger the API call
//       OrderStatus(orderId);

//       // Set a timer to decrease the timer state every second
//       const intervalId = setInterval(() => {
//         setTimer((prevTimer) => {
//           if (prevTimer === 1) {
//             clearInterval(intervalId); // Clear the interval when the timer reaches 0
//             navigate("/"); // Navigate to the home page
//             return 0;
//           }
//           return prevTimer - 1; // Decrease the timer by 1 second
//         });
//       }, 1000); // 1000ms = 1 second
//     }
//   }, [location.search, navigate]);

//   const handleDownload = async () => {
//     const params = new URLSearchParams(location.search);
//     const orderId = params.get("order_id"); // Get the order_id from query string
//     const token = localStorage.getItem("Web-token");

//     try {
//       const response = await axios.get(`app/payments/get-bill/${orderId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log("pdf", response.data.data.pdf);
//       const pdfUrl = response.data.data.pdf;
//       if (pdfUrl) {
//         window.open(pdfUrl, "_blank");
//       } else {
//         throw new Error("PDF URL not found.");
//       }
//     } catch (error) {
//       console.error("Error downloading the invoice:", error);
//     }
//   };

//   return (
//     <>
//       <section className="maincont_section myacocunt_sectionforbgimg">
//         <div
//           className="payment_process_popup paymentmainpopup_showonclickpay"
//           style={{ display: "block" }}
//         >
//           <div className="payprocess_innerdiv">
//             <div className="processpayment_success">
//               <div className="successfullypayment">
//                 <div className="pay_successmaindiv">
//                   <p>Payment Processed</p>
//                   <h3>Successfully</h3>
//                   <img
//                     src="images/payment_done_new.gif"
//                     alt="Payment Success"
//                   />
//                   <a onClick={handleDownload} className="downloadinvoice_cnfrm">
//                     Download Confirmation
//                   </a>
//                   <p>Redirecting to Home Screen in {timer} seconds...</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

// export default PopupCheckout;

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function PopupCheckout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [timer, setTimer] = useState(60); // Timer for redirect
  const [paymentStatus, setPaymentStatus] = useState(""); // Store payment status

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get("order_id");

    if (orderId) {
      const fetchOrderStatus = async () => {
        try {
          const token = localStorage.getItem("Web-token");
          if (token) {
            const response = await axios.post(
              `app/cashfree/update-order-status?order_id=${orderId}`,
              {},
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            console.log("Order Status Response:", response.data);
            setPaymentStatus(response.data?.data?.paymentStatus || "PENDING"); // Default to pending
          }
        } catch (error) {
          console.error(
            "Error fetching payment status:",
            error.response?.data || error.message
          );
        }
      };

      fetchOrderStatus();

      // Start countdown timer for redirection
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            clearInterval(intervalId);
            navigate("/"); // Redirect to home page
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
  }, [location.search, navigate]);

  const handleDownload = async () => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get("order_id");
    const token = localStorage.getItem("Web-token");

    try {
      const response = await axios.get(`app/payments/get-bill/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("PDF URL:", response.data.data.pdf);
      const pdfUrl = response.data.data.pdf;
      if (pdfUrl) {
        window.open(pdfUrl, "_blank");
      } else {
        throw new Error("PDF URL not found.");
      }
    } catch (error) {
      console.error("Error downloading invoice:", error);
    }
  };

  // Choose appropriate GIF based on paymentStatus
  const getStatusGif = () => {
    switch (paymentStatus) {
      case "SUCCESS":
        return "images/payment_done_new.gif"; // Success GIF
      case "PENDING":
        return "images/payment_pending.gif"; // Pending GIF
      default:
        return "images/payment_failed.gif"; // Default / Failed GIF
    }
  };

  return (
    <>
      <section className="maincont_section myacocunt_sectionforbgimg">
        <div
          className="payment_process_popup paymentmainpopup_showonclickpay"
          style={{ display: "block" }}
        >
          <div className="payprocess_innerdiv">
            <div className="processpayment_success">
              <div className="successfullypayment">
                <div className="pay_successmaindiv">
                  <p>Payment Status</p>
                  <h3>
                    {paymentStatus === "SUCCESS"
                      ? "Successfully"
                      : paymentStatus}
                  </h3>
                  <img src={getStatusGif()} alt="Payment Status" />
                  {paymentStatus === "SUCCESS" && (
                    <a
                      onClick={handleDownload}
                      className="downloadinvoice_cnfrm"
                    >
                      Download Confirmation
                    </a>
                  )}
                  <p>Redirecting to Home Screen in {timer} seconds...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PopupCheckout;
