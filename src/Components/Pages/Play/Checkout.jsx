import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../../Loader/Loader";
import Swal from "sweetalert2";
import { load } from "@cashfreepayments/cashfree-js";
import { IconBase } from "react-icons";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [carts, setCarts] = useState("");
  const [calculatedCarts, setCalculatedCarts] = useState([]);
  const [alertShown, setAlertShown] = useState(false);

  const [isEntrysActive, setIsEntrysActive] = useState(false);
  const [isImageRotated, setIsImageRotated] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discounts, setDiscounts] = useState([]);

  const [promoApplied, setPromoApplied] = useState(false); // Tracks if the promo is successfully applied
  const [promoMessage, setPromoMessage] = useState("");
  const [selectedPromoCode, setSelectedPromoCode] = useState({});
  const [promoCodes, setPromoCodes] = useState([]);
  const [appliedPromoCode, setAppliedPromoCode] = useState(null);

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
          promoCode: cart.promocodeApplied || null, // Use promocodeApplied if present
          discount: null,
        };

        // Apply discount logic only if promocode is not present
        if (!cart.promocodeApplied) {
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
                100,
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
    fetchData(); // Call API only once when component mounts
  }, []);

  // const fetchData = async () => {
  //   const token = localStorage.getItem("Web-token");
  //   try {
  //     const response = await axios.get("app/contest/get-all-cart-items", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     const { cartItems, discounts, promocodes } = response.data.data;

  //     if (cartItems.length === 0 && !alertShown) {
  //       setAlertShown(true); // Set alert shown to true to prevent multiple alerts

  //       Swal.fire({
  //         icon: "info",
  //         text: "No game has been played yet.",
  //         confirmButtonText: "OK",
  //         allowOutsideClick: false,
  //       }).then((result) => {
  //         if (result.isConfirmed) navigate("/");
  //       });
  //     }

  //     setCarts(cartItems);

  //     const calculated = cartItems.map((cart) => {
  //       const {
  //         ticket_price: ticketPrice,
  //         gstRate,
  //         platformFeeRate,
  //         gstOnPlatformFeeRate,
  //       } = cart.contest_id;

  //       const ticketsCount = cart.tickets_count;

  //       const totalTicketPrice = ticketPrice * ticketsCount;
  //       const gstAmount = totalTicketPrice * (gstRate / 100);
  //       const subtotal = totalTicketPrice + gstAmount;
  //       const platformFee = subtotal * (platformFeeRate / 100);
  //       const gstOnPlatformFee = platformFee * (gstOnPlatformFeeRate / 100);
  //       const totalRazorpayFee = platformFee + gstOnPlatformFee;
  //       const totalPayment = subtotal + totalRazorpayFee;

  //       const initialCart = {
  //         ...cart,
  //         totalTicketPrice: totalTicketPrice.toFixed(2),
  //         gstAmount: gstAmount.toFixed(2),
  //         subtotal: subtotal.toFixed(2),
  //         platformFee: platformFee.toFixed(2),
  //         gstOnPlatformFee: gstOnPlatformFee.toFixed(2),
  //         totalRazorpayFee: totalRazorpayFee.toFixed(2),
  //         totalPayment: totalPayment.toFixed(2),
  //         promoCode: cart.promocodeApplied || null, // Use promocodeApplied if present
  //         discount: null,
  //       };

  //       // Apply discount logic only if promocode is not present
  //       if (!cart.promocodeApplied) {
  //         const applicableDiscount = discounts.find(
  //           (discount) =>
  //             ticketsCount >= discount.minTickets &&
  //             ticketsCount <= discount.maxTickets
  //         );

  //         if (applicableDiscount) {
  //           initialCart.discount = {
  //             name: applicableDiscount.name,
  //             discountPercentage: applicableDiscount.discountPercentage,
  //             amount:
  //               (totalTicketPrice * applicableDiscount.discountPercentage) /
  //               100,
  //           };
  //         }
  //       }

  //       return initialCart;
  //     });

  //     setCalculatedCarts(calculated);
  //     setDiscounts(discounts || []);
  //     setPromoCodes(promocodes || []);
  //   } catch (error) {
  //     console.error(
  //       "Error fetching cart data:",
  //       error.response?.data?.message || error.message
  //     );
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const totalBeforeDiscount = calculatedCarts.reduce((total, cart) => {
    if (cart.promoCode) {
      return total + parseFloat(cart.totalPayment);
    } else if (cart.discount) {
      const discountedTotalTicketPrice = Math.max(
        parseFloat(cart.totalTicketPrice) - cart.discount.amount,
        0
      );

      const discountedGstAmount =
        discountedTotalTicketPrice * ((cart.contest_id?.gstRate || 0) / 100);
      const discountedSubtotal =
        discountedTotalTicketPrice + discountedGstAmount;
      const discountedPlatformFee =
        discountedSubtotal * ((cart.contest_id?.platformFeeRate || 0) / 100);
      const discountedGstOnPlatformFee =
        discountedPlatformFee *
        ((cart.contest_id?.gstOnPlatformFeeRate || 0) / 100);
      const discountedGrandTotal =
        discountedSubtotal + discountedPlatformFee + discountedGstOnPlatformFee;

      return total + discountedGrandTotal;
    } else {
      return total + parseFloat(cart.totalPayment);
    }
  }, 0);

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Promo Code Required",
        text: "Please enter a promo code before applying.",
      });
      return;
    }

    // Check if a promo code has already been applied
    if (appliedPromoCode && appliedPromoCode.name === promoCode) {
      Swal.fire({
        icon: "info",
        title: "Promo Code Already Applied",
        text: `The promo code "${promoCode}" has already been applied.`,
      });
      return;
    }

    const promo = promoCodes.find((code) => code.name === promoCode);

    if (promo) {
      const updatedCarts = calculatedCarts.map((cart) => {
        const promoDiscountAmount = Math.min(
          promo.amount,
          parseFloat(cart.totalPayment)
        );
        const discountedTotalPayment = Math.max(
          parseFloat(cart.totalPayment) - promoDiscountAmount,
          0
        );

        return {
          ...cart,
          discount: null,
          promoCode: {
            name: promo.name,
            amount: promoDiscountAmount,
          },
          totalPayment: discountedTotalPayment.toFixed(2),
        };
      });

      setCalculatedCarts(updatedCarts);
      setSelectedPromoCode(promoCode);
      setAppliedPromoCode(promo); // Set applied promo code

      Swal.fire({
        icon: "success",
        title: "Promo Code Applied!",
        text: `Promo code "${promo.name}" applied. Discount: ₹${promo.amount}`,
      });

      // POST API call
      const payload = {
        contest_id: calculatedCarts[0]?.contest_id?._id, // Replace with actual contest ID
        tickets_count: calculatedCarts[0]?.tickets_count, // Example: total tickets count
        user_coordinates: calculatedCarts[0]?.user_coordinates, // Replace with actual coordinates
        promocodeApplied: {
          name: promo.name,
          amount: promo.amount,
        },
      };

      const token = localStorage.getItem("Web-token");
      try {
        const response = await axios.post("app/contest/add-to-cart", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire({
          icon: "success",
          title: "Promo Code Applied Successfully",
          text: `Discount applied and data sent successfully.`,
        });
      } catch (error) {
        console.error("API Error:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to Apply Promo Code",
          text: "There was an error applying the promo code. Please try again.",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid Promo Code",
        text: "The promo code you entered is not valid.",
      });
    }
  };

  const calculateDiscounts = (cart) => {
    const promoDiscountName = cart.promoCode ? cart.promoCode.name : 0;
    const promoDiscountAmount = cart.promoCode ? cart.promoCode.amount : 0;
    const PerDiscount = cart.discount ? cart.discount.discountPercentage : 0;
    const discountPerCart = cart.discount ? cart.discount.amount : "0.00";

    const discountedTotalTicketPrice = Math.max(
      cart.totalTicketPrice - discountPerCart - promoDiscountAmount,
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

    // console.log("new", {
    //   promoDiscountAmount,
    //   PerDiscount,
    //   discountPerCart,
    //   discountedTotalTicketPrice,
    //   discountedGstAmount,
    //   discountedSubtotal,
    //   discountedPlatformFee,
    //   discountedGstOnPlatformFee,
    //   discountedTotalRazorpayFee,
    //   discountedGrandTotal,
    // });

    return {
      promoDiscountName,
      promoDiscountAmount,
      PerDiscount,
      discountPerCart,
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
      text: "Do you really w  ant to delete this item?",
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
  // const Money = async () => {
  //   const token = localStorage.getItem("Web-token");
  //   if (!token) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error!",
  //       text: "You are not authenticated. Please log in.",
  //     });
  //     return;
  //   }
  //   console.log("new", totalBeforeDiscount);

  //   try {
  //     // Step 1: Call Money API to get paymentSessionId
  //     const response = await axios.post(
  //       "app/cashfree/create-order",
  //       { order_amount: Math.round(totalBeforeDiscount) }, // Ensure totalBeforeDiscount is defined
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     // Log the full response for debugging
  //     console.log("API Response:", response.data);

  //     // Extract payment session ID from the response
  //     const paymentOrderId = response.data?.data?.order_id;
  //     const paymentSessionId = response.data?.data?.payment_session_id;

  //     // Ensure paymentSessionId is present
  //     if (!paymentSessionId) {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Error!",
  //         text: "Payment session ID is missing. Unable to proceed with payment.",
  //       });
  //       return;
  //     }

  //     console.log("Payment Session ID:", paymentSessionId);

  //     // Step 2: Initialize Cashfree SDK in production mode
  //     let cashfree;
  //     try {
  //       cashfree = await load({
  //         mode: "production",
  //         environment: "production",

  //         // mode: "PRODUCTION",
  //         // environment: "PRODUCTION", // Always use production mode
  //       });
  //       console.log("Cashfree SDK initialized successfully.");
  //     } catch (sdkError) {
  //       Swal.fire({
  //         icon: "error",
  //         title: "SDK Initialization Error",
  //         text: "Failed to initialize Cashfree SDK. Please try again later.",
  //       });
  //       console.error("SDK Initialization Error:", sdkError);
  //       return;
  //     }

  //     // Step 3: Configure Cashfree Checkout for production mode
  //     const checkoutOptions = {
  //       paymentSessionId,
  //       // mode: "PRODUCTION", // Always use production mode
  //       mode: "production", // Always use production mode
  //       callback_url: `https://www.spotsball.com/spotsball/web/popupCheckout?order_id={paymentOrderId}`,
  //     };

  //     // Handle checkout and payment result
  //     cashfree.checkout(checkoutOptions).then(async (result) => {
  //       if (result.error) {
  //         Swal.fire({
  //           icon: "error",
  //           title: "Payment Error!",
  //           text: result.error.data || result.error.message,
  //         });
  //         console.error("Checkout Error:", result.error);
  //       } else if (result.paymentDetails) {
  //         Swal.fire({
  //           icon: "success",
  //           title: "Payment Successful!",
  //           text:
  //             result.paymentDetails.paymentMessage ||
  //             result.paymentDetails.paymentMessage,
  //         });

  //         // Prepare payment data
  //         const paymentData = preparePaymentData(paymentOrderId);

  //         // Call Pay function to process the payment data
  //         Pay(paymentData);

  //         // Update order status
  //         await OrderStatus(paymentOrderId);
  //       } else if (result.redirect) {
  //         console.log(
  //           "Payment will be redirected to a new page.",
  //           result.redirect
  //         );
  //       }
  //     });
  //   } catch (error) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error!",
  //       text: error.data || error.message,
  //     });
  //     console.error("Money API Error:", error);
  //   }
  // };

  // const Money = async () => {
  //   const token = localStorage.getItem("Web-token");
  //   console.log("total", totalBeforeDiscount);

  //   if (!token) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error!",
  //       text: "You are not authenticated. Please log in.",
  //     });
  //     return;
  //   }

  //   try {
  //     // Step 1: Call Money API to get paymentSessionId
  //     const response = await axios.post(
  //       "app/cashfree/create-order",
  //       // { order_amount: Math.round(totalBeforeDiscount) },
  //       { order_amount: 1 },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     // Extract payment session ID and order ID from the response
  //     const paymentOrderId = response.data?.data?.order_id;
  //     const paymentSessionId = response.data?.data?.payment_session_id;

  //     if (!paymentSessionId) {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Error!",
  //         text: "Payment session ID is missing. Unable to proceed with payment.",
  //       });
  //       return;
  //     }

  //     console.log("Payment Session ID:", paymentSessionId);

  //     // Step 2: Prepare payment data
  //     // const paymentData = preparePaymentData(paymentOrderId);
  //     // // Call Pay function to process the payment data
  //     // Pay(paymentData);

  //     // Step 2: Initialize Cashfree SDK in production mode
  //     let cashfree;
  //     try {
  //       cashfree = await load({ mode: "production" });
  //       console.log("Cashfree SDK initialized successfully.");
  //     } catch (sdkError) {
  //       Swal.fire({
  //         icon: "error",
  //         title: "SDK Initialization Error",
  //         text: "Failed to initialize Cashfree SDK. Please try again later.",
  //       });
  //       console.error("SDK Initialization Error:", sdkError);
  //       return;
  //     }

  //     // Step 3: Configure Cashfree Checkout
  //     const checkoutOptions = {
  //       paymentSessionId,
  //       redirectTarget: "_self", // Opens the checkout as a popup
  //       callback_url: `https://www.spotsball.com/spotsball/web/popupCheckout?order_id=${paymentOrderId}`,
  //     };

  //     // Step 4: Process Payment
  //     cashfree.checkout(checkoutOptions).then(async (result) => {
  //       if (result.error) {
  //         Swal.fire({
  //           icon: "error",
  //           title: "Payment Error!",
  //           text: result.error.data || result.error.message,
  //         });
  //         console.error("Checkout Error:", result.error);
  //       } else if (result.paymentDetails) {
  //         console.log("Payment Details Response:", result.paymentDetails);
  //         console.log("Payment Message:", result.paymentDetails.paymentMessage);

  //         Swal.fire({
  //           icon: "success",
  //           title: "Payment Successful!",
  //           text: result.paymentDetails.paymentMessage,
  //         });

  //         // Update order status if necessary
  //         // await OrderStatus(paymentOrderId);
  //       } else {
  //         console.log("Unhandled Checkout Result:", result);
  //       }
  //     });
  //   } catch (error) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error!",
  //       text: error.response?.data?.message || error.message,
  //     });
  //     console.error("Money API Error:", error);
  //   }
  // };

  // const Money = async () => {
  //   const token = localStorage.getItem("Web-token");
  //   console.log("total", totalBeforeDiscount);

  //   if (!token) {
  //     console.error("Error: You are not authenticated. Please log in.");
  //     return;
  //   }

  //   try {
  //     // Step 1: Call Money API to get paymentSessionId
  //     const response = await axios.post(
  //       "app/cashfree/create-order",
  //       // { order_amount: Math.round(totalBeforeDiscount) },
  //       { order_amount: 1 },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     // Extract payment session ID and order ID from the response
  //     const paymentOrderId = response.data?.data?.order_id;
  //     const paymentSessionId = response.data?.data?.payment_session_id;

  //     if (!paymentSessionId) {
  //       console.error(
  //         "Error: Payment session ID is missing. Unable to proceed."
  //       );
  //       return;
  //     }

  //     console.log("Payment Session ID:", paymentSessionId);

  //     // Step 2: Initialize Cashfree SDK in production mode
  //     let cashfree;
  //     try {
  //       cashfree = await load({ mode: "production" });
  //       console.log("Cashfree SDK initialized successfully.");
  //     } catch (sdkError) {
  //       console.error("SDK Initialization Error:", sdkError);
  //       return;
  //     }

  //     // Step 3: Configure Cashfree Checkout
  //     const checkoutOptions = {
  //       paymentSessionId,
  //       redirectTarget: "_modal",
  //       callback_url: `https://www.spotsball.com/spotsball/web/popupCheckout?order_id=${paymentOrderId}`,
  //     };

  //     // Step 4: Process Payment
  //     cashfree.checkout(checkoutOptions).then(async (result) => {
  //       if (result.error) {
  //         console.error("Payment Failed Error:", result.error);
  //         window.history.back(); // Redirect back after error
  //       } else if (result.paymentDetails) {
  //         console.log("Payment Details:", result.paymentDetails);
  //         const paymentStatus = result.paymentDetails.paymentStatus;

  //         if (paymentStatus === "SUCCESS") {
  //           console.log("Payment Successful!");
  //           window.location.href = `https://www.spotsball.com/spotsball/web/popupCheckout?order_id=${paymentOrderId}`;
  //         } else if (paymentStatus === "FAILED") {
  //           console.error("Transaction Failed!");
  //           window.history.back();
  //         } else if (paymentStatus === "PENDING") {
  //           console.log("Payment Pending. Redirecting...");
  //           window.location.href = `https://www.spotsball.com/spotsball/web/popupCheckout?order_id=${paymentOrderId}`;
  //         }
  //       } else {
  //         console.log("User closed the payment window.");
  //         window.history.back(); // Redirect back when user cancels payment
  //       }
  //     });
  //   } catch (error) {
  //     console.error(
  //       "Money API Error:",
  //       error.response?.data?.message || error.message
  //     );
  //   }
  // };

  const Money = async () => {
    const token = localStorage.getItem("Web-token");
    console.log("total", totalBeforeDiscount);

    if (!token) {
      console.error("Error: You are not authenticated. Please log in.");
      return;
    }

    try {
      // Step 1: Call Money API to get paymentSessionId
      const response = await axios.post(
        "app/cashfree/create-order",
        { order_amount: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Extract payment session ID and order ID from the response
      const paymentOrderId = response.data?.data?.order_id;
      const paymentSessionId = response.data?.data?.payment_session_id;

      if (!paymentSessionId) {
        console.error(
          "Error: Payment session ID is missing. Unable to proceed."
        );
        return;
      }

      console.log("Payment Session ID:", paymentSessionId);

      //         // Prepare payment data
      const paymentData = preparePaymentData(paymentOrderId);

      //         // Call Pay function to process the payment data
      Pay(paymentData);
      // Step 2: Initialize Cashfree SDK in production mode
      let cashfree;
      try {
        cashfree = await load({ mode: "production" });
        console.log("Cashfree SDK initialized successfully.");
      } catch (sdkError) {
        console.error("SDK Initialization Error:", sdkError);
        return;
      }

      // Step 3: Configure Cashfree Checkout
      const checkoutOptions = {
        paymentSessionId,
        redirectTarget: "_modal",
        callback_url: `https://www.spotsball.com/spotsball/web/popupCheckout?order_id=${paymentOrderId}`,
      };

      // Step 4: Process Payment
      cashfree.checkout(checkoutOptions).then(async (result) => {
        if (result.error) {
          console.error("Payment Failed Error:", result.error);
          Swal.fire({
            icon: "error",
            title: "Payment Failed",
            text: "Something went wrong. Please try again.",
          });
        } else if (result.paymentDetails) {
          console.log("Payment Details:", result.paymentDetails);
          const paymentStatus = result.paymentDetails.paymentStatus;

          if (paymentStatus === "SUCCESS") {
            console.log("Payment Successful!");
            window.location.href = `https://www.spotsball.com/spotsball/web/popupCheckout?order_id=${paymentOrderId}`;
          } else if (paymentStatus === "FAILED") {
            console.error("Transaction Failed!");
            Swal.fire({
              icon: "error",
              title: "Transaction Failed",
              text: "Your payment could not be processed. Please try again later.",
            });
          } else if (paymentStatus === "PENDING") {
            console.log("Payment Pending. Redirecting...");
            window.location.href = `https://www.spotsball.com/spotsball/web/popupCheckout?order_id=${paymentOrderId}`;
          }
        } else {
          console.log("User closed the payment window.");
          Swal.fire({
            icon: "info",
            title: "Payment Cancelled",
            text: "You have closed the payment window.",
          });
        }
      });
    } catch (error) {
      console.error(
        "Money API Error:",
        error.response?.data?.message || error.message
      );
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
      promocodeApplied: {
        name: promoName,
        amount: promoAmount,
      },
      discountApplied: {
        name: discount.name || "",
        discountPercentage,
      },
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
  //   const token = localStorage.getItem("Web-token");
  //   let order_id = paymentOrderId;
  //   try {
  //     const response = await axios.post(
  //       `app/cashfree/update-order-status?order_id=${order_id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //   } catch (error) {}
  // };

  const OrderStatus = async (paymentOrderId) => {
    try {
      const token = localStorage.getItem("Web-token");
      console.log("token", token); // Verify token is being retrieved correctly
      if (token) {
        const response = await axios.post(
          `app/cashfree/update-order-status?order_id=${paymentOrderId}`,
          {}, // Body (optional, empty here)
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data); // Handle response as needed
      }
    } catch (error) {
      console.error(error.response?.data || error.message); // Handle the error appropriately
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
                <div className="col-md-5 coltabbingdiv">
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
                                {calculatedCarts.map((cart, index) => {
                                  const {
                                    promoDiscountAmount,
                                    PerDiscount,
                                    discountPerCart,
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
                                            <strong>Promo Applied:</strong> -₹
                                            {promoDiscountAmount}
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
                                              Discount ({PerDiscount}%):
                                            </strong>{" "}
                                            ₹{discountPerCart}
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
                              style={{ cursor: "pointer" }}
                            >
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
