import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function PastPayment() {
    const [isOpen, setIsOpen] = useState(false);

  const [payments, setPayments] = useState([]);
  const [download, setDownload] = useState([]);
const toggleDropdown = () => {
  setIsOpen(!isOpen);
};
  useEffect(() => {
    const fetchPayments = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          "v1/app/contest/get-contest-payments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("newww", response.data);

        setPayments(response.data.data||{});
        
      } catch (error) {
        console.error("Error fetching payments:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "There was an error fetching payments. Please try again later.",
          confirmButtonText: "OK",
        });
      }
    };

    fetchPayments();
  }, []);

  const handleDownload = async (e, paymentId) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`v1/app/contest/get-bill/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
console.log("pdf",response.data.data[0].pdf);

      const pdfUrl = response.data.data[0].pdf;
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `invoice_${paymentId}.pdf`; // Dynamic filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the invoice:", error);
      Swal.fire({
        icon: "error",
        title: "Download Failed",
        text: "There was an error downloading your invoice. Please try again later.",
      });
    }
  };
console.log("jackpot_price", payments);

  return (
    <>
      <div className="payment_methoddiv pastpay_detailmaindiv_new">
        <div className="cartwithcordinatetables">
          {payments.length > 0 ? (
            payments.map((payment) => (
              <div
                key={payment._id}
                className="cartstripe pastpaydetail_maindiv"
              >
                <div className="checkout_cartdiv">
                  <div className="cart_jackpotdetails">
                    <div className="cart_windiv">
                      Win{" "}
                      <span className="winprice_cart">
                        ₹{payment?.contestId?.jackpot_price}
                      </span>
                    </div>
                    <div className="jackpot_ticket_cart pastpayment_detailleft">
                      <h3>₹{payment?.contestId?.jackpot_price} Jackpot</h3>
                      <span>
                        {new Date(payment.createdAt).toLocaleString()}
                      </span>
                      <h4>{payment.tickets} Tickets</h4>
                      {/* <p>Payment Mode: UPI</p> */}
                    </div>
                  </div>
                  <div className="cart_gametotalprice pastpay_right">
                    <div className="pastpay_invoicediv">
                      <a
                        className="downloadinvoice_hreftag"
                        onClick={(e) => handleDownload(e, payment._id)} // Pass paymentId
                      >
                        <img
                          src={`${process.env.PUBLIC_URL}/images/download_invoice.png`}
                          style={{ cursor: "pointer" }}
                        />
                        <p>Download Invoice</p>
                      </a>
                    </div>
                    <p>Txn. Id.: {payment.paymentId}</p>
                    <h3>₹{payment.amount}</h3>
                    <div className="pastpay_dropdownicon">
                      <button
                        type="button"
                        className="dropbtn_pastpy"
                        onClick={toggleDropdown}
                      >
                        <img
                          src={`${process.env.PUBLIC_URL}/images/arrow_icon_payment.png`}
                          className={isOpen ? "" : "rotate_pastpayicon"}
                        />
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  className={`cordinates_table_cart pastgamecordinate_payment ${
                    isOpen ? "" : "hide"
                  }`}
                >
                  <table className="table table-bordered cordtable_new">
                    <thead>
                      <tr>
                        <th>Tickets</th>
                        <th>X- Coordinates</th>
                        <th>Y- Coordinates</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payment.coordinates.map((coordinate, index) => (
                        <tr key={coordinate._id}>
                          <td>{index + 1}</td>
                          <td>{coordinate.x}</td>
                          <td>{coordinate.y}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          ) : (
            <h2 style={{"color":"white"}}>No Payment History Found!</h2>
          )}
        </div>
      </div>
    </>
  );
}

export default PastPayment;
