import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate, useLocation } from "react-router-dom";

function SucessPage() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      const token = localStorage.getItem("Web-token");

      try {
        const response = await axios.get("app/payments/get-contest-payments", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPayments(response.data.data[0] || []);
      } catch (error) {
        console.error("Error fetching payments:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message,
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });
      }
    };

    fetchPayments();
  }, []);

  console.log("status", payments.createdAt);
  console.log("transaction_status", payments.transaction_status);
  // console.log("status", payments.paymentId);
  // console.log("status", payments.paymentId);

  const navigate = useNavigate();

  const handlePaymentNavigation = () => {
    navigate("/my_account", { state: { activeTab: "paymentmethod" } });
  };
  return (
    <>
      <section className="maincont_section myacocunt_sectionforbgimg">
        <div className="container contforinner_mainheading">
          <div className="row rowmainheading_inner">
            <div className="col-md-12 colmainheading_innerpages">
              <div className="pageheading_main page_myaccountdiv">
                <h2 className="myaccounheading">Payment Status</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="container contrighttabbingpage">
          <div className="col-md-10 offset-md-1">
            <div className="row justify-content-center rowtabbingpage">
              <div className="col-lg-6 coltabdata_righttext">
                <div className="tabingrighttextdiv checkoutcards_section">
                  <div className="tab-content">
                    <div id="update_profile" className="tab-pane active">
                      <div className="profilesection_inner">
                        <div className="update_profile_main">
                          <div className="payment-success-div">
                            {/* Icon */}
                            {/* <div className="icon">
                              {payments.transaction_status === "SUCCESS" ? (
                                <span style={{ color: "green" }}>✔</span>
                              ) : payments.transaction_status === "PENDING" ? (
                                <span style={{ color: "orange" }}>⏳</span> // Pending icon
                              ) : payments.transaction_status === "FAILED" ? (
                                <span style={{ color: "red" }}>❌</span> // Failed icon
                              ) : (
                                <span style={{ color: "gray" }}>❌</span> // Default for other statuses
                              )}
                            </div> */}
                            <div className="icon">
                              {{
                                SUCCESS: (
                                  <span style={{ color: "green" }}>✔</span>
                                ),
                                PENDING: (
                                  <span style={{ color: "orange" }}>⏳</span>
                                ),
                                FAILED: (
                                  <span style={{ color: "red" }}>❌</span>
                                ),
                              }[payments.transaction_status] || null}
                            </div>

                            {/* Payment Successful Text */}
                            <h2 className="text-center text-white">
                              Payment{" "}
                              {payments.transaction_status
                                ? payments.transaction_status
                                : "Cancled"}
                            </h2>

                            <p className="subtitle text-center">
                              Thank you for your participation!
                            </p>
                            {/* Order ID */}
                            <div className="order-id text-center">
                              <span>📄 Ref. No: #{payments.paymentId}</span>
                            </div>
                            {/* Payment Details */}
                            <div className="details">
                              <p>
                                <span>Time / Date</span>
                                <span>
                                  {new Date(payments?.createdAt)
                                    .toLocaleString("en-GB", {
                                      weekday: "short",
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    })
                                    .replace(",", "")}
                                </span>{" "}
                              </p>
                            </div>
                            {/* Amount Details */}
                            <hr className="text-white border-white" />
                            <div className="details">
                              {/* <p>
                                <span>Amount</span>
                                <span>₹{payments.subTotalAmount}</span>
                              </p> */}
                              {/* <p>
                                <span>+GST @{payments.gstPercentage}%:</span>
                                <span>₹{payments.gstAmount}</span>
                              </p> */}
                              {/* <p>
                                <span>Fee</span>
                                <span>₹{payments.}</span>
                              </p> */}
                              <p>
                                <span className="bold">Total Amount</span>
                                <span className="bold">₹{payments.amount}</span>
                              </p>
                            </div>
                            <div className="paybtn_card">
                              <button
                                type="button"
                                onClick={handlePaymentNavigation}
                                className="paybtn_debitcard showpaydonepopup_click"
                              >
                                View all payments
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default SucessPage;
