import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import NewPassword from "./NewPassword";

function OTPverify({ onClose, token, email }) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Function to handle OTP input change
  const handleInputChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last digit
    setOtp(newOtp);

    // Move to the next input
    if (value && index < otp.length - 1) {
      const nextInput = document.querySelector(
        `.otp__digit:nth-child(${index + 2})`
      );
      if (nextInput) nextInput.focus();
    }
  };

  // Function to verify the OTP
  const verifyOtp = async () => {
    try {
      const response = await axios.post(
        "submit-otp",
        { otp: otp.join("") }, // Join OTP array into a string
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use the token from props
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          text: "OTP verified successfully!",
        });
        setShowNewPassword(true); // Show new password form
      } else {
        Swal.fire({
          icon: "error",
          text: response.data.message || "OTP verification failed!",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.response ? error.response.data.message : error.message,
      });
    }
  };

  // Function to resend OTP
  const resendOtp = async () => {
    try {
      const response = await axios.post(
        "resend-otp-user-verification",
        { email }, // Send the email when resending OTP
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use the token from props
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
      <div className="signinpopup_main" style={{ display: "block" }}>
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
                            onClick={onClose}
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
                                />
                              ))}
                            </div>
                          </div>
                          <div className="resentdivforotp">
                            <button
                              type="button"
                              className="resentotpbtn"
                              onClick={resendOtp} // Handle Resend OTP
                            >
                              Resend OTP
                            </button>
                          </div>
                          <div className="form-control loginformctrl">
                            <button
                              type="button"
                              className="loginbtn otpverify_sbmtbtn"
                              onClick={verifyOtp} // Submit the OTP for verification
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
      {showNewPassword && (
        <NewPassword onClose={() => setShowNewPassword(false)} email={email} />
      )}
    </>
  );
}

export default OTPverify;
