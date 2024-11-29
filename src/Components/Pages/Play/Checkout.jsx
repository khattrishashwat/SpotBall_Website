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
  // const fetchData = async () => {
  //   const token = localStorage.getItem("token");
  //   try {
  //     // setIsLoading(true);
  //     const response = await axios.get(`get-all-cart-items`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     //  if (response.data.data.length === 0 && location.pathname === "/cart") {
  //     if (response.data.data.cartItems.length === 0) {
  //       Swal.fire({
  //         icon: "info",
  //         title: "No Cart Items",
  //         text: "Your cart is currently empty.",
  //         confirmButtonText: "OK",
  //       }).then((result) => {
  //         if (result.isConfirmed) {
  //           navigate("/");
  //         }
  //       });
  //     } else {
  //       console.log("sad-->", response.data.data.cartItems[0].contest_id);
  //       setCarts(response.data.data.cartItems || {});

  //       const contest = response.data.data.cartItems[0]; // Assuming you want the first contest
  //       setContestDetails(contest);
  //       setContestId(contest.contest_id._id); // Set contest ID
  //       setTickets(contest.tickets_count); // Set the number of tickets
  //       setCoordinates(contest.user_coordinates); // Set user coordinates
  //       setPromoCodeApplied(contest.contest_id.promocodes);
  //     }
  //   } catch (error) {
  //     console.error("Error data:", error);
  //   }
  //   // finally {
  //   //   setIsLoading(false);
  //   // }
  // };

  // const fetchData = async () => {
  //   const token = localStorage.getItem("token");
  //   try {
  //     const response = await axios.get(`get-all-cart-items`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (response.data.data.cartItems.length === 0) {
  //       Swal.fire({
  //         icon: "info",
  //         title: "No Cart Items",
  //         text: "Your cart is currently empty.",
  //         confirmButtonText: "OK",
  //       }).then((result) => {
  //         if (result.isConfirmed) {
  //           navigate("/");
  //         }
  //       });
  //     } else {
  //       const contest = response.data.data.cartItems;
  //       setCarts(response.data.data.cartItems || []);
  //       setContestDetails(contest);
  //       setContestId(contest.contest_id._id);
  //       setTickets(contest.tickets_count);
  //       setCoordinates(contest.user_coordinates);
  //       setPromoCodeApplied(contest.contest_id.promocodes);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching cart data:", error);
  //   }
  // };

  // const fetchData = async () => {
  //   const token = localStorage.getItem("token");
  //   try {
  //     const response = await axios.get(`get-all-cart-items`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (response.data.data.cartItems.length === 0) {
  //       Swal.fire({
  //         icon: "info",
  //         title: "No Cart Items",
  //         text: "Your cart is currently empty.",
  //         confirmButtonText: "OK",
  //       }).then((result) => {
  //         if (result.isConfirmed) {
  //           navigate("/");
  //         }
  //       });
  //     } else {
  //       const cartItems = response.data.data.cartItems;
  //       setCarts(cartItems);

  //       // Apply discount logic if necessary
  //       const discounts = response.data.data.discounts || [];
  //       const calculated = cartItems.map((cart) => {
  //         const totalTicketPrice =
  //           cart.contest_id.ticket_price * cart.tickets_count;
  //         const gstAmount = totalTicketPrice * (cart.contest_id.gstRate / 100);
  //         const subtotal = totalTicketPrice + gstAmount;

  //         const platformFee =
  //           subtotal * (cart.contest_id.platformFeeRate / 100);
  //         const gstOnPlatformFee =
  //           platformFee * (cart.contest_id.gstOnPlatformFeeRate / 100);
  //         const totalRazorpayFee = platformFee + gstOnPlatformFee;
  //         const totalPayment = subtotal + totalRazorpayFee;

  //         return {
  //           ...cart,
  //           totalTicketPrice,
  //           gstAmount:gstAmount.toFixed(2),
  //           subtotal,
  //           platformFee,
  //           gstOnPlatformFee,
  //           totalRazorpayFee,
  //           totalPayment,
  //         };
  //       });

  //       setCalculatedCarts(calculated);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching cart data:", error);
  //   }
  // };

  const fetchData = async () => {
    const token = localStorage.getItem("Web-token");
    try {
      const response = await axios.get(`get-all-cart-items`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { cartItems, discounts } = response.data.data;
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

  // Constants for discount application
  // const DEFAULT_DISCOUNT = 0;

  // // Calculation of cart values
  // const calculatedCarts = useMemo(() => {
  //   // Ensure carts is always an array
  //   return (
  //     (Array.isArray(carts) &&
  //       carts.map((cart) => {
  //         const { contest_id } = cart || {}; // Ensure cart is defined

  //         // Ensure values are safe and default to 0 if undefined
  //         const ticketPrice = contest_id?.ticket_price || 0;
  //         const ticketsCount = cart?.tickets_count || 0;
  //         const gstRate = (contest_id?.gstRate || 0) / 100; // Convert percentage
  //         const platformFeeRate = (contest_id?.platformFeeRate || 0) / 100; // Convert percentage
  //         const gstOnPlatformFeeRate =
  //           (contest_id?.gstOnPlatformFeeRate || 0) / 100; // Convert percentage

  //         // Step 1: Calculate total ticket price
  //         const totalTicketPrice = ticketPrice * ticketsCount;

  //         // Step 2: Calculate GST on ticket price
  //         const gstAmount = totalTicketPrice * gstRate;

  //         // Step 3: Subtotal
  //         const subtotal = totalTicketPrice + gstAmount;

  //         // Step 4: Platform fee
  //         const platformFee = subtotal * platformFeeRate;

  //         // Step 5: GST on platform fee
  //         const gstOnPlatformFee = platformFee * gstOnPlatformFeeRate;

  //         // Step 6: Total Razorpay fee
  //         const totalRazorpayFee = platformFee + gstOnPlatformFee;

  //         // Step 7: Total payment by user
  //         const totalPayment = subtotal + totalRazorpayFee;

  //         return {
  //           ...cart,
  //           ticketPrice,
  //           totalTicketPrice: totalTicketPrice.toFixed(2),
  //           gstAmount: gstAmount.toFixed(2),
  //           subtotal: subtotal.toFixed(2),
  //           platformFee: platformFee.toFixed(2),
  //           gstOnPlatformFee: gstOnPlatformFee.toFixed(2),
  //           totalRazorpayFee: totalRazorpayFee.toFixed(2),
  //           totalPayment: totalPayment.toFixed(2),
  //         };
  //       })) ||
  //     []
  //   ); // Ensure it returns an empty array if carts is not an array
  // }, [carts]);

  // console.log("calculatedCarts", calculatedCarts);

  // // Total calculations
  // const totalBeforeDiscount = calculatedCarts.reduce((total, cart) => {
  //   return total + parseFloat(cart.totalPayment);
  // }, 0);

  // const totalAfterDiscount = totalBeforeDiscount - discountAmount;

  // const handleApplyPromoCode = () => {
  //   const promo = promoCodeApplied.find((p) => p.promocode === promoCode);

  //   if (promo) {
  //     const totalBeforeDiscount = calculatedCarts.reduce((total, cart) => {
  //       return total + parseFloat(cart.totalPayment);
  //     }, 0);

  //     const discount = promo.amount || DEFAULT_DISCOUNT; // Default to 0 if undefined
  //     setDiscountAmount(discount);
  //     setPromoApplied(true);
  //     setPromoMessage(
  //       `Promo code applied successfully. Discount ₹${discount}.`
  //     );
  //   } else {
  //     setPromoApplied(false);
  //     setPromoMessage("Invalid promo code");
  //   }
  // };

  // const finalTotalPayment =
  //   discountAmount > 0 ? totalAfterDiscount : totalBeforeDiscount;

  // const totalPayments = finalTotalPayment.toFixed(2);

  // const DEFAULT_DISCOUNT = 0;

  // // Calculation of cart values
  // const calculatedCarts = useMemo(() => {
  //   return (
  //     (Array.isArray(carts) &&
  //       carts.contest_id.map((cart) => {
  //         const { contest_id } = cart || {}; // Ensure cart is defined

  //         // Ensure values are safe and default to 0 if undefined
  //         const ticketPrice = contest_id?.ticket_price || 0;
  //         const ticketsCount = cart?.tickets_count || 0;
  //         const gstRate = (contest_id?.gstRate || 0) / 100; // Convert percentage
  //         const platformFeeRate = (contest_id?.platformFeeRate || 0) / 100; // Convert percentage
  //         const gstOnPlatformFeeRate =
  //           (contest_id?.gstOnPlatformFeeRate || 0) / 100; // Convert percentage

  //         // Step 1: Calculate total ticket price
  //         const totalTicketPrice = ticketPrice * ticketsCount;

  //         // Step 2: Calculate GST on ticket price
  //         const gstAmount = totalTicketPrice * gstRate;

  //         // Step 3: Subtotal
  //         const subtotal = totalTicketPrice + gstAmount;

  //         // Step 4: Platform fee
  //         const platformFee = subtotal * platformFeeRate;

  //         // Step 5: GST on platform fee
  //         const gstOnPlatformFee = platformFee * gstOnPlatformFeeRate;

  //         // Step 6: Total Razorpay fee
  //         const totalRazorpayFee = platformFee + gstOnPlatformFee;

  //         // Step 7: Total payment by user
  //         const totalPayment = subtotal + totalRazorpayFee;

  //         // Return the updated cart object with calculations
  //         return {
  //           ...cart,
  //           ticketPrice: ticketPrice.toFixed(2),
  //           totalTicketPrice: totalTicketPrice.toFixed(2),
  //           gstAmount: gstAmount.toFixed(2),
  //           subtotal: subtotal.toFixed(2),
  //           platformFee: platformFee.toFixed(2),
  //           gstOnPlatformFee: gstOnPlatformFee.toFixed(2),
  //           totalRazorpayFee: totalRazorpayFee.toFixed(2),
  //           totalPayment: totalPayment.toFixed(2),
  //         };
  //       })) ||
  //     []
  //   ); // Ensure it returns an empty array if carts is not an array
  // }, [carts]);

  // console.log("calculatedCarts", calculatedCarts);

  // // Total calculations
  // const totalBeforeDiscount = calculatedCarts.reduce((total, cart) => {
  //   if (promoApplied) {
  //     const discountedTotalTicketPrice = Math.max(
  //       parseFloat(cart.totalTicketPrice) - discountAmount,
  //       0
  //     ); // Ensure price doesn't go below 0

  //     const discountedGstAmount =
  //       discountedTotalTicketPrice * ((cart.contest_id?.gstRate || 0) / 100);
  //     const discountedSubtotal =
  //       discountedTotalTicketPrice + discountedGstAmount;
  //     const discountedPlatformFee =
  //       discountedSubtotal * ((cart.contest_id?.platformFeeRate || 0) / 100);
  //     const discountedGstOnPlatformFee =
  //       discountedPlatformFee *
  //       ((cart.contest_id?.gstOnPlatformFeeRate || 0) / 100);
  //     const discountedTotalRazorpayFee =
  //       discountedPlatformFee + discountedGstOnPlatformFee;
  //     const discountedGrandTotal =
  //       discountedSubtotal + discountedTotalRazorpayFee;

  //     console.log("discountedPlatformFee:", discountedPlatformFee);
  //     console.log("discountedGstOnPlatformFee:", discountedGstOnPlatformFee);
  //     console.log("discountedTotalRazorpayFee:", discountedTotalRazorpayFee);
  //     console.log("discountedGrandTotal:", discountedGrandTotal);
  //     return total + discountedGrandTotal;
  //   } else {
  //     return total + parseFloat(cart.totalPayment);
  //   }
  // }, 0);

  // console.log("totalBeforeDiscount", totalBeforeDiscount);

  // const handleApplyPromoCode = () => {
  //   if (!Array.isArray(promoCodeApplied)) {
  //     setPromoApplied(false);
  //     setPromoMessage("No promo codes available.");
  //     return;
  //   }
  //   console.log("promoCodeApplied", promoCodeApplied);

  //   const promo = promoCodeApplied.find((p) => p.promocode === promoCode);

  //   if (promo) {
  //     const discount = promo.amount || DEFAULT_DISCOUNT; // Default to 0 if undefined

  //     // Apply discount to each cart's totalTicketPrice
  //     const discountedCarts = calculatedCarts.map((cart) => {
  //       const discountedTicketPrice = Math.max(
  //         parseFloat(cart.totalTicketPrice) - discount,
  //         0
  //       ); // Ensure price doesn't go below 0
  //       const gstAmount = discountedTicketPrice * ((cart.gstRate || 0) / 100);
  //       const subtotal = discountedTicketPrice + gstAmount;
  //       const platformFee = subtotal * ((cart.platformFeeRate || 0) / 100);
  //       const gstOnPlatformFee =
  //         platformFee * ((cart.gstOnPlatformFeeRate || 0) / 100);
  //       const totalRazorpayFee = platformFee + gstOnPlatformFee;
  //       const totalPayment = subtotal + totalRazorpayFee;

  //       return {
  //         ...cart,
  //         discountedTicketPrice: discountedTicketPrice.toFixed(2),
  //         gstAmount: gstAmount.toFixed(2),
  //         subtotal: subtotal.toFixed(2),
  //         platformFee: platformFee.toFixed(2),
  //         gstOnPlatformFee: gstOnPlatformFee.toFixed(2),
  //         totalRazorpayFee: totalRazorpayFee.toFixed(2),
  //         totalPayment: totalPayment.toFixed(2),
  //       };
  //     });

  //     setDiscountAmount(discount);
  //     setPromoApplied(true);
  //     setPromoMessage(
  //       `Promo code applied successfully. Discount ₹${discount} on total ticket price.`
  //     );
  //     console.log("Discounted Carts", discountedCarts);
  //   } else {
  //     setPromoApplied(false);
  //     setPromoMessage("Invalid promo code");
  //   }
  // };

  // const calculatedCarts = useMemo(() => {
  //   return carts.map((cart) => {
  //     const { contest_id } = cart || {};

  //     const ticketPrice = contest_id?.ticket_price || 0;
  //     const ticketsCount = cart?.tickets_count || 0;
  //     const gstRate = (contest_id?.gstRate || 0) / 100;
  //     const platformFeeRate = (contest_id?.platformFeeRate || 0) / 100;
  //     const gstOnPlatformFeeRate =
  //       (contest_id?.gstOnPlatformFeeRate || 0) / 100;

  //     const totalTicketPrice = ticketPrice * ticketsCount;
  //     const gstAmount = totalTicketPrice * gstRate;
  //     const subtotal = totalTicketPrice + gstAmount;
  //     const platformFee = subtotal * platformFeeRate;
  //     const gstOnPlatformFee = platformFee * gstOnPlatformFeeRate;
  //     const totalRazorpayFee = platformFee + gstOnPlatformFee;
  //     const totalPayment = subtotal + totalRazorpayFee;

  //     return {
  //       ...cart,
  //       ticketPrice: ticketPrice.toFixed(2),
  //       totalTicketPrice: totalTicketPrice.toFixed(2),
  //       gstAmount: gstAmount.toFixed(2),
  //       subtotal: subtotal.toFixed(2),
  //       platformFee: platformFee.toFixed(2),
  //       gstOnPlatformFee: gstOnPlatformFee.toFixed(2),
  //       totalRazorpayFee: totalRazorpayFee.toFixed(2),
  //       totalPayment: totalPayment.toFixed(2),
  //     };
  //   });
  // }, [carts]);

  const totalBeforeDiscount = calculatedCarts.reduce((total, cart) => {
    if (promoApplied) {
      const discountedTotalTicketPrice = Math.max(
        parseFloat(cart.totalTicketPrice) - discountAmount,
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

  // const handleApplyPromoCode = () => {
  //   if (!Array.isArray(discounts)) {
  //     setPromoApplied(false);
  //     setPromoMessage("No promo codes available.");
  //     return;
  //   }

  //   const promo = discounts.find((p) => p.promocode === promoCode);

  //   if (promo) {
  //     const discount = promo.amount || 0;

  //     setDiscountAmount(discount);
  //     setPromoApplied(true);
  //     setPromoMessage(`Promo code applied successfully. Discount ₹${discount}`);
  //   } else {
  //     setPromoApplied(false);
  //     setPromoMessage("Invalid promo code");
  //   }
  // };

  const handleApplyPromoCode = () => {
    if (!Array.isArray(discounts)) {
      setPromoApplied(false);
      setPromoMessage("No promo codes available.");
      return;
    }

    const promo = discounts.find(
      (p) =>
        p.name === promoCode &&
        calculatedCarts.length > 0 &&
        calculatedCarts.every(
          (cart) =>
            p.minTickets <= cart.tickets_count &&
            cart.tickets_count <= p.maxTickets
        )
    );

    if (promo) {
      const discount = calculatedCarts.reduce((acc, cart) => {
        const totalTicketPrice = parseFloat(cart.totalTicketPrice);
        return acc + (totalTicketPrice * promo.discountPercentage) / 100;
      }, 0);

      // Update discount amount and promo details in each cart
      const updatedCarts = calculatedCarts.map((cart) => ({
        ...cart,
        discount: {
          name: promo.name,
          discountPercentage: promo.discountPercentage,
          amount:
            (parseFloat(cart.totalTicketPrice) * promo.discountPercentage) /
            100,
        },
      }));

      setCalculatedCarts(updatedCarts); // Update carts state
      setDiscountAmount(discount.toFixed(2));
      setPromoApplied(true);
      setPromoMessage(
        `Promo code applied successfully. Discount ₹${discount.toFixed(2)}`
      );
    } else {
      setPromoApplied(false);
      setPromoMessage("Invalid or ineligible promo code.");
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
      });

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
          contestId: carts[0]?.contest_id?._id,
          paymentId: response.razorpay_payment_id,
          coordinates: carts[0]?.user_coordinates,
          tickets: carts[0]?.tickets_count,
          amount: totalBeforeDiscount,
          discountApplied: {
            name: calculatedCarts[0]?.discount?.name,
            discountPercentage:
              calculatedCarts[0]?.discount?.discountPercentage,
          },
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
