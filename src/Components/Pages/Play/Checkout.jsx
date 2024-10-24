import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../../Loader/Loader";
import Swal from "sweetalert2";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [carts, setCarts] = useState("");
  const [isCardActive, setIsCardActive] = useState(false);
  const [isEntrysActive, setIsEntrysActive] = useState(false);
  const [isImageRotated, setIsImageRotated] = useState(false);
  const [contestDetails, setContestDetails] = useState(null); // For storing contest details
  const [contestId, setContestId] = useState(null); // For the contest ID
  const [tickets, setTickets] = useState(1);
  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoCodeApplied, setPromoCodeApplied] = useState(null); // Store promo code if any
  const [coordinates, setCoordinates] = useState([]);
  const [cardNumber, setCardNumber] = useState("");
  const [validUpto, setValidUpto] = useState("");
  const [cvv, setCvv] = useState("");
  const [promoApplied, setPromoApplied] = useState(false); // Tracks if the promo is successfully applied
  const [promoMessage, setPromoMessage] = useState("");
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      // setIsLoading(true);
      const response = await axios.get(`get-all-cart-items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      //  if (response.data.data.length === 0 && location.pathname === "/cart") {
      if (response.data.data.length === 0) {
        Swal.fire({
          icon: "info",
          title: "No Cart Items",
          text: "Your cart is currently empty.",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/");
          }
        });
      } else {
        setCarts(response.data.data || {});

        const contest = response.data.data[0]; // Assuming you want the first contest
        setContestDetails(contest);
        setContestId(contest.contest_id._id); // Set contest ID
        setTickets(contest.tickets_count); // Set the number of tickets
        setCoordinates(contest.user_coordinates); // Set user coordinates
        setPromoCodeApplied(contest.contest_id.promocodes);
      }
    } catch (error) {
      console.error("Error data:", error);
    } 
    // finally {
    //   setIsLoading(false);
    // }
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

  // Constants for discount application
  const DEFAULT_DISCOUNT = 0;

  // Calculation of cart values
  const calculatedCarts = useMemo(() => {
    // Ensure carts is always an array
    return (
      (Array.isArray(carts) &&
        carts.map((cart) => {
          const { contest_id } = cart || {}; // Ensure cart is defined

          // Ensure values are safe and default to 0 if undefined
          const ticketPrice = contest_id?.ticket_price || 0;
          const ticketsCount = cart?.tickets_count || 0;
          const gstRate = (contest_id?.gstRate || 0) / 100; // Convert percentage
          const platformFeeRate = (contest_id?.platformFeeRate || 0) / 100; // Convert percentage
          const gstOnPlatformFeeRate =
            (contest_id?.gstOnPlatformFeeRate || 0) / 100; // Convert percentage

          // Step 1: Calculate total ticket price
          const totalTicketPrice = ticketPrice * ticketsCount;

          // Step 2: Calculate GST on ticket price
          const gstAmount = totalTicketPrice * gstRate;

          // Step 3: Subtotal
          const subtotal = totalTicketPrice + gstAmount;

          // Step 4: Platform fee
          const platformFee = subtotal * platformFeeRate;

          // Step 5: GST on platform fee
          const gstOnPlatformFee = platformFee * gstOnPlatformFeeRate;

          // Step 6: Total Razorpay fee
          const totalRazorpayFee = platformFee + gstOnPlatformFee;

          // Step 7: Total payment by user
          const totalPayment = subtotal + totalRazorpayFee;

          return {
            ...cart,
            ticketPrice,
            totalTicketPrice: totalTicketPrice.toFixed(2),
            gstAmount: gstAmount.toFixed(2),
            subtotal: subtotal.toFixed(2),
            platformFee: platformFee.toFixed(2),
            gstOnPlatformFee: gstOnPlatformFee.toFixed(2),
            totalRazorpayFee: totalRazorpayFee.toFixed(2),
            totalPayment: totalPayment.toFixed(2),
          };
        })) ||
      []
    ); // Ensure it returns an empty array if carts is not an array
  }, [carts]);

  console.log("calculatedCarts", calculatedCarts);

  // Total calculations
  const totalBeforeDiscount = calculatedCarts.reduce((total, cart) => {
    return total + parseFloat(cart.totalPayment);
  }, 0);

  const totalAfterDiscount = totalBeforeDiscount - discountAmount;

  const handleApplyPromoCode = () => {
    const promo = promoCodeApplied.find((p) => p.promocode === promoCode);

    if (promo) {
      const totalBeforeDiscount = calculatedCarts.reduce((total, cart) => {
        return total + parseFloat(cart.totalPayment);
      }, 0);

      const discount = promo.amount || DEFAULT_DISCOUNT; // Default to 0 if undefined
      setDiscountAmount(discount);
      setPromoApplied(true);
      setPromoMessage(
        `Promo code applied successfully. Discount ₹${discount}.`
      );
    } else {
      setPromoApplied(false);
      setPromoMessage("Invalid promo code");
    }
  };

  const finalTotalPayment =
    discountAmount > 0 ? totalAfterDiscount : totalBeforeDiscount;

  const totalPayments = finalTotalPayment.toFixed(2);

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
        }
      );

      // Handle successful response
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
  console.log("cart", carts);
  console.log(
    "carts[0]?.contest_id?.user_coordinates",
    carts[0]?.user_coordinates
  );

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const Pay = async (data) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "v1/app/contest/save-contest-payments",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if the response is successful (you can customize this condition based on your API response)
      if (response) {
        Swal.fire(
          "Payment recorded!",
          "Your payment has been recorded successfully.",
          "success"
        ).then(() => {
          setTimeout(() => {
            navigate("/");
          }, 1000);
        });
      }
    } catch (error) {
      Swal.fire(
        "Error!",
        "There was a problem recording your payment.",
        "error"
      );
    }
  };

  const displayRazorpay = async () => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      Swal.fire("Failed to load Razorpay SDK. Are you online?");
      return;
    }

    const options = {
      key: "rzp_test_TYK1sgruH0AHoM", // Your Razorpay test key
      amount: Math.round(totalPayments * 100),
      currency: "INR",
      name: "SpotsBall",
      description: "Buy ticket to play",
      handler: function (response) {
        // Data to send to your API
        const paymentData = {
          contestId: carts[0]?.contest_id?._id, // Assuming you want the first contest_id
          paymentId: response.razorpay_payment_id,
          coordinates: carts[0]?.user_coordinates, // Replace with actual coordinates
          tickets: carts[0]?.tickets_count,
          amount: totalPayments,
          promocodesApplied: carts[0]?.contest_id?.promocodes?.map(
            ({ promocode, amount }) => ({ promocode, amount })
          ),
        };
        console.log("tickets", tickets);

        Pay(paymentData);
      },
      external: {
        wallets: ["paytm"], // Make sure Paytm is enabled for your account
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      Swal.fire(
        "Payment Failed!",
        `Error: ${response.error.description}`,
        "error"
      );
    });

    rzp1.open();
  };

  const validateInputs = () => {
    if (!cardNumber || !validUpto || !cvv) {
      Swal.fire("Please fill in all fields.");
      return false;
    }
    const cardNumberRegex = /^[0-9]{16}$/; // 16-digit card number
    if (!cardNumberRegex.test(cardNumber)) {
      Swal.fire("Please enter a valid card number.");
      return false;
    }
    const validUptoRegex = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY format
    if (!validUptoRegex.test(validUpto)) {
      Swal.fire("Please enter a valid expiry date (MM/YY).");
      return false;
    }
    const cvvRegex = /^[0-9]{3}$/; // 3-digit CVV
    if (!cvvRegex.test(cvv)) {
      Swal.fire("Please enter a valid CVV.");
      return false;
    }
    return true;
  };

  const handlePaymentClick = () => {
    displayRazorpay();
    // if (validateInputs()) {
    // }
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
                      carts.map((cart) => (
                        <div key={cart._id} className="cartstripe">
                          <div className="checkout_cartdiv">
                            <div className="cart_jackpotdetails cartwindiv_mainformov">
                              <div className="cart_windiv">
                                Win{" "}
                                <span className="winprice_cart">
                                  ₹{cart.contest_id.jackpot_price}
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
                                {cart.contest_id?.ticket_price *
                                  cart?.tickets_count}
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

                          <div className="entry">
                            <div className="detailes">
                              <div className="arrowicondiv">
                                <img
                                  src={`${process.env.PUBLIC_URL}/images/arrow_icon_payment.png`}
                                  className={`showclick_icon ${
                                    isImageRotated ? "rotate" : ""
                                  }`}
                                  alt="Arrow Icon"
                                  onClick={handleImageClick}
                                />
                              </div>
                              <div className="cardbills">
                                <div className="creditbils_div">
                                  <h4>Bill Details</h4>
                                </div>
                              </div>
                              <div
                                className={`details_inputs details_div ${
                                  isEntrysActive ? "active" : ""
                                }`}
                                style={{
                                  display: isEntrysActive ? "block" : "none",
                                }}
                              >
                                {calculatedCarts.map((cart, index) => (
                                  <div
                                    key={index}
                                    className="cart-itemss table-blockk"
                                  >
                                    <p>
                                      <strong>Items Total: </strong>₹
                                      {cart.totalTicketPrice}
                                    </p>

                                    <p>
                                      <strong>
                                        +GST (@{cart.contest_id.gstRate}%):{" "}
                                      </strong>
                                      ₹{cart.gstAmount}
                                    </p>
                                    <p>
                                      <strong>
                                        Subtotal (Base Amount + GST):{" "}
                                      </strong>
                                      ₹{cart.subtotal}
                                    </p>
                                    <hr />
                                    <p>
                                      <strong>
                                        Platform Fee (@
                                        {
                                          cart.contest_id.platformFeeRate
                                        }%):{" "}
                                      </strong>
                                      ₹{cart.platformFee}
                                    </p>
                                    <p>
                                      <strong>
                                        GST on Platform Fee (@
                                        {cart.contest_id.gstOnPlatformFeeRate}
                                        %):{" "}
                                      </strong>
                                      ₹{cart.gstOnPlatformFee}
                                    </p>
                                    <p>
                                      <strong>Total Razorpay Fee: </strong>₹
                                      {cart.totalRazorpayFee}
                                    </p>
                                    <hr />
                                    {promoApplied ? (
                                      <>
                                        <p>
                                          <strong>Discount: </strong>-₹
                                          {discountAmount.toFixed(2)}
                                        </p>
                                        {/* <p>
                                          <strong>After Discount: </strong>₹
                                          {totalAfterDiscount.toFixed(2)}
                                        </p> */}
                                      </>
                                    ) : null}
                                    <p>
                                      <strong>
                                        Grand Total (Subtotal + Razorpay):{" "}
                                      </strong>
                                      ₹
                                      {promoApplied
                                        ? totalAfterDiscount.toFixed(2)
                                        : cart.totalPayment}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
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
                          {carts &&
                            carts.map((cart) =>
                              cart.user_coordinates.map((coordinate, idx) => (
                                <tr key={coordinate._id}>
                                  <td>{idx + 1}</td>
                                  <td>{coordinate.x}</td>
                                  <td>{coordinate.y}</td>
                                </tr>
                              ))
                            )}
                        </tbody>
                      </table>
                    </div>
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
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <button
                          className="apply_button_cart"
                          onClick={handleApplyPromoCode}
                        >
                          Apply
                        </button>
                      </div>

                      {promoMessage && (
                        <div
                          className={`promo-message ${
                            promoApplied ? "success" : "error"
                          }`}
                        >
                          {promoMessage}
                        </div>
                      )}

                      <div className="methodsdivnew mt-4">
                        <div className="cardpay">
                          <div className="creditpays">
                            <div
                              className="cardpayment"
                              onClick={handlePaymentClick}
                            >
                              <p>Proceed to Pay</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <div className="methodsdivnew">
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
                                aria-label="Card Number"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                              />
                            </div>
                            <div className="validupto_cvv">
                              <div className="cardnumberinput">
                                <input
                                  type="text"
                                  className="input_cardsnew"
                                  placeholder="Valid Upto (MM/YY)"
                                  aria-label="Valid Until"
                                  value={validUpto}
                                  onChange={(e) => setValidUpto(e.target.value)}
                                />
                              </div>
                              <div className="cardnumberinput">
                                <input
                                  type="text"
                                  className="input_cardsnew"
                                  placeholder="CVV"
                                  aria-label="CVV"
                                  value={cvv}
                                  onChange={(e) => setCvv(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="paybtn_card">
                              <button
                                onClick={handlePaymentClick}
                                className="btn btn-primary"
                              >
                                Pay ₹{totalPayments}
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
                                  <img
                                    src={`${process.env.PUBLIC_URL}/images/arrow_icon_payment.png`}
                                  />
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
                      </div> */}
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
