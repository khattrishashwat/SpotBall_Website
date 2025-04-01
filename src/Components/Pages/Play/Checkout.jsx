import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../../Loader/Loader";
import Swal from "sweetalert2";
import { load } from "@cashfreepayments/cashfree-js";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [carts, setCarts] = useState("");
  const [calculatedCarts, setCalculatedCarts] = useState([]);
  const [alertShown, setAlertShown] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(""); // Store payment status
  const [viewPopup, setViewPopup] = useState(false);

  const [isEntrysActive, setIsEntrysActive] = useState(false);
  const [isImageRotated, setIsImageRotated] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discounts, setDiscounts] = useState([]);
  const [isOrder, setIsOrder] = useState("");

  const [promoApplied, setPromoApplied] = useState(false); // Tracks if the promo is successfully applied
  const [promoMessage, setPromoMessage] = useState("");
  const [selectedPromoCode, setSelectedPromoCode] = useState({});
  const [promoCodes, setPromoCodes] = useState([]);
  const [appliedPromoCode, setAppliedPromoCode] = useState(null);
  const [reloadData, setReloadData] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleImageClick = () => {
    setIsEntrysActive(!isEntrysActive);
    setIsImageRotated(!isImageRotated);
  };
  const isFetched = useRef(false);
  const fetchData = async () => {
    if (isFetched.current) return; // Ensure API is only called once
    isFetched.current = true;

    const token = localStorage.getItem("Web-token");

    try {
      const response = await axios.get("app/contest/get-all-cart-items", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { cartItems, discounts, promocodes } = response.data.data;

      if (cartItems.length === 0 && !alertShown) {
        setAlertShown(true); // Prevent multiple alerts

        Swal.fire({
          icon: "info",
          text: "No game has been played yet.",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) navigate("/");
        });
      }

      setCarts(cartItems);

      const calculated = cartItems.map((cart) => {
        const {
          ticket_price: ticketPrice,
          gstRate,
          platformFeeRate,
          gstOnPlatformFeeRate,
        } = cart.contest_id;

        const ticketsCount = cart.tickets_count;
        const totalTicketPrice = ticketPrice * ticketsCount;
        const gstAmount = totalTicketPrice * (gstRate / 100);
        const subtotal = totalTicketPrice + gstAmount;
        const platformFee = subtotal * (platformFeeRate / 100);
        const gstOnPlatformFee = platformFee * (gstOnPlatformFeeRate / 100);
        const totalRazorpayFee = platformFee + gstOnPlatformFee;
        const totalPayment = subtotal + totalRazorpayFee;

        const initialCart = {
          ...cart,
          totalTicketPrice: totalTicketPrice.toFixed(2),
          gstAmount: gstAmount.toFixed(2),
          subtotal: subtotal.toFixed(2),
          platformFee: platformFee.toFixed(2),
          gstOnPlatformFee: gstOnPlatformFee.toFixed(2),
          totalRazorpayFee: totalRazorpayFee.toFixed(2),
          totalPayment: totalPayment.toFixed(2),
          promoCode: cart.promocodeApplied || null, // Store applied promo code
          discount: null,
        };

        // Apply the same formula for both promo code and regular discount
        if (cart.promocodeApplied) {
          const appliedPromo = cart.promocodeApplied; // Use applied promo

          initialCart.discount = {
            name: appliedPromo.name, // Promo code name
            discountPercentage: appliedPromo.amount, // Treat amount as a percentage
            amount: (totalTicketPrice * appliedPromo.amount) / 100, // Apply discount formula
          };
        } else {
          // Apply regular discount logic if no promo code is applied
          const applicableDiscount = discounts.find(
            (discount) =>
              ticketsCount >= discount.minTickets &&
              ticketsCount <= discount.maxTickets
          );

          if (applicableDiscount) {
            initialCart.discount = {
              name: applicableDiscount.name,
              discountPercentage: applicableDiscount.discountPercentage,
              amount:
                (totalTicketPrice * applicableDiscount.discountPercentage) /
                100, // Apply same formula
            };
          }
        }

        return initialCart;
      });

      setCalculatedCarts(calculated);
      setDiscounts(discounts || []);
      setPromoCodes(promocodes || []);
    } catch (error) {
      console.error(
        "Error fetching cart data:",
        error.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, [reloadData]);

  const totalBeforeDiscount = calculatedCarts.reduce((total, cart) => {
    let discountedTotalTicketPrice = parseFloat(cart.totalTicketPrice);

    if (cart.promocodeApplied) {
      // Promo Code Apply Hai -> Discount Ko Ignore Karo
      cart.discount = null;
      discountedTotalTicketPrice = Math.max(
        discountedTotalTicketPrice -
          (discountedTotalTicketPrice * cart.promocodeApplied.amount) / 100,
        0
      );
    } else if (cart.discount) {
      // Discount Apply Hai -> Promo Code Ko Ignore Karo
      cart.promocodeApplied = null;
      discountedTotalTicketPrice = Math.max(
        discountedTotalTicketPrice -
          (discountedTotalTicketPrice * cart.discount.discountPercentage) / 100,
        0
      );
    }

    // Normal Calculation (GST, Platform Fee, etc.)
    const discountedGstAmount =
      discountedTotalTicketPrice * ((cart.contest_id?.gstRate || 0) / 100);
    const discountedSubtotal = discountedTotalTicketPrice + discountedGstAmount;
    const discountedPlatformFee =
      discountedSubtotal * ((cart.contest_id?.platformFeeRate || 0) / 100);
    const discountedGstOnPlatformFee =
      discountedPlatformFee *
      ((cart.contest_id?.gstOnPlatformFeeRate || 0) / 100);
    const discountedGrandTotal =
      discountedSubtotal + discountedPlatformFee + discountedGstOnPlatformFee;

    return total + discountedGrandTotal;
  }, 0);

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      Swal.fire({
        icon: "warning",
        text: "Please enter a promo code before applying.",
      });
      return;
    }

    if (appliedPromoCode && appliedPromoCode.name === promoCode) {
      Swal.fire({
        icon: "info",
        title: "Promo Code Already Applied.",
      });
      return;
    }

    const promo = promoCodes.find((code) => code.name === promoCode);

    if (promo) {
      const updatedCarts = calculatedCarts.map((cart) => ({
        ...cart,
        discount: null, // Remove any existing discount
        promocodeApplied: {
          name: promo.name,
          amount: promo.amount,
        },
      }));

      setCalculatedCarts(updatedCarts);
      setAppliedPromoCode(promo);
      setSelectedPromoCode(selectedPromoCode);

      Swal.fire({
        icon: "success",
        text: `Promo code "${promo.name}" applied. Discount: ${promo.amount}%.`,
      });

      try {
        const updatedCart = updatedCarts[0];
        if (!updatedCart) return;

        const payload = {
          contest_id: updatedCart?.contest_id?._id,
          tickets_count: updatedCart?.tickets_count,
          user_coordinates: updatedCart?.user_coordinates,
          promocodeApplied: {
            name: promo.name,
            amount: promo.amount,
          },
        };

        const token = localStorage.getItem("Web-token");
        await axios.post("app/contest/add-to-cart", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setReloadData((prev) => !prev);

        Swal.fire({
          icon: "success",
          title: "Promo Code Applied Successfully.",
        });
      } catch (error) {
        console.error("API Error:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to Apply Promo Code.",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid Promo Code.",
      });
    }
  };

  const calculateDiscounts = (cart) => {
    const promoDiscountName = cart.promocodeApplied
      ? cart.promocodeApplied.name
      : null;
    const PromoAmount = cart.promocodeApplied
      ? cart.promocodeApplied.amount
      : 0;
    const promoDiscountAmount = cart.promocodeApplied
      ? (cart.totalTicketPrice * cart.promocodeApplied.amount) / 100
      : 0;

    const discountPercentage = cart.discount
      ? cart.discount.discountPercentage
      : 0;
    const discountAmount = !cart.contest_id.promocodeApplied
      ? (cart.totalTicketPrice * discountPercentage) / 100
      : 0;

    console.log("Promo Amount:", PromoAmount);
    console.log("Promo Discount:", promoDiscountAmount);
    console.log("Regular Discount:", discountAmount);

    const discountedTotalTicketPrice = Math.max(
      cart.totalTicketPrice - promoDiscountAmount - discountAmount,
      0
    ).toFixed(2);

    const discountedGstAmount = (
      discountedTotalTicketPrice *
      (cart.contest_id.gstRate / 100)
    ).toFixed(2);

    const discountedSubtotal = (
      parseFloat(discountedTotalTicketPrice) + parseFloat(discountedGstAmount)
    ).toFixed(2);

    const discountedPlatformFee = (
      discountedSubtotal *
      (cart.contest_id.platformFeeRate / 100)
    ).toFixed(2);

    const discountedGstOnPlatformFee = (
      discountedPlatformFee *
      (cart.contest_id.gstOnPlatformFeeRate / 100)
    ).toFixed(2);

    const discountedTotalRazorpayFee = (
      parseFloat(discountedPlatformFee) + parseFloat(discountedGstOnPlatformFee)
    ).toFixed(2);

    const discountedGrandTotal = (
      parseFloat(discountedSubtotal) + parseFloat(discountedTotalRazorpayFee)
    ).toFixed(2);

    console.log("new pee", discountPercentage);
    console.log("new ", discountAmount);
    return {
      promoDiscountName,
      PromoAmount,
      promoDiscountAmount,
      discountPercentage,
      discountAmount,
      discountedTotalTicketPrice,
      discountedGstAmount,
      discountedSubtotal,
      discountedPlatformFee,
      discountedGstOnPlatformFee,
      discountedTotalRazorpayFee,
      discountedGrandTotal,
    };
  };

  const handleCrossClick = async (cart) => {
    const { contest_id, tickets_count, user_coordinates } = cart;
    const token = localStorage.getItem("Web-token");

    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.get(
            `app/contest/remove-cart-item/${cart._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              params: {
                contest_id: contest_id._id,
                tickets_count,
                user_coordinates: {
                  x: user_coordinates.x,
                  y: user_coordinates.y,
                },
              },
            }
          );

          // Handle successful response
          Swal.fire({
            title: "Success!",
            text: response.data.message,
            icon: "success",
            allowOutsideClick: false,
            confirmButtonText: "OK",
            showConfirmButton: true,
          });
          navigate("/");

          // Optionally, remove the cart from the state
          setCarts((prevCarts) => prevCarts.filter((c) => c._id !== cart._id));
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: "Error!",
            text: error.response?.data?.message,
            confirmButtonText: "OK",
            allowOutsideClick: false,
            icon: "error",
          });
        }
      }
    });
  };


  const Money = async () => {
    try {
      const token = localStorage.getItem("Web-token");
      const order_amount = totalBeforeDiscount.toFixed(2);

      console.log("Total Before Discount:", order_amount);

      // Step 1: Call Money API to get paymentSessionId
      const response = await axios.post(
        "app/cashfree/create-order",
        { order_amount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Extract payment order ID and payment session ID from the response
      const paymentOrderId = response.data?.data?.order_id;
      const paymentSessionId = response.data?.data?.payment_session_id;
      setIsOrder(paymentOrderId);

      if (!paymentOrderId) {
        console.error("Error: Payment order ID is missing.");
        Swal.fire({
          icon: "error",
          title: "Payment Error",
          text: "Payment order ID is missing. Please try again.",
        });
        return;
      }

      // Call preparePaymentData and Pay function
      const paymentData = preparePaymentData(paymentOrderId);
      Pay(paymentData);

      // ✅ If order_amount === 0, do NOT open Cashfree, just navigate to home
      if (parseFloat(order_amount) === 0) {
        console.log("Order amount is zero, skipping Cashfree payment.");
        Swal.fire({
          icon: "success",
          title: "Payment Successful",
          text: "Your order has been placed successfully.",
        }).then(() => {
          navigate("/"); // Navigate to home
        });
        return; // Exit function
      }

      // ✅ If order_amount > 0, initialize Cashfree SDK
      let cashfree;
      try {
        // cashfree = await load({ mode: "sandbox" });
        cashfree = await load({ mode: "production" });
        console.log("Cashfree SDK initialized successfully.");
      } catch (sdkError) {
        console.error("SDK Initialization Error:", sdkError);
        Swal.fire({
          icon: "error",
          title: "SDK Error",
          text: "Failed to initialize payment gateway. Please try again.",
        });
        return;
      }

      // Step 3: Configure Cashfree Checkout
      const checkoutOptions = {
        paymentSessionId,
        redirectTarget: "_modal",
        callback_url: `https://www.spotsball.com/popupCheckout?order_id=${paymentOrderId}`,
      };

      // Step 4: Process Payment
      cashfree
        .checkout(checkoutOptions)
        .then(async (result) => {
          if (result.error) {
            console.error("Payment Failed Error:", result.error);
            Swal.fire({
              icon: "error",
              title: "Payment Failed",
              text: result.error,
            });
          } else if (result.paymentDetails) {
            console.log("Payment Details:", result.paymentDetails);
            const paymentStatus = result.paymentDetails.paymentStatus;

            await OrderStatus(paymentOrderId);

            if (paymentStatus === "SUCCESS") {
              console.log("Payment Successful!");
              await OrderStatus(paymentOrderId);
              window.location.href = `https://www.spotsball.com/popupCheckout?order_id=${paymentOrderId}`;
            } else if (paymentStatus === "FAILED") {
              console.error("Transaction Failed!");
              Swal.fire({
                icon: "error",
                title: "Transaction Failed",
                text: "Your payment could not be processed. Please try again later.",
              });
            } else if (paymentStatus === "PENDING") {
              await OrderStatus(paymentOrderId);
              console.log("Payment Pending. Redirecting...");
              window.location.href = `https://www.spotsball.com/popupCheckout?order_id=${paymentOrderId}`;
            }
          } else {
            console.log("User closed the payment window.");
            Swal.fire({
              icon: "info",
              title: "Payment Cancelled",
              text: "You have closed the payment window.",
            });
          }
        })
        .catch((checkoutError) => {
          console.error("Checkout Error:", checkoutError);
          Swal.fire({
            icon: "error",
            title: "Checkout Error",
            text: "An error occurred during checkout. Please try again.",
          });
        });
    } catch (error) {
      console.error(
        "Money API Error:",
        error.response?.data?.message || error.message
      );
      Swal.fire({
        icon: "error",
        title: "Payment Error",
        text:
          error.response?.data?.message ||
          "An unexpected error occurred. Please try again.",
      });
    }
  };

  const preparePaymentData = (paymentOrderId) => {
    if (!calculatedCarts.length) {
      throw new Error("Cart data is missing or incomplete.");
    }

    // const cart = carts[0];
    const calculatedCart = calculatedCarts[0];

    const contestId = calculatedCart?.contest_id?._id;
    const coordinates = calculatedCart?.user_coordinates || [];
    const tickets = calculatedCart.tickets_count;
    // const contestId = cart?.contest_id?._id;
    // const coordinates = cart?.user_coordinates || [];
    // const tickets = carts.reduce(
    //   (total, cart) => total + (cart.tickets_count || 0),
    //   0
    // );

    const discount = calculatedCart?.discount || {};
    const discountPercentage = discount.discountPercentage || 0;

    const promoCode = calculatedCart?.promoCode || {};
    const promoName = promoCode.name || "";
    const promoAmount = promoCode.amount || 0;

    const ticketPrice = calculatedCart?.contest_id?.ticket_price || 0;
    const ticketAmount = ticketPrice * tickets;

    const discountAmount = (ticketAmount * discountPercentage) / 100;
    const afterDiscountAmount = ticketAmount - discountAmount;

    const afterPromoAmount = ticketAmount - promoAmount;

    const gstRate = calculatedCart?.contest_id?.gstRate || 0;

    // Use afterDiscountAmount if it has a value; otherwise, use afterPromoAmount.
    const gstAmount =
      ((afterDiscountAmount ? afterDiscountAmount : afterPromoAmount) *
        gstRate) /
      100;

    const subTotalAmount = afterDiscountAmount
      ? afterDiscountAmount + gstAmount
      : afterPromoAmount + gstAmount;

    const platformFeeRate = calculatedCart?.contest_id?.platformFeeRate || 2;
    const platformFeeAmount = (afterDiscountAmount * platformFeeRate) / 100;

    const gstOnPlatformFeeRate =
      calculatedCart?.contest_id?.gstOnPlatformFeeRate || 0;
    const gstOnPlatformFeeAmount =
      (platformFeeAmount * gstOnPlatformFeeRate) / 100;

    return {
      contestId,
      paymentId: paymentOrderId,
      coordinates,
      tickets,
      discountApplied: {
        name: promoName || discount?.name,
        discountPercentage: discountPercentage || promoAmount,
      },
      // discountApplied: {
      //   name: discount.name || "",
      //   discountPercentage,
      // },
      ticketAmount,
      discountAmount,
      afterDiscountAmount,
      gstPercentage: gstRate,
      gstAmount,
      subTotalAmount,
      platformFeePercentage: platformFeeRate,
      platformFeeAmount,
      gstOnPlatformFeePercentage: gstOnPlatformFeeRate,
      gstOnPlatformFeeAmount,
      totalRazorPayFeeAmount: platformFeeAmount + gstOnPlatformFeeAmount,
      amount: totalBeforeDiscount,
    };
  };

  // const OrderStatus = async (paymentOrderId) => {
  //   try {
  //     const token = localStorage.getItem("Web-token");
  //     //    console.log("token", token); // Verify token is being retrieved correctly
  //     if (token) {
  //       const response = await axios.post(
  //         `app/cashfree/update-order-status?order_id=${paymentOrderId}`,
  //         {}, // Body (optional, empty here)
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       const status = response.data?.data?.transaction_status || "";
  //       console.log("status", status);
  //       setPaymentStatus(status);
  //       if (
  //         status === "SUCCESS" ||
  //         status === "PENDING" ||
  //         status === "FAILED" ||
  //         status === "Unknown"
  //       ) {
  //         setViewPopup(true);
  //       }
  //     }
  //   } catch (error) {
  //     console.error(error.response?.data || error.message); // Handle the error appropriately
  //   }
  // };

  const OrderStatus = async (paymentOrderId) => {
    try {
      const token = localStorage.getItem("Web-token");
      if (token) {
        const response = await axios.post(
          `app/cashfree/update-order-status?order_id=${paymentOrderId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const status = response.data?.data?.transaction_status || "";
        console.log("status", status);
        setPaymentStatus(status);

        // Show success message
        Swal.fire({
          title: "Thank You!",
          text: "Thank you for participating.",
        }).then(() => {
          navigate("/payments");
        }, 1000);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      Swal.fire({
        text: error.response?.data || error.message,
      }).then(() => {
        navigate("/");
      }, 1000);
    }
  };

  const Pay = async (data) => {
    const token = localStorage.getItem("Web-token");

    try {
      const response = await axios.post(
        "app/payments/save-contest-payments",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response) {
      }
    } catch (error) {}
  };
  const handlePaymentClick = () => {
    Money();
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
                <div className="col-lg-5 coltabbingdiv">
                  <div className="cartwithcordinatetables">
                    {carts.length > 0 &&
                      carts.map((cart) => (
                        <div key={cart._id} className="cartstripe">
                          <div className="checkout_cartdiv">
                            <div className="cart_jackpotdetails cartwindiv_mainformov">
                              <div className="cart_windiv">
                                Win{" "}
                                <span className="winprice_cart">
                                  ₹
                                  {Number(
                                    cart.contest_id.jackpot_price
                                  ).toLocaleString()}
                                </span>
                              </div>
                              <div className="jackpot_ticket_cart">
                                <h3>
                                  ₹
                                  {Number(
                                    cart.contest_id.jackpot_price
                                  ).toLocaleString()}{" "}
                                  Jackpot
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
                                src={`${process.env.PUBLIC_URL}/image/cross_cart.png`}
                                alt="Close"
                              />
                            </button>
                          </div>

                          <div className="entry">
                            <div className="detailes">
                              <div className="arrowicondiv">
                                <img
                                  src={`${process.env.PUBLIC_URL}/image/arrow_icon_payment.png`}
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
                                {calculatedCarts.map((cart, index) => {
                                  const {
                                    promoDiscountAmount,
                                    PromoAmount,
                                    discountPercentage,
                                    discountAmount,
                                    discountedTotalTicketPrice,
                                    discountedGstAmount,
                                    discountedSubtotal,
                                    discountedPlatformFee,
                                    discountedGstOnPlatformFee,
                                    discountedTotalRazorpayFee,
                                    discountedGrandTotal,
                                  } = calculateDiscounts(cart);

                                  return (
                                    <div
                                      key={index}
                                      className="cart-itemss table-blockk"
                                    >
                                      <p>
                                        <strong>Items Total: </strong>₹
                                        {cart.totalTicketPrice}
                                      </p>
                                      {cart.promoCode && (
                                        <>
                                          <p>
                                            <strong>
                                              Promo Applied({PromoAmount}
                                              %):
                                            </strong>{" "}
                                            ₹{promoDiscountAmount}
                                          </p>
                                          <p>
                                            <strong>After: </strong>₹
                                            {discountedTotalTicketPrice}
                                          </p>
                                        </>
                                      )}
                                      {cart.discount && (
                                        <>
                                          <p className="discount-line">
                                            <strong>
                                              Discount ({discountPercentage}%):
                                            </strong>{" "}
                                            ₹{discountAmount}
                                          </p>
                                          <p>
                                            <strong>After: </strong>₹
                                            {discountedTotalTicketPrice}
                                          </p>
                                        </>
                                      )}
                                      <p>
                                        <strong>
                                          +GST (@{cart.contest_id.gstRate}%):{" "}
                                        </strong>
                                        ₹{discountedGstAmount}
                                      </p>
                                      <p>
                                        <strong>
                                          Subtotal (Base Amount + GST):{" "}
                                        </strong>
                                        ₹{discountedSubtotal}
                                      </p>
                                      <hr />
                                      <p>
                                        <strong>
                                          Platform Fee (@
                                          {
                                            cart.contest_id.platformFeeRate
                                          }%):{" "}
                                        </strong>
                                        ₹{discountedPlatformFee}
                                      </p>
                                      <p>
                                        <strong>
                                          GST on Platform Fee (@
                                          {cart.contest_id.gstOnPlatformFeeRate}
                                          %):{" "}
                                        </strong>
                                        ₹{discountedGstOnPlatformFee}
                                      </p>
                                      <p>
                                        <strong>Total Platform Fee: </strong>₹
                                        {discountedTotalRazorpayFee}
                                      </p>
                                      <hr />
                                      <p>
                                        <strong>
                                          Grand Total (Subtotal + Platform):{" "}
                                        </strong>
                                        ₹{discountedGrandTotal}
                                      </p>
                                    </div>
                                  );
                                })}
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
                          {carts[0]?.user_coordinates?.map(
                            (coordinate, index) => (
                              <tr key={coordinate._id}>
                                <td>{index + 1}</td>
                                <td>{coordinate.x}</td>
                                <td>{coordinate.y}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="col-lg-7 coltabdata_righttext">
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

                      <div
                        className="methodsdivnew mt-4"
                        onClick={handlePaymentClick}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="cardpay">
                          <div className="creditpays">
                            <div className="cardpayment">
                              <p>Pay Now</p>
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
        )}
      </section>
    </>
  );
}

export default Checkout;
