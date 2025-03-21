import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function PastPayment() {
  const [payments, setPayments] = useState([]);
  const [dropdownStates, setDropdownStates] = useState({});

  const toggleDropdown = (id) => {
    setDropdownStates((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  useEffect(() => {
    const fetchPayments = async () => {
      const token = localStorage.getItem("Web-token");

      try {
        const response = await axios.get("app/payments/get-contest-payments", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPayments(response.data.data || []);
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

  const handleDownload = async (e, paymentId) => {
    e.preventDefault();
    const token = localStorage.getItem("Web-token");

    try {
      const response = await axios.get(`app/payments/get-bill/${paymentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("pdf", response.data.data.pdf);
      const pdfUrl = response.data.data.pdf;
      if (pdfUrl) {
        window.open(pdfUrl, "_blank");
      } else {
        throw new Error("PDF URL not found.");
      }
    } catch (error) {
      console.error("Error downloading the invoice:", error);
    }
  };

  console.log("payments", payments);

  return (
    <div className="payment_methoddiv pastpay_detailmaindiv_new">
      <div className="cartwithcordinatetables">
        {payments.length > 0 ? (
          payments.map((payment) => (
            <div key={payment._id} className="cartstripe pastpaydetail_maindiv">
              <div className="checkout_cartdiv">
                <div className="cart_jackpotdetails">
                  <div className="cart_windiv">
                    Win{" "}
                    <span className="winprice_cart">
                      ₹
                      {Number(
                        payment?.contestId?.jackpot_price
                      ).toLocaleString()}{" "}
                    </span>
                  </div>
                  <div className="jackpot_ticket_cart pastpayment_detailleft">
                    <h3>
                      ₹
                      {Number(
                        payment?.contestId?.jackpot_price
                      ).toLocaleString()}{" "}
                      Jackpot
                    </h3>
                    <span>
                      {new Date(payment?.createdAt)
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
                    </span>
                    <h4>{payment?.tickets} Tickets</h4>
                  </div>
                </div>
                <div className="cart_gametotalprice pastpay_right">
                  <div className="pastpay_invoicediv">
                    <a
                      className="downloadinvoice_hreftag"
                      onClick={(e) => handleDownload(e, payment?.paymentId)}
                    >
                      <img
                        src={`${process.env.PUBLIC_URL}/images/download_invoice.png`}
                        alt="Download Invoice"
                        style={{ cursor: "pointer" }}
                      />
                      <p>Download Invoice</p>
                    </a>
                  </div>
                  <p>Txn. Id.: {payment?.paymentId}</p>
                  <h3>₹{payment?.amount?.toFixed(2)}</h3>
                </div>
              </div>
              <div className="transaction-sec d-flex justify-content-between">
                <div className="payment-option">
                  <h4>
                    Transaction Status:{" "}
                    <span
                      className={`text-${
                        payment?.transaction_status === "SUCCESS"
                          ? "success"
                          : payment?.transaction_status === "Pending"
                          ? "warning"
                          : "danger"
                      }`}
                    >
                      {payment?.transaction_status
                        ? payment?.transaction_status.toLowerCase()
                        : "cancelled"}
                    </span>
                  </h4>
                </div>
                <div className="pastpay_dropdownicon">
                  <button
                    type="button"
                    className="dropbtn_pastpy"
                    onClick={() => toggleDropdown(payment._id)}
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/images/arrow_icon_payment.png`}
                      className={
                        dropdownStates[payment._id] ? "" : "rotate_pastpayicon"
                      }
                      alt="Toggle"
                    />
                  </button>
                </div>
              </div>
              {dropdownStates[payment._id] && (
                <div className="cordinates_table_cart pastgamecordinate_payment">
                  <table className="table table-bordered cordtable_new">
                    <thead>
                      <tr>
                        <th>Tickets</th>
                        <th>X- Coordinates</th>
                        <th>Y- Coordinates</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payment.coordinates?.map((coordinate, index) => (
                        <tr key={coordinate._id}>
                          <td>{index + 1}</td>
                          <td>{coordinate.x}</td>
                          <td>{coordinate.y}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        ) : (
          <h2 style={{ color: "white" }}>No Payment History Found!</h2>
        )}
      </div>
    </div>
  );
}

export default PastPayment;
