import React, { useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import NewPassword from "./NewPassword";

function OTPverify({ onClosedss, token, email }) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const inputRefs = useRef([]);

  // Function to handle OTP input change
  const handleInputChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last digit
    setOtp(newOtp);

    // Move to the next input
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      // Handle backspace, move to the previous input if empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Function to verify the OTP
  const verifyOtp = async () => {
    try {
      const response = await axios.post(
        "submit-otp",
        { otp: otp.join("") },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          text: "OTP verified successfully!",
        });
        setShowNewPassword(true);
        // onClosedss(); // Close OTP popup when NewPassword is opened
      } else {
        Swal.fire({
          icon: "error",
          text: response.data.message || "OTP verification failed!",
        });
        setOtp(["", "", "", ""]); // Clear OTP input
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.response ? error.response.data.message : error.message,
      });
      setOtp(["", "", "", ""]); // Clear OTP input on error
    }
  };

  // Function to resend OTP
  const resendOtp = async () => {
    try {
      const response = await axios.post(
        "resend-otp-user-verification",
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        text: "OTP resent successfully!",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.response ? error.response.data.message : error.message,
      });
    }
  };

  return (
    <>
      {/* OTP Verification Popup */}
      <div
        className="signinpopup_main"
        style={{ display: showNewPassword ? "none" : "block" }}
      >
        <div className="popup_mianSingindiv">
          <div className="adminloginsection">
            <div className="container contfld-loginform">
              <div className="col-md-12 col12mainloginform">
                <div className="row rowmaqinloginform">
                  <div className="col-md-6 offset-md-3 col12loginseconddiv">
                    <div className="col-md-12 col6formsidediv">
                      <div className="colformlogin">
                        <div className="crossbtndiv_signinpopup">
                          <button
                            type="button"
                            className="crossbtn_signinpopupclose otpverificationcrossbtn"
                            onClick={onClosedss}
                          >
                            <img
                              src={`${process.env.PUBLIC_URL}/images/cross_icon.png`}
                              alt="Close"
                            />
                          </button>
                        </div>
                        <h2>OTP Verification</h2>
                        <p className="forgotheadingtext">
                          OTP is sent to your registered Email / Mobile Number{" "}
                        </p>
                        <div className="formstart forgotpass_inputmaindiv">
                          <div className="otpinputdiv_verify">
                            <div className="enterotp_text_heaidng">
                              Enter OTP
                            </div>
                            <div className="otp-input-fields">
                              {otp.map((digit, index) => (
                                <input
                                  key={index}
                                  type="text"
                                  className="otp__digit"
                                  value={digit}
                                  onChange={(e) =>
                                    handleInputChange(index, e.target.value)
                                  }
                                  maxLength={1}
                                  ref={(el) => (inputRefs.current[index] = el)} // Use refs for inputs
                                />
                              ))}
                            </div>
                          </div>
                          <div className="resentdivforotp">
                            <button
                              type="button"
                              className="resentotpbtn"
                              onClick={resendOtp}
                            >
                              Resend OTP
                            </button>
                          </div>
                          <div className="form-control loginformctrl">
                            <button
                              type="button"
                              className="loginbtn otpverify_sbmtbtn"
                              onClick={verifyOtp}
                              disabled={otp.includes("")} // Disable if any field is empty
                            >
                              Submit
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

      {/* NewPassword Popup */}
      {showNewPassword && (
        <NewPassword
          onCloseds={() => setShowNewPassword(false)}
          email={email}
        />
      )}
    </>
  );
}

export default OTPverify;
