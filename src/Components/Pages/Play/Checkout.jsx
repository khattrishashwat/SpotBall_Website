import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../../Loader/Loader";
import Swal from "sweetalert2";

function Checkout() {

    const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [carts, setCarts] = useState("");
  const [isCardActive, setIsCardActive] = useState(false);
  const [isEntrysActive, setIsEntrysActive] = useState(false);
  const [isImageRotated, setIsImageRotated] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExp, setCardExp] = useState("");

const fetchData = async () => {
  const token = localStorage.getItem("token");
  try {
    setIsLoading(true);
    const response = await axios.get(`get-all-cart-items`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

     if (!response.data.data || response.data.data.length === 0) {
       // Show SweetAlert message if response is empty
       Swal.fire({
         icon: "info",
         title: "No Cart Items",
         text: "Your cart is currently empty.",
         confirmButtonText: "OK",
       }).then(() => {
         // Navigate to home page after the alert is dismissed
         navigate("/");
       });
     } else {
       setCarts(response.data.data || {});
       console.log("carts", response.data.data);
     }
  } catch (error) {
    console.error("Error data:", error);
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  fetchData();
}, []);


  const toggleCardInput = () => {
    setIsCardActive(!isCardActive);
  };
  const handleImageClick = () => {
    setIsEntrysActive(!isEntrysActive);
    setIsImageRotated(!isImageRotated);
  };

  // Calculation //
  const calculatedCarts = useMemo(() => {
    return (
      carts &&
      carts.map((cart) => {
        const contest = cart.contest_id || {};
        const {
          ticket_price = 0, // Default value set to 0
          tickets_count = 0, // Default value set to 0
          gstRate = 0, // Default value set to 0
          platformFeeRate = 0, // Default value set to 0
          gstOnPlatformFeeRate = 0, // Default value set to 0
        } = contest;

        console.log("contest", contest);
        console.log("ticket_price", ticket_price);
        console.log("gstRate", gstRate);
        console.log("gstOnPlatformFeeRate", gstOnPlatformFeeRate);

        // Step 1: Calculate total ticket price (ticket_price * tickets_count)
        const totalTicketPrice = ticket_price * tickets_count;
        console.log("totalTicketPrice", totalTicketPrice);

        // Step 2: Calculate GST on ticket price (totalTicketPrice * gstRate)
        const gstAmount = totalTicketPrice * gstRate;

        // Step 3: Subtotal (ticket price + GST)
        const subtotal = totalTicketPrice + gstAmount;

        // Step 4: Platform fee (subtotal * platformFeeRate)
        const platformFee = subtotal * platformFeeRate;

        // Step 5: GST on platform fee (platformFee * gstOnPlatformFeeRate)
        const gstOnPlatformFee = platformFee * gstOnPlatformFeeRate;

        // Step 6: Total Razorpay fee (platform fee + GST on platform fee)
        const totalRazorpayFee = platformFee + gstOnPlatformFee;

        // Step 7: Total payment by user (subtotal + totalRazorpayFee)
        const totalPayment = subtotal + totalRazorpayFee;

        return {
          ...cart,
          totalTicketPrice: totalTicketPrice.toFixed(2),
          gstAmount: gstAmount.toFixed(2),
          subtotal: subtotal.toFixed(2),
          platformFee: platformFee.toFixed(2),
          gstOnPlatformFee: gstOnPlatformFee.toFixed(2),
          totalRazorpayFee: totalRazorpayFee.toFixed(2),
          totalPayment: totalPayment.toFixed(2),
        };
      })
    );
  }, [carts]);

  console.log("calculatedCarts", calculatedCarts[0]);

  const handleCrossClick = async (cart) => {
    const { contest_id, tickets_count, user_coordinates } = cart;
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `remove-cart-item/${cart._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token with the request
          },
        },
        {
          contest_id: contest_id._id, // Send contest ID
          tickets_count,
          user_coordinates: {
            x: user_coordinates.x, // Send x coordinate
            y: user_coordinates.y, // Send y coordinate
          },
        },
        
      );

      // Handle successful response
      console.log(response.data);
      Swal.fire({
        title: "Success!",
        text: "Data sent successfully!",
        icon: "success",
      });

      // Optionally, remove the cart from the state
      setCarts(carts.filter((c) => c._id !== cart._id));
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "There was an error sending the data.",
        icon: "error",
      });
    }
  };

  return (
    <>
      <section className="maincont_section myacocunt_sectionforbgimg">
        <div className="container contforinner_mainheading">
          <div className="row rowmainheading_inner">
            <div className="col-md-12 colmainheading_innerpages">
              <div className="pageheading_main page_myaccountdiv">
                <h2 className="myaccounheading">Checkout</h2>
              </div>
            </div>
          </div>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="container contrighttabbingpage">
            <div className="col-md-12">
              <div className="row rowtabbingpage">
                <div className="col-md-5 coltabbingdiv">
                  <div className="cartwithcordinatetables">
                    {carts &&
                      carts.map((cart, index) => (
                        <div key={cart._id} className="cartstripe">
                          <div className="checkout_cartdiv">
                            <div className="cart_jackpotdetails cartwindiv_mainformov">
                              <div className="cart_windiv">
                                Win{" "}
                                <span className="winprice_cart">
                                  ₹{cart.contest_id.title}
                                </span>
                              </div>
                              <div className="jackpot_ticket_cart">
                                <h3>
                                  ₹{cart.contest_id.jackpot_price} Jackpot
                                </h3>
                                <h4>{cart.tickets_count} Tickets</h4>
                                <p>Spot &amp; Win</p>
                              </div>
                            </div>
                            <div className="cart_gametotalprice">
                              <h3>
                                ₹
                                {cart.contest_id.ticket_price *
                                  cart.tickets_count}
                              </h3>
                              <p className="addgsttext_cart">
                                + GST (@{cart.contest_id.gstRate}%)
                              </p>
                            </div>
                          </div>
                          <div className="crossicon_cartdiv">
                            <button
                              type="button"
                              className="crossbtn_cart"
                              onClick={() => handleCrossClick(cart)}
                            >
                              <img
                                src={`${process.env.PUBLIC_URL}/images/cross_cart.png`}
                                alt="Close"
                              />
                            </button>
                          </div>

                          <div className="cordinates_table_cart">
                            <table className="table table-bordered cordtable_new">
                              <thead>
                                <tr>
                                  <th>Tickets</th>
                                  <th>X- Coordinates</th>
                                  <th>Y- Coordinates</th>
                                </tr>
                              </thead>
                              <tbody>
                                {cart.user_coordinates.map(
                                  (coordinate, idx) => (
                                    <tr key={coordinate._id}>
                                      <td>{idx + 1}</td>
                                      <td>{coordinate.x}</td>
                                      <td>{coordinate.y}</td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                          <div className="entry">
                            <div className="detailes">
                              <img
                                src={`${process.env.PUBLIC_URL}/images/arrow_icon_payment.png`}
                                className={`showcardinputonclick_icon ${
                                  isImageRotated ? "rotate" : ""
                                }`}
                                alt="Arrow Icon"
                                onClick={handleImageClick}
                              />
                              <div className="cardmethod_design">
                                <div className="creditdebit_carddiv">
                                  <p>Details</p>
                                </div>
                              </div>
                              <div
                                className={`detalis_inputs details_div ${
                                  isEntrysActive ? "active" : ""
                                }`}
                                style={{
                                  display: isEntrysActive ? "block" : "none",
                                }}
                              >
                                {calculatedCarts.map((cart, index) => (
                                  <div key={index} className="cart-item">
                                    <h3>Cart Item {index + 1}</h3>
                                    <p>
                                      <strong>Ticket Price: </strong>₹
                                      {cart.ticket_price}
                                    </p>
                                    <p>
                                      <strong>Tickets Count: </strong>
                                      {cart.tickets_count}
                                    </p>
                                    <p>
                                      <strong>Total Ticket Price: </strong>₹
                                      {cart.totalTicketPrice}
                                    </p>
                                    <p>
                                      <strong>
                                        GST (@
                                        {(
                                          cart.contest_id.gstRate * 100
                                        ).toFixed(0)}
                                        %):{" "}
                                      </strong>
                                      ₹{cart.gstAmount}
                                    </p>
                                    <p>
                                      <strong>Subtotal: </strong>₹
                                      {cart.subtotal}
                                    </p>
                                    <hr />
                                    <p>
                                      <strong>
                                        Platform Fee (@
                                        {(
                                          cart.contest_id.platformFeeRate * 100
                                        ).toFixed(2)}
                                        %):{" "}
                                      </strong>
                                      ₹{cart.platformFee}
                                    </p>
                                    <p>
                                      <strong>
                                        GST on Platform Fee (@
                                        {(
                                          cart.contest_id.gstOnPlatformFeeRate *
                                          100
                                        ).toFixed(2)}
                                        %):{" "}
                                      </strong>
                                      ₹{cart.gstOnPlatformFee}
                                    </p>
                                    <p>
                                      <strong>Total Razorpay Fee: </strong>₹
                                      {cart.totalRazorpayFee}
                                    </p>
                                    <hr />
                                    <p>
                                      <strong>Total Payment: </strong>₹
                                      {cart.totalPayment}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="col-md-7 coltabdata_righttext">
                  <div className="tabingrighttextdiv checkoutcards_section">
                    <div className="payment_methoddiv cartmaindivforpaym_new">
                      <div className="promotionalinput_cart">
                        <input
                          className="discountinput_cart"
                          type="text"
                          placeholder="Promotion Code (if any)"
                        />
                      </div>
                      <div className="methodsdivnew">
                        <div className="paymentmethodsheaidng">
                          <h4>CARDS</h4>
                        </div>
                        <div className="cardmethod_design">
                          <div
                            className="creditdebit_carddiv"
                            onClick={toggleCardInput}
                          >
                            <div className="cardnamewithicon">
                              <img
                                src={`${process.env.PUBLIC_URL}/images/card.png`}
                                alt="Card Icon"
                              />
                              <p>Pay Via Credit / Debit Cards</p>
                            </div>
                            <div className="arrowicondiv">
                              <img
                                src={`${process.env.PUBLIC_URL}/images/arrow_icon_payment.png`}
                                className="showcardinputonclick_icon"
                                alt="Arrow Icon"
                              />
                            </div>
                          </div>

                          <div
                            className={`cardpay_inputs showhideonclick_arrowicon_carddiv ${
                              isCardActive ? "active" : ""
                            }`}
                            style={{ display: isCardActive ? "block" : "none" }}
                          >
                            <div className="cardnumberinput">
                              <input
                                type="text"
                                className="input_cardsnew"
                                placeholder="Card Number"
                              />
                            </div>
                            <div className="validupto_cvv">
                              <div className="cardnumberinput">
                                <input
                                  type="text"
                                  className="input_cardsnew"
                                  placeholder="Valid Upto"
                                />
                              </div>
                              <div className="cardnumberinput">
                                <input
                                  type="text"
                                  className="input_cardsnew"
                                  placeholder="CVV"
                                />
                              </div>
                            </div>
                            <div className="paybtn_card">
                              <button
                                type="button"
                                className="paybtn_debitcard showpaydonepopup_click"
                              >
                                Pay
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="methodsdivnew">
                        <div className="paymentmethodsheaidng">
                          <h4>NETBANKING</h4>
                        </div>
                        <div className="card_netbankingdivmain">
                          <a href="#!">
                            <div className="cardmethod_design forbrdrbtm">
                              <div className="creditdebit_carddiv">
                                <div className="cardnamewithicon">
                                  <img
                                    src={`${process.env.PUBLIC_URL}/images/icici_icon.png`}
                                    // src="images/icici_icon.png"
                                  />
                                  <p>ICICI</p>
                                </div>
                                <div className="arrowicondiv rotate270forotherpayment">
                                  <img src="images/arrow_icon_payment.png" />
                                </div>
                              </div>
                            </div>
                          </a>
                          <a>
                            <div className="cardmethod_design">
                              <div className="creditdebit_carddiv">
                                <div className="cardnamewithicon">
                                  <img
                                    src={`${process.env.PUBLIC_URL}/images/axis_icon.png`}
                                    // src="images/axis_icon.png"
                                  />
                                  <p>Axis Bank</p>
                                </div>
                                <div className="arrowicondiv rotate270forotherpayment">
                                  <img
                                    src={`${process.env.PUBLIC_URL}/images/arrow_icon_payment.png`}
                                    // src="images/arrow_icon_payment.png"
                                  />
                                </div>
                              </div>
                            </div>
                          </a>
                        </div>
                      </div>
                      <div className="methodsdivnew">
                        <div className="paymentmethodsheaidng">
                          <h4>UPI</h4>
                        </div>
                        <a href="#!">
                          <div className="cardmethod_design mrgnbtmforupistripe">
                            <div className="creditdebit_carddiv">
                              <div className="cardnamewithicon">
                                <img
                                  src={`${process.env.PUBLIC_URL}/images/gpay_icon.png`}
                                  // src="images/gpay_icon.png"
                                />
                                <p>GPay</p>
                              </div>
                              <div className="arrowicondiv rotate270forotherpayment">
                                <img
                                  src={`${process.env.PUBLIC_URL}/images/arrow_icon_payment.png`}
                                  // src="images/arrow_icon_payment.png"
                                />
                              </div>
                            </div>
                          </div>
                        </a>
                        <a href="#!">
                          <div className="cardmethod_design mrgnbtmforupistripe">
                            <div className="creditdebit_carddiv">
                              <div className="cardnamewithicon">
                                <img
                                  src={`${process.env.PUBLIC_URL}/images/paytm_icon.png`}
                                  // src="images/paytm_icon.png"
                                />
                                <p>Paytm</p>
                              </div>
                              <div className="arrowicondiv rotate270forotherpayment">
                                <img
                                  src={`${process.env.PUBLIC_URL}/images/arrow_icon_payment.png`}
                                  // src="images/arrow_icon_payment.png"
                                />
                              </div>
                            </div>
                          </div>
                        </a>
                        <a href="#!">
                          <div className="cardmethod_design mrgnbtmforupistripe">
                            <div className="creditdebit_carddiv">
                              <div className="cardnamewithicon">
                                <img
                                  src={`${process.env.PUBLIC_URL}/images/phonepay_icon.png`}
                                  // src="images/phonepay_icon.png"
                                />
                                <p>PhonePe</p>
                              </div>
                              <div className="arrowicondiv rotate270forotherpayment">
                                <img
                                  src={`${process.env.PUBLIC_URL}/images/arrow_icon_payment.png`}
                                  // src="images/arrow_icon_payment.png"
                                />
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default Checkout;
