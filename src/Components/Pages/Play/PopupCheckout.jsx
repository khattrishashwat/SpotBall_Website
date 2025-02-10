// import React from 'react'

// function PopupCheckout() {
//   return (
//     <>
//       <div className="access_location_popup" style={{ display: "block" }}>
//         <div className="locationsettingpopup">
//           <div className="location_settingdiv">
//             <h2>Cancel Payment</h2>
//             <p>Your payment for this cart has been canceled.</p>
//             <p>You will now be redirected to the Home screen.</p>
//             <div className="getpermission_okbtndiv">
//               <button
//                 type="button"
//                 className="location_info_okaybtn"
//                 onClick={() => (window.location.href = "/")} // Redirect to Home
//               >
//                 OK
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default PopupCheckout
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const PopupCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search); // To parse query string
    const orderId = params.get("order_id"); // Get order_id from query string

    // If order_id is present, navigate to the Cart page
    if (orderId) {
      navigate("/cart");
    }
  }, [location.search, navigate]);

  return (
    <div>
      {/* Optionally, you can display a message or loader here */}
      <p>Redirecting to Cart...</p>
    </div>
  );
};

export default PopupCheckout;
