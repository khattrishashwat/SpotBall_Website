import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function Delete() {
  const [step, setStep] = useState(1); // Step 1: Verify Email/Mobile, Step 2: Enter OTP
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [otp, setOtp] = useState("");

  const handleVerify = async () => {
    // Check if email or mobile is provided
    if (!emailOrMobile.trim()) {
      Swal.fire({
        icon: "error",
        text: "Please enter your email or mobile number.",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
      return;
    }

   // console.log("Email/Mobile Input:", emailOrMobile);

    try {
      // Make API request to send OTP
      const response = await axios.post("app/auth/send-delete-account-otp", {
        emailOrPhone: emailOrMobile.trim(), // Ensure no leading/trailing spaces
      });

      // Handle success response
      if (response.data?.success) {
        // Store the token in local storage
        localStorage.setItem("del_tokens", response.data.data.token);

        Swal.fire({
          icon: "success",
          title: "Verification Sent",
          text: "A verification code has been sent to your email or mobile number.",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });

        // Move to OTP entry step
        setStep(2);
      } else {
        Swal.fire({
          icon: "error",
          text: response.data.message || "Failed to send verification code.",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });
      }
    } catch (error) {
      // Handle errors
      Swal.fire({
        icon: "error",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    }
  };

  // Function to handle account deletion
  const handleDelete = async () => {
    // Validate OTP for empty or incomplete entries
    if (otp.length < 4) {
      Swal.fire("Error", "Please enter the OTP.", "error");

      return;
    }

    try {
      const token = localStorage.getItem("del_tokens");

      const response = await axios.post(
        "app/auth/delete-account",
        {
          otp,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Account Deleted",
          text: "Your account has been deleted.",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });

        // Remove token from local storage
        localStorage.removeItem("del_tokens");

        // Redirect to the home page after 10 seconds
        setTimeout(() => {
          window.location.href = "/";
        }, 5000);
      } else {
        Swal.fire({
          icon: "error",
          text: response.data.message,
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        text:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    }
  };

  return (
    <section className="maincont_section myacocunt_sectionforbgimg">
      <div className="container contforinner_mainheading">
        <div className="row rowmainheading_inner">
          <div className="col-md-12 colmainheading_innerpages">
            <div className="pageheading_main page_myaccountdiv">
              <h2 className="myaccounheading">Delete My Account</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="container contrighttabbingpage">
        <div className="col-md-10 offset-md-1">
          <div className="row rowtabbingpage">
            <div className="col-md-12 coltabdata_righttext">
              <div className="tabingrighttextdiv checkoutcards_section">
                <div className="tab-content">
                  {step === 1 && (
                    <div id="delete_profile" className="tab-pane active">
                      <div className="profilesection_inner">
                        <div className="modal-body mdlbdy_delete_account">
                          <div className="deleteacc_text_data">
                            <p>
                              Are you sure you want to delete your account?
                              Verify your account first by entering your email
                              or mobile number.
                            </p>
                            <div className="inputdiv_updatepro">
                              <input
                                className="updateinput"
                                type="text"
                                placeholder="Enter Email/Mobile Number"
                                aria-label="Email or Mobile Number"
                                value={emailOrMobile}
                                onChange={(e) =>
                                  setEmailOrMobile(e.target.value)
                                }
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="locationactionbtndiv">
                          <div className="denybtndiv actionbtn_loc">
                            <button
                              type="button"
                              className="denybtn loc_btn"
                              onClick={() => setStep(1)}
                            >
                              Deny
                            </button>
                          </div>
                          <div className="allowbtndiv actionbtn_loc">
                            <button
                              type="button"
                              className="allowbtn loc_btn"
                              onClick={handleVerify}
                            >
                              Allow
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div id="sure_delete_profile" className="tab-pane active">
                      <div className="profilesection_inner">
                        <div className="modal-body mdlbdy_delete_account">
                          <div className="deleteacc_text_data">
                            <h2>Delete Account</h2>
                            <p>
                              If you delete or terminate your access to the
                              application, your ID and passwords will no longer
                              work. To rejoin, you'll need to sign up as a new
                              user.
                            </p>
                          </div>
                        </div>
                        <div className="inputdiv_updatepro">
                          <input
                            className="updateinput"
                            type="text"
                            placeholder="Enter OTP"
                            aria-label="One-Time Password"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                          />
                        </div>
                        <div className="locationactionbtndiv">
                          <div className="denybtndiv actionbtn_loc">
                            <button
                              type="button"
                              className="denybtn loc_btn"
                              onClick={() => setStep(1)}
                            >
                              Deny
                            </button>
                          </div>
                          <div className="allowbtndiv actionbtn_loc">
                            <button
                              type="button"
                              className="allowbtn loc_btn"
                              onClick={handleDelete}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Delete;
