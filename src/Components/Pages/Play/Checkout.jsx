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
  const [calculatedCarts, setCalculatedCarts] = useState([]);

  const [isCardActive, setIsCardActive] = useState(false);
  const [isEntrysActive, setIsEntrysActive] = useState(false);
  const [isImageRotated, setIsImageRotated] = useState(false);
  const [contestDetails, setContestDetails] = useState(null); // For storing contest details
  const [contestId, setContestId] = useState(null); // For the contest ID
  const [tickets, setTickets] = useState(1);
  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoCodeApplied, setPromoCodeApplied] = useState(null); // Store promo code if any
  const [discounts, setDiscounts] = useState([]);
  const [cardNumber, setCardNumber] = useState("");
  const [validUpto, setValidUpto] = useState("");
  const [cvv, setCvv] = useState("");
  const [promoApplied, setPromoApplied] = useState(false); // Tracks if the promo is successfully applied
  const [promoMessage, setPromoMessage] = useState("");
  const [selectedPromoCode, setSelectedPromoCode] = useState(null);
  const [promoCodes, setPromoCodes] = useState([]);

  // const fetchData = async () => {
  //   const token = localStorage.getItem("Web-token");
  //   try {
  //     const response = await axios.get(`get-all-cart-items`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     const { cartItems, discounts } = response.data.data;
  //     if (cartItems.length === 0) {
  //       Swal.fire({
  //         icon: "info",
  //         title: "No Cart Items",
  //         text: "Your cart is currently empty.",
  //         confirmButtonText: "OK",
  //       }).then((result) => {
  //         if (result.isConfirmed) navigate("/");
  //       });
  //       return;
  //     }

  //     setCarts(cartItems);

  //     const calculated = cartItems.map((cart) => {
  //       const ticketPrice = cart.contest_id.ticket_price;
  //       const ticketsCount = cart.tickets_count;
  //       const gstRate = cart.contest_id.gstRate;
  //       const platformFeeRate = cart.contest_id.platformFeeRate;
  //       const gstOnPlatformFeeRate = cart.contest_id.gstOnPlatformFeeRate;

  //       const totalTicketPrice = ticketPrice * ticketsCount;
  //       const gstAmount = totalTicketPrice * (gstRate / 100);
  //       const subtotal = totalTicketPrice + gstAmount;
  //       const platformFee = subtotal * (platformFeeRate / 100);
  //       const gstOnPlatformFee = platformFee * (gstOnPlatformFeeRate / 100);
  //       const totalRazorpayFee = platformFee + gstOnPlatformFee;
  //       const totalPayment = subtotal + totalRazorpayFee;

  //       return {
  //         ...cart,
  //         totalTicketPrice: totalTicketPrice.toFixed(2),
  //         gstAmount: gstAmount.toFixed(2),
  //         subtotal: subtotal.toFixed(2),
  //         platformFee: platformFee.toFixed(2),
  //         gstOnPlatformFee: gstOnPlatformFee.toFixed(2),
  //         totalRazorpayFee: totalRazorpayFee.toFixed(2),
  //         totalPayment: totalPayment.toFixed(2),
  //       };
  //     });

  //     setCalculatedCarts(calculated);
  //     setDiscounts(discounts || []);
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  console.log("carts -->", carts);

  const toggleCardInput = () => {
    setIsCardActive(!isCardActive);
  };
  const handleImageClick = () => {
    setIsEntrysActive(!isEntrysActive);
    setIsImageRotated(!isImageRotated);
  };

  // const totalBeforeDiscount = calculatedCarts.reduce((total, cart) => {
  //   if (promoApplied) {
  //     const discountedTotalTicketPrice = Math.max(
  //       parseFloat(cart.totalTicketPrice) - discountAmount,
  //       0
  //     );

  //     const discountedGstAmount =
  //       discountedTotalTicketPrice * ((cart.contest_id?.gstRate || 0) / 100);
  //     const discountedSubtotal =
  //       discountedTotalTicketPrice + discountedGstAmount;
  //     const discountedPlatformFee =
  //       discountedSubtotal * ((cart.contest_id?.platformFeeRate || 0) / 100);
  //     const discountedGstOnPlatformFee =
  //       discountedPlatformFee *
  //       ((cart.contest_id?.gstOnPlatformFeeRate || 0) / 100);
  //     const discountedGrandTotal =
  //       discountedSubtotal + discountedPlatformFee + discountedGstOnPlatformFee;

  //     return total + discountedGrandTotal;
  //   } else {
  //     return total + parseFloat(cart.totalPayment);
  //   }
  // }, 0);

  // const handleApplyPromoCode = () => {
  //   if (!Array.isArray(discounts)) {
  //     setPromoApplied(false);
  //     setPromoMessage("No promo codes available.");
  //     return;
  //   }

  //   const promo = discounts.find(
  //     (p) =>
  //       p.name === promoCode &&
  //       calculatedCarts.length > 0 &&
  //       calculatedCarts.every(
  //         (cart) =>
  //           p.minTickets <= cart.tickets_count &&
  //           cart.tickets_count <= p.maxTickets
  //       )
  //   );

  //   if (promo) {
  //     const discount = calculatedCarts.reduce((acc, cart) => {
  //       const totalTicketPrice = parseFloat(cart.totalTicketPrice);
  //       return acc + (totalTicketPrice * promo.discountPercentage) / 100;
  //     }, 0);

  //     // Update discount amount and promo details in each cart
  //     const updatedCarts = calculatedCarts.map((cart) => ({
  //       ...cart,
  //       discount: {
  //         name: promo.name,
  //         discountPercentage: promo.discountPercentage,
  //         amount:
  //           (parseFloat(cart.totalTicketPrice) * promo.discountPercentage) /
  //           100,
  //       },
  //     }));

  //     setCalculatedCarts(updatedCarts); // Update carts state
  //     setDiscountAmount(discount.toFixed(2));
  //     setPromoApplied(true);
  //     setPromoMessage(
  //       `Promo code applied successfully. Discount ₹${discount.toFixed(2)}`
  //     );
  //   } else {
  //     setPromoApplied(false);
  //     setPromoMessage("Invalid or ineligible promo code.");
  //   }
  // };

  // const fetchData = async () => {
  //   const token = localStorage.getItem("Web-token");
  //   try {
  //     const response = await axios.get("get-all-cart-items", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     const { cartItems, discounts } = response.data.data;
  //     if (cartItems.length === 0) {
  //       Swal.fire({
  //         icon: "info",
  //         title: "No Cart Items",
  //         text: "Your cart is currently empty.",
  //         confirmButtonText: "OK",
  //       }).then((result) => {
  //         if (result.isConfirmed) navigate("/");
  //       });
  //       return;
  //     }

  //     setCarts(cartItems);

  //     const calculated = cartItems.map((cart) => {
  //       const ticketPrice = cart.contest_id.ticket_price;
  //       const ticketsCount = cart.tickets_count;
  //       const gstRate = cart.contest_id.gstRate;
  //       const platformFeeRate = cart.contest_id.platformFeeRate;
  //       const gstOnPlatformFeeRate = cart.contest_id.gstOnPlatformFeeRate;

  //       const totalTicketPrice = ticketPrice * ticketsCount;
  //       const gstAmount = totalTicketPrice * (gstRate / 100);
  //       const subtotal = totalTicketPrice + gstAmount;
  //       const platformFee = subtotal * (platformFeeRate / 100);
  //       const gstOnPlatformFee = platformFee * (gstOnPlatformFeeRate / 100);
  //       const totalRazorpayFee = platformFee + gstOnPlatformFee;
  //       const totalPayment = subtotal + totalRazorpayFee;

  //       return {
  //         ...cart,
  //         totalTicketPrice: totalTicketPrice.toFixed(2),
  //         gstAmount: gstAmount.toFixed(2),
  //         subtotal: subtotal.toFixed(2),
  //         platformFee: platformFee.toFixed(2),
  //         gstOnPlatformFee: gstOnPlatformFee.toFixed(2),
  //         totalRazorpayFee: totalRazorpayFee.toFixed(2),
  //         totalPayment: totalPayment.toFixed(2),
  //       };
  //     });

  //     setCalculatedCarts(calculated);
  //     setDiscounts(discounts || []);
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

  // const totalBeforeDiscount = calculatedCarts.reduce((total, cart) => {
  //   if (promoApplied) {
  //     const discountedTotalTicketPrice = Math.max(
  //       parseFloat(cart.totalTicketPrice) - discountAmount,
  //       0
  //     );

  //     const discountedGstAmount =
  //       discountedTotalTicketPrice * ((cart.contest_id?.gstRate || 0) / 100);
  //     const discountedSubtotal =
  //       discountedTotalTicketPrice + discountedGstAmount;
  //     const discountedPlatformFee =
  //       discountedSubtotal * ((cart.contest_id?.platformFeeRate || 0) / 100);
  //     const discountedGstOnPlatformFee =
  //       discountedPlatformFee *
  //       ((cart.contest_id?.gstOnPlatformFeeRate || 0) / 100);
  //     const discountedGrandTotal =
  //       discountedSubtotal + discountedPlatformFee + discountedGstOnPlatformFee;

  //     return total + discountedGrandTotal;
  //   } else {
  //     return total + parseFloat(cart.totalPayment);
  //   }
  // }, 0);

  // const handleApplyPromoCode = () => {
  //   if (!Array.isArray(discounts) || discounts.length === 0) {
  //     setPromoApplied(false);
  //     setPromoMessage("No promo codes available.");
  //     return;
  //   }

  //   // Sort discounts by `minTickets` in descending order to find the highest applicable discount
  //   const applicableDiscount = discounts.find((promo) =>
  //     calculatedCarts.every(
  //       (cart) =>
  //         cart.tickets_count >= promo.minTickets &&
  //         cart.tickets_count <= promo.maxTickets
  //     )
  //   );

  //   if (applicableDiscount) {
  //     const discountAmount = calculatedCarts.reduce((acc, cart) => {
  //       const totalTicketPrice = parseFloat(cart.totalTicketPrice);
  //       return (
  //         acc + (totalTicketPrice * applicableDiscount.discountPercentage) / 100
  //       );
  //     }, 0);

  //     // Update discount amount and promo details in each cart
  //     const updatedCarts = calculatedCarts.map((cart) => ({
  //       ...cart,
  //       discount: {
  //         name: applicableDiscount.name,
  //         discountPercentage: applicableDiscount.discountPercentage,
  //         amount:
  //           (parseFloat(cart.totalTicketPrice) *
  //             applicableDiscount.discountPercentage) /
  //           100,
  //       },
  //     }));

  //     setCalculatedCarts(updatedCarts); // Update carts state
  //     setDiscountAmount(discountAmount.toFixed(2));
  //     setPromoApplied(true);
  //     setPromoMessage(
  //       `Promo code applied successfully. Discount ₹${discountAmount.toFixed(
  //         2
  //       )}`
  //     );
  //   } else {
  //     setPromoApplied(false);
  //     setPromoMessage(
  //       "No applicable promo code based on the number of tickets in the cart."
  //     );
  //   }
  // };

  // // Apply default discount on component load
  // useEffect(() => {
  //   handleApplyPromoCode();
  // }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("Web-token");
    try {
      const response = await axios.get("get-all-cart-items", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { cartItems, discounts, promocodes } = response.data.data;
      if (cartItems.length === 0) {
        Swal.fire({
          icon: "info",
          title: "No Cart Items",
          text: "Your cart is currently empty.",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) navigate("/");
        });
        return;
      }

      setCarts(cartItems);

      const calculated = cartItems.map((cart) => {
        const ticketPrice = cart.contest_id.ticket_price;
        const ticketsCount = cart.tickets_count;
        const gstRate = cart.contest_id.gstRate;
        const platformFeeRate = cart.contest_id.platformFeeRate;
        const gstOnPlatformFeeRate = cart.contest_id.gstOnPlatformFeeRate;

        const totalTicketPrice = ticketPrice * ticketsCount;
        const gstAmount = totalTicketPrice * (gstRate / 100);
        const subtotal = totalTicketPrice + gstAmount;
        const platformFee = subtotal * (platformFeeRate / 100);
        const gstOnPlatformFee = platformFee * (gstOnPlatformFeeRate / 100);
        const totalRazorpayFee = platformFee + gstOnPlatformFee;
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
      });

      setCalculatedCarts(calculated);
      setDiscounts(discounts || []);
      setPromoCodes(promocodes || []);

      // Apply discount automatically based on ticket count
      const ticketCounts = cartItems.map((cart) => cart.tickets_count);
      const maxTickets = Math.max(...ticketCounts);

      let applicableDiscount = null;

      for (const discount of discounts) {
        if (
          maxTickets >= discount.minTickets &&
          maxTickets <= discount.maxTickets
        ) {
          applicableDiscount = discount;
          break;
        }
      }

      if (applicableDiscount) {
        const discountAmount = calculated.reduce((acc, cart) => {
          const totalTicketPrice = parseFloat(cart.totalTicketPrice);
          return (
            acc +
            (totalTicketPrice * applicableDiscount.discountPercentage) / 100
          );
        }, 0);

        const updatedCarts = calculated.map((cart) => ({
          ...cart,
          discount: {
            name: applicableDiscount.name,
            discountPercentage: applicableDiscount.discountPercentage,
            amount:
              (parseFloat(cart.totalTicketPrice) *
                applicableDiscount.discountPercentage) /
              100,
          },
        }));

        setCalculatedCarts(updatedCarts); // Update carts state
      }
    } catch (error) {
      console.error(
        "Error fetching cart data:",
        error.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleApplyPromoCode = () => {
    const promo = promoCodes.find((code) => code.name === promoCode);

    if (promo) {
      const updatedCarts = calculatedCarts.map((cart) => {
        // Recalculate total payment with promo code applied
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
          discount: null, // Remove default discount
          promoCode: {
            name: promo.name,
            amount: promoDiscountAmount,
          },
          totalPayment: discountedTotalPayment.toFixed(2),
        };
      });

      setCalculatedCarts(updatedCarts);
      setSelectedPromoCode(promo);

      Swal.fire({
        icon: "success",
        title: "Promo Code Applied!",
        text: `Promo code "${promo.name}" applied. Discount: ₹${promo.amount}`,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid Promo Code",
        text: "The promo code you entered is not valid.",
      });
    }
  };

  const handleCrossClick = async (cart) => {
    const { contest_id, tickets_count, user_coordinates } = cart;
    const token = localStorage.getItem("Web-token");

    try {
      const response = await axios.get(`remove-cart-item/${cart._id}`, {
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
      });

      // Handle successful response
      Swal.fire({
        title: "Success!",
        text: response.data.message,
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
      });
    }
  };

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
    const token = localStorage.getItem("Web-token");

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
      key: "rzp_test_TYK1sgruH0AHoM",
      amount: Math.round(totalBeforeDiscount * 100),
      currency: "INR",
      name: "SpotsBall",
      description: "Buy ticket to play",
      handler: (response) => {
        const paymentData = {
          contestId: carts[0]?.contest_id?._id || "defaultContestId", // Use appropriate fallback or validation
          paymentId: response.razorpay_payment_id || "defaultPaymentId",
          coordinates: carts[0]?.user_coordinates || [],
          tickets: carts.reduce(
            (total, cart) => total + (cart.tickets_count || 0),
            0
          ),
          discountApplied: {
            name: calculatedCarts[0]?.discount?.name || "",
            discountPercentage:
              calculatedCarts[0]?.discount?.discountPercentage || 0,
          },
          ticketAmount: calculatedCarts.reduce(
            (total, cart) => total + (cart.totalTicketPrice || 0),
            0
          ),
          discountAmount: calculatedCarts.reduce(
            (total, cart) =>
              total +
              ((cart.totalTicketPrice || 0) *
                (calculatedCarts[0]?.discount?.discountPercentage || 0)) /
                100,
            0
          ),
          afterDiscountAmount: calculatedCarts.reduce(
            (total, cart) =>
              total +
              (cart.totalTicketPrice || 0) -
              ((cart.totalTicketPrice || 0) *
                (calculatedCarts[0]?.discount?.discountPercentage || 0)) /
                100,
            0
          ),
          gstPercentage: carts[0]?.contest_id?.gstRate || 28, // Default GST rate as 28%
          gstAmount: calculatedCarts.reduce(
            (total, cart) =>
              total +
              (((cart.totalTicketPrice || 0) -
                ((cart.totalTicketPrice || 0) *
                  (calculatedCarts[0]?.discount?.discountPercentage || 0)) /
                  100) *
                (carts[0]?.contest_id?.gstRate || 28)) /
                100,
            0
          ),
          subTotalAmount: calculatedCarts.reduce(
            (total, cart) =>
              total +
              (cart.totalTicketPrice || 0) -
              ((cart.totalTicketPrice || 0) *
                (calculatedCarts[0]?.discount?.discountPercentage || 0)) /
                100 +
              (((cart.totalTicketPrice || 0) -
                ((cart.totalTicketPrice || 0) *
                  (calculatedCarts[0]?.discount?.discountPercentage || 0)) /
                  100) *
                (carts[0]?.contest_id?.gstRate || 28)) /
                100,
            0
          ),
          platformFeePercentage: carts[0]?.contest_id?.platformFeeRate || 2, // Default platform fee rate as 2%
          platformFeeAmount: calculatedCarts.reduce(
            (total, cart) =>
              total +
              (((cart.totalTicketPrice || 0) -
                ((cart.totalTicketPrice || 0) *
                  (calculatedCarts[0]?.discount?.discountPercentage || 0)) /
                  100) *
                (carts[0]?.contest_id?.platformFeeRate || 2)) /
                100,
            0
          ),
          gstOnPlatformFeePercentage:
            carts[0]?.contest_id?.gstOnPlatformFeeRate || 2, // Default GST on platform fee rate as 2%
          gstOnPlatformFeeAmount: calculatedCarts.reduce(
            (total, cart) =>
              total +
              (((cart.totalTicketPrice || 0) -
                ((cart.totalTicketPrice || 0) *
                  (calculatedCarts[0]?.discount?.discountPercentage || 0)) /
                  100) *
                (carts[0]?.contest_id?.platformFeeRate || 2) *
                (carts[0]?.contest_id?.gstOnPlatformFeeRate || 2)) /
                10000,
            0
          ),
          totalRazorPayFeeAmount: calculatedCarts.reduce(
            (total, cart) =>
              total +
              (((cart.totalTicketPrice || 0) -
                ((cart.totalTicketPrice || 0) *
                  (calculatedCarts[0]?.discount?.discountPercentage || 0)) /
                  100) *
                (carts[0]?.contest_id?.platformFeeRate || 2)) /
                100 +
              (((cart.totalTicketPrice || 0) -
                ((cart.totalTicketPrice || 0) *
                  (calculatedCarts[0]?.discount?.discountPercentage || 0)) /
                  100) *
                (carts[0]?.contest_id?.platformFeeRate || 2) *
                (carts[0]?.contest_id?.gstOnPlatformFeeRate || 2)) /
                10000,
            0
          ),
          amount: calculatedCarts.reduce(
            (total, cart) =>
              total +
              (cart.totalTicketPrice || 0) -
              ((cart.totalTicketPrice || 0) *
                (calculatedCarts[0]?.discount?.discountPercentage || 0)) /
                100 +
              (((cart.totalTicketPrice || 0) -
                ((cart.totalTicketPrice || 0) *
                  (calculatedCarts[0]?.discount?.discountPercentage || 0)) /
                  100) *
                (carts[0]?.contest_id?.gstRate || 28)) /
                100 +
              (((cart.totalTicketPrice || 0) -
                ((cart.totalTicketPrice || 0) *
                  (calculatedCarts[0]?.discount?.discountPercentage || 0)) /
                  100) *
                (carts[0]?.contest_id?.platformFeeRate || 2)) /
                100 +
              (((cart.totalTicketPrice || 0) -
                ((cart.totalTicketPrice || 0) *
                  (calculatedCarts[0]?.discount?.discountPercentage || 0)) /
                  100) *
                (carts[0]?.contest_id?.platformFeeRate || 2) *
                (carts[0]?.contest_id?.gstOnPlatformFeeRate || 2)) /
                10000,
            0
          ),
        };

        Pay(paymentData);
      },
      external: {
        wallets: ["paytm"],
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", (response) => {
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
                    {carts.length > 0 &&
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

                          {/* <div className="entry">
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
                                  const discountPerCart = promoApplied
                                    ? discountAmount
                                    : "0.00";
                                  const discountedTotalTicketPrice =
                                    promoApplied
                                      ? Math.max(
                                          cart.totalTicketPrice -
                                            discountAmount,
                                          0
                                        ).toFixed(2)
                                      : cart.totalTicketPrice;

                                  const discountedGstAmount = promoApplied
                                    ? (
                                        discountedTotalTicketPrice *
                                        (cart.contest_id.gstRate / 100)
                                      ).toFixed(2)
                                    : cart.gstAmount;

                                  const discountedSubtotal = promoApplied
                                    ? (
                                        parseFloat(discountedTotalTicketPrice) +
                                        parseFloat(discountedGstAmount)
                                      ).toFixed(2)
                                    : cart.subtotal;

                                  const discountedPlatformFee = promoApplied
                                    ? (
                                        discountedSubtotal *
                                        (cart.contest_id.platformFeeRate / 100)
                                      ).toFixed(2)
                                    : cart.platformFee;

                                  const discountedGstOnPlatformFee =
                                    promoApplied
                                      ? (
                                          discountedPlatformFee *
                                          (cart.contest_id
                                            .gstOnPlatformFeeRate /
                                            100)
                                        ).toFixed(2)
                                      : cart.gstOnPlatformFee;

                                  const discountedTotalRazorpayFee =
                                    promoApplied
                                      ? (
                                          parseFloat(discountedPlatformFee) +
                                          parseFloat(discountedGstOnPlatformFee)
                                        ).toFixed(2)
                                      : cart.totalRazorpayFee;

                                  const discountedGrandTotal = promoApplied
                                    ? (
                                        parseFloat(discountedSubtotal) +
                                        parseFloat(discountedTotalRazorpayFee)
                                      ).toFixed(2)
                                    : cart.totalPayment;

                                  return (
                                    <div
                                      key={index}
                                      className="cart-itemss table-blockk"
                                    >
                                      <p>
                                        <strong>Items Total: </strong>₹
                                        {cart.totalTicketPrice}
                                      </p>
                                      {promoApplied && (
                                        <>
                                          <p>
                                            <strong>Discount: </strong>-₹
                                            {discountPerCart}
                                          </p>
                                          <p>
                                            <strong>After Discount: </strong>₹
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
                                        <strong>Total Razorpay Fee: </strong>₹
                                        {discountedTotalRazorpayFee}
                                      </p>
                                      <hr />
                                      <p>
                                        <strong>
                                          Grand Total (Subtotal + Razorpay):{" "}
                                        </strong>
                                        ₹{discountedGrandTotal}
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div> */}
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
                                  // Calculate the promo discount amount
                                  const promoDiscountAmount = cart.promoCode
                                    ? cart.promoCode.amount
                                    : 0;

                                  // Calculate discount amount per cart
                                  const discountPerCart = cart.discount
                                    ? cart.discount.amount
                                    : "0.00";

                                  // Recalculate total ticket price after applying discount or promo
                                  const discountedTotalTicketPrice = Math.max(
                                    cart.totalTicketPrice -
                                      discountPerCart -
                                      promoDiscountAmount,
                                    0
                                  ).toFixed(2);

                                  // Calculate GST on the discounted ticket price
                                  const discountedGstAmount = (
                                    discountedTotalTicketPrice *
                                    (cart.contest_id.gstRate / 100)
                                  ).toFixed(2);

                                  // Calculate subtotal after GST
                                  const discountedSubtotal = (
                                    parseFloat(discountedTotalTicketPrice) +
                                    parseFloat(discountedGstAmount)
                                  ).toFixed(2);

                                  // Calculate platform fee based on the new subtotal
                                  const discountedPlatformFee = (
                                    discountedSubtotal *
                                    (cart.contest_id.platformFeeRate / 100)
                                  ).toFixed(2);

                                  // Calculate GST on platform fee
                                  const discountedGstOnPlatformFee = (
                                    discountedPlatformFee *
                                    (cart.contest_id.gstOnPlatformFeeRate / 100)
                                  ).toFixed(2);

                                  // Calculate total Razorpay fee
                                  const discountedTotalRazorpayFee = (
                                    parseFloat(discountedPlatformFee) +
                                    parseFloat(discountedGstOnPlatformFee)
                                  ).toFixed(2);

                                  // Calculate grand total
                                  const discountedGrandTotal = (
                                    parseFloat(discountedSubtotal) +
                                    parseFloat(discountedTotalRazorpayFee)
                                  ).toFixed(2);

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
                                            <strong>Promo Applied:</strong>
                                            -₹{promoDiscountAmount}
                                          </p>
                                          <p>
                                            <strong>After: </strong>₹
                                            {discountedTotalTicketPrice}
                                          </p>
                                        </>
                                      )}
                                      {cart.discount && (
                                        <>
                                          <p>
                                            <strong>Discount: </strong>-₹
                                            {discountPerCart}
                                          </p>
                                          <p>
                                            <strong>After Discount: </strong>₹
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
                                        <strong>Total Razorpay Fee: </strong>₹
                                        {discountedTotalRazorpayFee}
                                      </p>
                                      <hr />
                                      <p>
                                        <strong>
                                          Grand Total (Subtotal + Razorpay):{" "}
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
                              <p>Proceed to Pay</p>
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
