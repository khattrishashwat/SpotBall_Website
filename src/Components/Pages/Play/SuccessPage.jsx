import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

function SucessPage() {
  const [payments, setPayments] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPayments = async () => {
      const token = localStorage.getItem("Web-token");
      const lang = localStorage.getItem("selectedLanguage");

      try {
        const response = await axios.get("app/payments/get-contest-payments", {
          headers: { Authorization: `Bearer ${token}` },
          "Accept-Language": lang,
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
                <h2 className="myaccounheading">{t("Payment Status")}</h2>
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
                              {t("Payment")}{" "}
                              {payments.transaction_status
                                ? payments.transaction_status
                                : "Cancled"}
                            </h2>

                            <p className="subtitle text-center">
                              {t("Thank you for your participation!")}
                            </p>
                            {/* Order ID */}
                            <div className="order-id text-center">
                              <span>
                                📄 {t("Ref. No")}: #{payments.paymentId}
                              </span>
                            </div>
                            {/* Payment Details */}
                            <div className="details">
                              <p>
                                <span>{t("Time / Date")}</span>
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
                                <span className="bold">
                                  {t("Total Amount")}
                                </span>
                                <span className="bold">
                                  ₹
                                  {payments.amount
                                    ? payments.amount.toFixed(2)
                                    : "0.00"}
                                </span>
                              </p>
                            </div>
                            <div className="paybtn_card">
                              <button
                                type="button"
                                onClick={handlePaymentNavigation}
                                className="paybtn_debitcard showpaydonepopup_click"
                              >
                                {t("View all payments")}
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
