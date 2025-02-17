import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function PopupCheckout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [timer, setTimer] = useState(60); // Timer for redirect
  const [paymentStatus, setPaymentStatus] = useState(""); // Store payment status
  const [errorMessage, setErrorMessage] = useState(""); // Store error message

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get("order_id");

    if (orderId) {
      const fetchOrderStatus = async () => {
        try {
          const token = localStorage.getItem("Web-token");
          if (!token) {
            navigate("/login"); // Redirect to login page if token is not available
            return;
          }

          const response = await axios.post(
            `app/cashfree/update-order-status?order_id=${orderId}`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          console.log(
            "Order Status Response:",
            response.data.data.transaction_status
          );
          setPaymentStatus(response.data?.data?.transaction_status || ""); // Default to pending
        } catch (error) {
          console.error("Error fetching payment status:", error);
          setErrorMessage("Failed to fetch payment status. Please try again.");
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

      // Cleanup timer on component unmount
      return () => clearInterval(intervalId);
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
      setErrorMessage("Failed to download invoice. Please try again.");
    }
  };

  // Choose appropriate GIF based on paymentStatus
  const getStatusGif = () => {
    switch (paymentStatus) {
      case "SUCCESS":
        return "images/payment_done_new.gif"; // Success GIF
      case "PENDING":
        return "images/payment_pending.gif"; // Pending GIF
      case "FAILED":
        return "images/payment_failed.gif"; // Failed GIF
      case "Unknown":
        return "Please contact Spotsball team"; // Unknown status message
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
                      ? "Payment Successful!"
                      : paymentStatus}
                  </h3>
                  {errorMessage && (
                    <p className="error-message">{errorMessage}</p>
                  )}
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
