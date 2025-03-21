import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../Loader/Loader";
import Account from "./Account";
import ChangePassword from "./ChangePassword";
import PastPayment from "./PastPayment";
import axios from "axios";
import Swal from "sweetalert2";

function Profile() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("update_profile");
  const [isDeactivate, setIsDeactivate] = useState(false);
  const [isDel, setIsDel] = useState(false);
  const [isLogout, setIsLogout] = useState("");
  const [isLoading, setIsLoading] = useState("");

  const changePasswordRef = useRef(null);

  // Reset the form whenever the tab changes
  const resetForm = (tab) => {
    if (tab === "change_password" && changePasswordRef.current) {
      changePasswordRef.current();
    }
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    resetForm(tabId); // Reset form when tab is changed
  };
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  useEffect(() => {
    resetForm(activeTab); // Reset on initial load or tab change
  }, [activeTab]);

  const DecopenModal = () => {
    setIsDeactivate(true);
  };
  const DeccloseModal = () => {
    setIsDeactivate(false);
  };
  const DeleteModal = () => {
    setIsDel(true);
  };
  const DeleteCloseModal = () => {
    setIsDel(false);
  };

  const OpenLogout = () => {
    setIsLogout(true);
  };
  const CloseLogout = () => {
    setIsLogout(false);
  };

  const fetchDeactive = async () => {
    const token = localStorage.getItem("Web-token");
    try {
      setIsLoading(true);
      const response = await axios.get(`app/profile/active-inactive`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Your account has been successfully deactivated",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/");
          localStorage.removeItem("Web-token");
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Account Deactivation Failed",
        text: error.response?.data?.message,
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // const fetchDeactive = async () => {
  //   const token = localStorage.getItem("Web-token");
  //   try {
  //     setIsLoading(true);
  //     const response = await axios.get(`app/profile/active-inactive`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (response) {
  //       // Clear token and navigate to homepage
  //       localStorage.removeItem("Web-token");
  //       Swal.fire({
  //         title: response.data.message,
  //         confirmButtonText: "OK",
  //         allowOutsideClick: false,
  //       }).then(() => {
  //         navigate("/");
  //       },10000);
  //     }
  //   } catch (error) {
  //     console.log("err",error)
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const fetchDelete = async () => {
    const token = localStorage.getItem("Web-token");
    try {
      setIsLoading(true);
      const response = await axios.get(`app/profile/delete-account`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        Swal.fire({
          title: "Your account has been deleted successfully.",
          text: "To reactivate, please contact support at support.in@spotsball.com.",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        }).then(() => {
          navigate("/");
          localStorage.removeItem("Web-token");
        });
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      Swal.fire({
        icon: "error",
        title: "Account Deletion Failed",
        text: error.response?.data?.message,
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const Logout = async () => {
    localStorage.removeItem("Web-token");
    Swal.fire({
      icon: "success",
      title: "Logout Successful",
      text: "You have been logged out successfully.",
      timer: 2000,
      showConfirmButton: false,
    });
    navigate("/");
  };

  useEffect(() => {
    if (isDel || isLogout || isDeactivate) {
      document.body.style.overflow = "hidden"; // Disable background scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable background scrolling
    }

    // Cleanup on component unmount or modal close
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isDel, isLogout, isDeactivate]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <section className="maincont_section myacocunt_sectionforbgimg">
            <div className="container contforinner_mainheading">
              <div className="row rowmainheading_inner">
                <div className="col-md-12 colmainheading_innerpages">
                  <div className="pageheading_main page_myaccountdiv">
                    <h2 className="myaccounheading">My Account</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="container contrighttabbingpage">
              <div className="col-md-10 offset-md-1">
                <div className="row rowtabbingpage">
                  <div className="col-lg-4 coltabbingdiv">
                    <div className="navtabdiv">
                      <ul className="nav nav-tabs">
                        <li className="nav-item">
                          <a
                            className={`nav-link ${
                              activeTab === "update_profile" ? "active" : ""
                            }`}
                            onClick={() => handleTabClick("update_profile")}
                          >
                            <div className="tabbingiconbgdiv">
                              {" "}
                              <img
                                src={`${process.env.PUBLIC_URL}/images/profile_icon.png`}
                              />{" "}
                            </div>
                            <span className="navlinkname">Update Profile</span>{" "}
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className={`nav-link ${
                              activeTab === "change_password" ? "active" : ""
                            }`}
                            onClick={() => handleTabClick("change_password")}
                          >
                            <div className="tabbingiconbgdiv">
                              {" "}
                              <img
                                src={`${process.env.PUBLIC_URL}/images/change_pass_icon.png`}
                              />{" "}
                            </div>
                            <span className="navlinkname">Change Password</span>
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className={`nav-link ${
                              activeTab === "paymentmethod" ? "active" : ""
                            }`}
                            onClick={() => handleTabClick("paymentmethod")}
                          >
                            <div className="tabbingiconbgdiv">
                              {" "}
                              <img
                                src={`${process.env.PUBLIC_URL}/images/payment_icon.png`}
                              />{" "}
                            </div>
                            <span className="navlinkname">Past Payments</span>
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link"
                            data-toggle="modal"
                            data-target="#deactivate_account_modal"
                            onClick={DecopenModal}
                          >
                            <div className="tabbingiconbgdiv">
                              {" "}
                              <img
                                src={`${process.env.PUBLIC_URL}/images/deactivate_acc_icon.png`}
                              />{" "}
                            </div>
                            <span className="navlinkname">
                              Deactivate Account
                            </span>
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link"
                            data-toggle="modal"
                            data-target="#delete_account_modal"
                            onClick={DeleteModal}
                          >
                            <div className="tabbingiconbgdiv">
                              {" "}
                              <img
                                src={`${process.env.PUBLIC_URL}/images/delete_acc_icon.png`}
                              />{" "}
                            </div>
                            <span className="navlinkname">Delete Account</span>
                          </a>
                        </li>
                        <li className="nav-item">
                          <a
                            className="nav-link"
                            data-toggle="modal"
                            data-target="#logout_account_modal"
                            onClick={OpenLogout}
                          >
                            <div className="tabbingiconbgdiv">
                              {" "}
                              <img
                                src={`${process.env.PUBLIC_URL}/images/logout_icon.png`}
                              />{" "}
                            </div>
                            <span className="navlinkname">Logout</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-8 coltabdata_righttext">
                    <div className="tabingrighttextdiv checkoutcards_section">
                      <div className="tab-content">
                        <div
                          id="update_profile"
                          className={`tab-pane ${
                            activeTab === "update_profile" ? "active show" : ""
                          }`}
                        >
                          <Account
                            resetForm={() => resetForm("update_profile")}
                          />
                        </div>
                        <div
                          id="change_password"
                          className={`tab-pane fade ${
                            activeTab === "change_password" ? "active show" : ""
                          }`}
                        >
                          {activeTab === "change_password" && (
                            <ChangePassword resetForm={resetForm} />
                          )}
                        </div>
                        <div
                          id="paymentmethod"
                          className={`tab-pane fade ${
                            activeTab === "paymentmethod" ? "active show" : ""
                          }`}
                        >
                          <PastPayment
                            resetForm={() => resetForm("paymentmethod")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <div
        className={`modal fade deleteacc_mainpopup_mdl ${
          isDeactivate ? "show" : ""
        }`}
        id="deactivate_account_modal"
        role="dialog"
        style={{
          // paddingRight: isDeactivate ? 17 : "",
          display: isDeactivate ? "block" : "none",
          backgroundColor: isDeactivate ? "#303030a3" : "",
        }}
        aria-modal={isDeactivate ? "true" : "false"}
      >
        <div className="modal-dialog deleteacc_mdldlg">
          <div className="modal-content mdlcnt_deleteacc">
            <button
              type="button"
              className="logoutpopup_crossicon"
              data-dismiss="modal"
              onClick={DeccloseModal}
            >
              <img
                src={`${process.env.PUBLIC_URL}/images/cross_icon.png`}
                alt="close"
              />
            </button>
            <div className="modal-body mdlbdy_delete_account">
              <div className="deleteacc_text_data">
                <h2>Deactivate Account</h2>
                <p>
                  You choose to temporarily OptOut from Playing SpotsBall, we
                  put your account in a suspended state. When/if you want to
                  reactivate, you can send an email to{" "}
                  <span className="support-email">
                    {" "}
                    support.in@spotsball.com
                  </span>
                  , and will receive reset instructions for your password.
                </p>
              </div>
            </div>
            <div className="mdlftr_delete_acc_actionbtn">
              <div className="actionbtn_delete">
                <button
                  type="button"
                  className="cncle_btn_delete actionbtnmain"
                  data-dismiss="modal"
                  onClick={DeccloseModal}
                >
                  Cancel
                </button>
              </div>
              <div className="actionbtn_delete">
                <button
                  type="button"
                  className="delete_btn_delete actionbtnmain"
                  onClick={fetchDeactive}
                >
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`modal fade deleteacc_mainpopup_mdl ${isDel ? "show" : ""}`}
        id="delete_account_modal"
        style={{
          // paddingRight: isDel ? 17 : "",
          display: isDel ? "block" : "none",
          backgroundColor: isDel ? "#303030a3" : "",
        }}
        aria-modal={isDel ? "true" : "false"}
      >
        <div className="modal-dialog deleteacc_mdldlg">
          <div className="modal-content mdlcnt_deleteacc">
            <button
              type="button"
              className="logoutpopup_crossicon"
              data-dismiss="modal"
              onClick={DeleteCloseModal}
            >
              {" "}
              <img
                src={`${process.env.PUBLIC_URL}/images/cross_icon.png`}
                // src="images/cross_icon.png"
              />{" "}
            </button>
            <div className="modal-body mdlbdy_delete_account">
              <div className="deleteacc_text_data">
                <h2>Delete Account</h2>
                <p>
                  You chose to temporarily opt out of playing SpotsBall, so we
                  have put your account in deleted state. If you wish to
                  reactivate your deleted account, you can send an email to
                  support.in@spotsball.com.
                </p>
              </div>
            </div>
            <div className="mdlftr_delete_acc_actionbtn">
              <div className="actionbtn_delete">
                <button
                  type="button"
                  className="cncle_btn_delete actionbtnmain"
                  data-dismiss="modal"
                  onClick={DeleteCloseModal}
                >
                  Cancel
                </button>
              </div>
              <div className="actionbtn_delete">
                <button
                  type="button"
                  className="delete_btn_delete actionbtnmain"
                  onClick={fetchDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`modal fade deleteacc_mainpopup_mdl ${
          isLogout ? "show" : ""
        }`}
        id="logout_account_modal"
        role="dialog"
        style={{
          paddingRight: isLogout ? 17 : "",
          display: isLogout ? "block" : "none",
          backgroundColor: isLogout ? "#303030a3" : "",
        }}
        aria-modal="true"
      >
        <div className="modal-dialog deleteacc_mdldlg dlgdlg_logoutpopup">
          <div className="modal-content mdlcnt_deleteacc">
            <button
              type="button"
              className="logoutpopup_crossicon"
              onClick={CloseLogout}
            >
              <img
                src={`${process.env.PUBLIC_URL}/images/cross_icon.png`}
                alt="Close"
              />
            </button>
            <div className="modal-body mdlbdy_delete_account logoutaccount_divmain">
              <div className="deleteacc_text_data logoutdatamain">
                <h2>Logout</h2>
                <p>Are you sure you want to logout?</p>
              </div>
            </div>
            <div className="mdlftr_delete_acc_actionbtn">
              <div className="actionbtn_delete">
                <button
                  type="button"
                  className="cncle_btn_delete actionbtnmain"
                  onClick={CloseLogout}
                >
                  Cancel
                </button>
              </div>
              <div className="actionbtn_delete">
                <button
                  type="button"
                  className="delete_btn_delete actionbtnmain"
                  onClick={Logout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
