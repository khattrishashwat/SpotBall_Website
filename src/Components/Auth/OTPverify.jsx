import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import NewPassword from "./NewPassword";

function OTPverify({ onClosedss, emailOrPhone }) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [timer, setTimer] = useState(60); // Timer state for resend OTP
  const inputRefs = useRef([]);

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  const handleInputChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async () => {
    let token = localStorage.getItem("tokens");

    if (otp.includes("")) {
      Swal.fire({
        icon: "error",
        text: "Please enter OTP",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
      return;
    }

    if (otp.join("").length < 4) {
      Swal.fire({
        icon: "error",
        text: "Please enter valid OTP",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
      return;
    }

    try {
      const response = await axios.post(
        "app/auth/submit-otp",
        { otp: otp.join("") },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.setItem("tokens", response.data.data.token);

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          text: "OTP verified successfully!",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });
        setShowNewPassword(true);
      } else {
        Swal.fire({
          icon: "error",
          text: response.data.message ,
        });
        setOtp(["", "", "", ""]);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.response ? error.response.data.message : error.message,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
      setOtp(["", "", "", ""]);
    }
  };

  const resendOtp = async () => {
    if (timer > 0) return; // Prevent resending if timer is active
  setTimer(60); 

    let token = localStorage.getItem("tokens");

    try {
      const response = await axios.post(
        "app/auth/send-otp",
        { emailOrPhone },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("tokens");
      localStorage.setItem("tokens", response.data.data.token);

      Swal.fire({
        icon: "success",
        text: response.data.message,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });

      // Start the timer
      // setTimer(60);
    } catch (error) {
          setTimer(0); 

      Swal.fire({
        icon: "error",
        text: error.response ? error.response.data.message : error.message,
        confirmButtonText: "OK",
        allowOutsideClick: false,
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
                                  type="number"
                                  className="otp__digit"
                                  value={digit}
                                  onChange={(e) =>
                                    handleInputChange(index, e.target.value)
                                  }
                                  maxLength={1}
                                  ref={(el) => (inputRefs.current[index] = el)}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="resentdivforotp">
                            <button
                              type="button"
                              className="resentotpbtn"
                              onClick={resendOtp}
                              disabled={timer > 0} // Disable button if timer is active
                            >
                              {timer > 0
                                ? `Resend OTP in ${timer}s`
                                : "Resend OTP"}
                            </button>
                          </div>
                          <div className="form-control loginformctrl">
                            <button
                              type="button"
                              className="loginbtn otpverify_sbmtbtn"
                              onClick={verifyOtp}
                              // disabled={otp.includes("")}
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
          emailOrPhone={emailOrPhone}
        />
      )}
    </>
  );
}

export default OTPverify;
