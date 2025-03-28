import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function Otps() {
  const location = useLocation();
  const navigate = useNavigate();

  const emailOrPhone = location.state?.email || "";
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(60);

  // Countdown timer
  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [timer]);

  // Handle OTP input field change
  const handleInputChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // Allow only single-digit numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP
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

    try {
      const response = await axios.post(
        "app/auth/verify-user",
        { otp: otp.join("") },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        icon: "success",
        text: "OTP verified successfully!",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });

      navigate("/login");
      localStorage.removeItem("tokens");
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.response?.data?.message || "OTP verification failed",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
      setOtp(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    if (timer > 0) return; // Prevent multiple clicks

    let token = localStorage.getItem("tokens");

    try {
      const response = await axios.post(
        "app/auth/send-otp",
        { emailOrPhone },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      localStorage.setItem("tokens", response.data.data.token);

      Swal.fire({
        icon: "success",
        text: response.data.message,
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });

      setOtp(["", "", "", ""]); // Clear input fields
      inputRefs.current[0]?.focus();

      setTimer(60); // Start timer only after success
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: error.response?.data?.message || "Failed to resend OTP",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    }
  };

  return (
    <>
      <section className="adminloginsection" style={{ height: "100svh" }}>
        <div className="container contfld-loginform">
          <div className="col-md-12 col12mainloginform">
            <div className="row rowmaqinloginform">
              <div className="col-md-12 col12loginseconddiv">
                <div className="col-md-7 col6sliderdiv">
                  <div className="login_left_img banner">
                    <div className="banner-img">
                      <img
                        className="img-fluid hori-move"
                        src={`${process.env.PUBLIC_URL}/images/aaa.png`}
                        alt=""
                      />
                      <div className="pattern-04">
                        <img
                          src={`${process.env.PUBLIC_URL}/images/Artboard 2@4x.png`}
                          alt=""
                        />
                      </div>
                      <div className="pattern-03 login">
                        <img
                          className="img-fluid vert-move"
                          src={`${process.env.PUBLIC_URL}/images/target.png`}
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-5 col6formsidediv">
                  <div className="loginologo">
                    <img
                      src={`${process.env.PUBLIC_URL}/images/logo.png`}
                      alt="Logo"
                    />
                  </div>
                  <div className="colformlogin">
                    <div className="login-heading">
                      <h2>OTP Verification</h2>
                      <p>Enter the 4-digit OTP sent to your email</p>
                    </div>

                    {/* OTP Input Fields */}
                    <div className="formstart otp">
                      {otp.map((digit, index) => (
                        <div key={index} className="form-control frmctrldiv">
                          <input
                            key={index}
                            type="text"
                            className="error"
                            value={digit}
                            onChange={(e) =>
                              handleInputChange(index, e.target.value)
                            }
                            ref={(el) => (inputRefs.current[index] = el)}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Submit Button */}
                    <div className="form-control loginformctrl">
                      <button
                        type="button"
                        onClick={verifyOtp}
                        className="loginbtn"
                      >
                        Submit
                      </button>
                    </div>

                    {/* Resend OTP */}
                    <div className="login-heading">
                      <p>
                        Didn't receive an OTP?{" "}
                        <a
                          onClick={resendOtp}
                          disabled={timer > 0}
                          className="resend-btn"
                          style={{ cursor: "pointer" }}
                        >
                          Resend {timer > 0 ? `(${timer}s)` : ""}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Otps;
