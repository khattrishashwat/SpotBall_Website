// // import React, { useState, useEffect } from "react";
// // import { Link, useLocation } from "react-router-dom";
// // import { Formik, Form, Field, ErrorMessage } from "formik";
// // import Swal from "sweetalert2";
// // import axios from "axios";
// // import {
// //   signInWithGoogle,
// //   signWithTwitter,
// //   signInWithFacebook,
// // } from "../FirebaseCofig/FirebaseConfig";
// // import * as Yup from "yup";

// // const SocialSignUP = ({ onSocial, closeSocial }) => {
// //   const location = useLocation();

// //   let storedValues = localStorage.getItem("UIDNotFound");
// //   useEffect(() => {
// //     // Check if popupOpen is false in the location state
// //     if (location.state?.popupOpen === false) {
// //       onSocial(false); // Close the popup
// //     } else if (location.state?.popupOpen === true) {
// //       onSocial(true); // Keep the popup open if navigating to linked pages like terms or rules
// //     }
// //   }, [location.state]);
// //   let initialValues =
// //     storedValues && storedValues !== "undefined"
// //       ? JSON.parse(storedValues)
// //       : {
// //           first_name: "",
// //           last_name: "",
// //           email: "",
// //           phone: "",
// //           signup_method: "",
// //           agreeAllLegal: false,
// //           agreeRules: false,
// //           agreeAge: false,
// //         };

// //   if (!storedValues || storedValues === "undefined") {
// //     localStorage.removeItem("UIDNotFound");
// //   }

// //   const validateFields = Yup.object().shape({
// //     first_name: Yup.string().required("First name is required"),
// //     last_name: Yup.string().required("Last name is required"),
// //     email: Yup.string().email("Invalid email").required("Email is required"),
// //     phone: Yup.string()
// //       .matches(/^\d{10}$/, "Phone number must be 10 digits")
// //       .required("Phone number is required"),
// //     agreeAllLegal: Yup.boolean().oneOf([true], "You must agree to continue"),
// //     agreeRules: Yup.boolean().oneOf([true], "You must agree to continue"),
// //     agreeAge: Yup.boolean().oneOf([true], "You must agree to continue"),
// //   });

// //   const handleFieldChange = (field, value, setFieldValue) => {
// //     setFieldValue(field, value);
// //     const updatedValues = {
// //       ...initialValues,
// //       [field]: value,
// //     };
// //     localStorage.setItem("UIDNotFound", JSON.stringify(updatedValues));
// //   };

// //   const handleNumericInput = (value) =>
// //     value.replace(/[^0-9]/g, "").slice(0, 10);

// //   const handleSocialSignup = async (values) => {
// //     console.log("social", values);
// //     const formattedPhone = values.phone.startsWith("+91")
// //       ? values.phone
// //       : `+91${values.phone}`;

// //     try {
// //       const response = await axios.post("app/auth/social-login", {
// //         ...values,
// //         phone: formattedPhone,
// //         signup_method: values.signup_method,
// //         device_type: "website",
// //         device_token: localStorage.getItem("device_token"),
// //       });

// //       const token = response.data.data.token;
// //       localStorage.setItem("Web-token", token);

// //       Swal.fire({
// //         title: response.data.message,
// //         allowOutsideClick: false,
// //         showConfirmButton: false,
// //         timer: 1000,
// //       }).then(() => {
// //         localStorage.removeItem("UIDNotFound");
// //         window.location.reload();
// //       });
// //     } catch (error) {
// //       Swal.fire({
// //         icon: "error",
// //         title: "Social Signup Failed",
// //         text: error.response ? error.response.data.message : error.message,
// //         confirmButtonText: "OK",
// //         allowOutsideClick: false,
// //       });
// //       console.error(error);
// //     }
// //   };

// //   const handleGoogleSignup = (setFieldValue) => {
// //     setFieldValue("signup_method", "google");
// //     signInWithGoogle(setFieldValue);
// //   };

// //   const handleFacebookSignup = (setFieldValue) => {
// //     setFieldValue("signup_method", "facebook");
// //     signInWithFacebook(setFieldValue);
// //   };

// //   const handleTwitterSignup = (setFieldValue) => {
// //     setFieldValue("signup_method", "twitter");
// //     signWithTwitter(setFieldValue);
// //   };

// //   const legalLinks = {
// //     title: "Legal",
// //     links: ["Terms & Conditions", "Privacy Policy", "Cookie Policy"],
// //     paths: ["/terms", "/privacy", "/cookies"],
// //   };

// //   return (
// //     <div
// //       className={`signinpopup_main ${onSocial ? "show" : ""}`}
// //       //   className="signinpopup_main"
// //       id="signup_popup"
// //       //   style={{ display: "block" }}
// //       style={{ display: onSocial ? "block" : "none" }}
// //     >
// //       <div className="popup_mianSingindiv mainpopupfrsignupdiv_new">
// //         <div className="adminloginsection">
// //           <div className="container contfld-loginform">
// //             <div className="col-md-12 col12mainloginform">
// //               <div className="row rowmaqinloginform">
// //                 <div className="col-md-6 offset-md-3 col12loginseconddiv">
// //                   <div className="col-md-12 col6formsidediv">
// //                     <div className="colformlogin">
// //                       <div className="crossbtndiv_signinpopup">
// //                         <button
// //                           type="button"
// //                           className="crossbtn_signinpopupclose singupcrossbtn"
// //                           // onClick={closeSocial}
// //                           onClick={() => {
// //                             closeSocial();
// //                             localStorage.removeItem("UIDNotFound");
// //                           }}
// //                         >
// //                           <img
// //                             src={`${process.env.PUBLIC_URL}/images/cross_icon.png`}
// //                             alt="Close"
// //                           />
// //                         </button>
// //                       </div>
// //                       <h2>Social Sign Up</h2>
// //                       <Formik
// //                         initialValues={initialValues}
// //                         validationSchema={validateFields}
// //                         onSubmit={handleSocialSignup}
// //                       >
// //                         {({ isSubmitting, setFieldValue }) => (
// //                           <Form className="formstart">
// //                             <div className="form-control frmctrldiv">
// //                               <Field
// //                                 type="text"
// //                                 name="first_name"
// //                                 placeholder="First Name"
// //                                 onChange={(e) =>
// //                                   handleFieldChange(
// //                                     "first_name",
// //                                     e.target.value,
// //                                     setFieldValue
// //                                   )
// //                                 }
// //                               />
// //                               <ErrorMessage
// //                                 name="first_name"
// //                                 component="div"
// //                                 className="error-message"
// //                               />
// //                             </div>

// //                             <div className="form-control frmctrldiv">
// //                               <Field
// //                                 type="text"
// //                                 name="last_name"
// //                                 placeholder="Last Name"
// //                                 onChange={(e) =>
// //                                   handleFieldChange(
// //                                     "last_name",
// //                                     e.target.value,
// //                                     setFieldValue
// //                                   )
// //                                 }
// //                               />
// //                               <ErrorMessage
// //                                 name="last_name"
// //                                 component="div"
// //                                 className="error-message"
// //                               />
// //                             </div>

// //                             <div className="form-control frmctrldiv">
// //                               <Field
// //                                 type="email"
// //                                 name="email"
// //                                 placeholder="Email"
// //                                 disabled
// //                                 // onChange={(e) =>
// //                                 //   handleFieldChange(
// //                                 //     "email",
// //                                 //     e.target.value,
// //                                 //     setFieldValue
// //                                 //   )
// //                                 // }
// //                               />
// //                               <ErrorMessage
// //                                 name="email"
// //                                 component="div"
// //                                 className="error-message"
// //                               />
// //                             </div>

// //                             <div className="form-control frmctrldiv">
// //                               <Field
// //                                 type="text"
// //                                 name="phone"
// //                                 placeholder="Mobile number"
// //                                 onChange={(e) => {
// //                                   const numericValue = handleNumericInput(
// //                                     e.target.value
// //                                   );
// //                                   handleFieldChange(
// //                                     "phone",
// //                                     numericValue,
// //                                     setFieldValue
// //                                   );
// //                                   setFieldValue("phone", numericValue);
// //                                 }}
// //                               />

// //                               <ErrorMessage
// //                                 name="phone"
// //                                 component="div"
// //                                 className="error-message"
// //                               />
// //                             </div>

// //                             <div className="remeberrecoverydiv mb-0">
// //                               <div className="rememebrmediv">
// //                                 <Field
// //                                   type="checkbox"
// //                                   name="agreeAllLegal"
// //                                   className="checkboxemeber"
// //                                 />

// //                                 <label
// //                                   htmlFor="rememebrbtn-legal"
// //                                   className="labelrememebrme"
// //                                 >
// //                                   I have read &amp; agree with{" "}
// //                                   <span>
// //                                     {legalLinks.links.map((link, index) => (
// //                                       <React.Fragment key={index}>
// //                                         <Link
// //                                           to={legalLinks.paths[index]}
// //                                           state={{ popupOpen: false }}
// //                                           onClick={(e) => {
// //                                             closeSocial();
// //                                             localStorage.removeItem(
// //                                               "isSocialSignup"
// //                                             );
// //                                           }}
// //                                         >
// //                                           {link}
// //                                         </Link>
// //                                         {index < legalLinks.links.length - 1
// //                                           ? ", "
// //                                           : ""}
// //                                       </React.Fragment>
// //                                     ))}
// //                                   </span>
// //                                 </label>
// //                               </div>
// //                             </div>
// //                             <ErrorMessage
// //                               name="agreeAllLegal"
// //                               component="div"
// //                               className="error-message"
// //                             />

// //                             {/* Rules of Play & FAQ */}
// //                             <div className="remeberrecoverydiv mv-0">
// //                               <div className="rememebrmediv">
// //                                 <Field
// //                                   type="checkbox"
// //                                   name="agreeRules"
// //                                   className="checkboxemeber"
// //                                 />

// //                                 <label className="labelrememebrme">
// //                                   I have read & agree with{" "}
// //                                   <Link
// //                                     to="/rules"
// //                                     state={{ popupOpen: false }}
// //                                     // target="_blank"
// //                                     // rel="noopener noreferrer"
// //                                   >
// //                                     Rules of Play & FAQ's
// //                                   </Link>
// //                                 </label>
// //                               </div>
// //                             </div>
// //                             <ErrorMessage
// //                               name="agreeRules"
// //                               component="div"
// //                               className="error-message"
// //                             />

// //                             <div className="remeberrecoverydiv mb-0">
// //                               <div className="rememebrmediv">
// //                                 <Field
// //                                   type="checkbox"
// //                                   name="agreeAge"
// //                                   className="checkboxemeber"
// //                                 />

// //                                 <label className="labelrememebrme">
// //                                   I hereby confirm and acknowledge that I am not
// //                                   a minor, and that I am least 18 years old as
// //                                   of today’s date.
// //                                 </label>
// //                               </div>
// //                             </div>
// //                             <ErrorMessage
// //                               name="agreeAge"
// //                               component="div"
// //                               className="error-message"
// //                             />

// //                             <div className="form-control loginformctrl">
// //                               <button
// //                                 type="submit"
// //                                 className="loginbtn"
// //                                 disabled={isSubmitting}
// //                               >
// //                                 Sign Up
// //                               </button>
// //                             </div>

// //                             <div className="signupwithsocial_div signup_page_socialdiv">
// //                               <div className="signupsociallinks">
// //                                 <ul>
// //                                   <li>
// //                                     <a
// //                                       onClick={() => {
// //                                         handleGoogleSignup(
// //                                           setFieldValue,
// //                                           "google"
// //                                         );
// //                                       }}
// //                                       style={{ cursor: "pointer" }}
// //                                     >
// //                                       <img
// //                                         src={`${process.env.PUBLIC_URL}/images/google_icon.png`}
// //                                         alt="Google"
// //                                       />
// //                                     </a>
// //                                   </li>
// //                                   <li>
// //                                     <a
// //                                       onClick={() => {
// //                                         handleFacebookSignup(
// //                                           setFieldValue,
// //                                           "facebook"
// //                                         );
// //                                       }}
// //                                       style={{ cursor: "pointer" }}
// //                                     >
// //                                       <img
// //                                         src={`${process.env.PUBLIC_URL}/images/facebook_icon.png`}
// //                                         alt="Facebook"
// //                                       />
// //                                     </a>
// //                                   </li>
// //                                   <li>
// //                                     <a
// //                                       onClick={() => {
// //                                         handleTwitterSignup(
// //                                           setFieldValue,
// //                                           "twitter"
// //                                         );
// //                                       }}
// //                                       style={{ cursor: "pointer" }}
// //                                     >
// //                                       <img
// //                                         src={`${process.env.PUBLIC_URL}/images/Twitter_x_icon.png`}
// //                                         alt="Twitter"
// //                                       />
// //                                     </a>
// //                                   </li>
// //                                   {/* <li>
// //                                       <a>
// //                                         <img
// //                                           src={`${process.env.PUBLIC_URL}/images/apple_icon.png`}
// //                                           alt="Apple"
// //                                         />
// //                                       </a>
// //                                     </li>
// //                                     <li>
// //                                       <a href="#">
// //                                         <img
// //                                           src={`${process.env.PUBLIC_URL}/images/Instagram_icon.png`}
// //                                           alt="Instagram"
// //                                         />
// //                                       </a>
// //                                     </li> */}
// //                                 </ul>
// //                               </div>
// //                             </div>
// //                           </Form>
// //                         )}
// //                       </Formik>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default SocialSignUP;

// import React, { useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import Swal from "sweetalert2";
// import axios from "axios";
// import {
//   signInWithGoogle,
//   signWithTwitter,
//   signInWithFacebook,
// } from "../FirebaseCofig/FirebaseConfig";
// import * as Yup from "yup";

// const SocialSignUP = ({ onSocial, closeSocial }) => {
//   const location = useLocation();

//   // Get stored values from localStorage if available and valid
//   const storedValues = (() => {
//     const value = localStorage.getItem("UIDNotFound");
//     return value && value !== "undefined" ? JSON.parse(value):value;
//   })();

//   useEffect(() => {
//     // Handle popup state based on navigation state
//     if (location?.state?.popupOpen === false) {
//       onSocial(false);
//     } else if (location?.state?.popupOpen === true) {
//       onSocial(true);
//     }
//   }, [location, onSocial]);

//   // Remove invalid stored values
//   if (!storedValues) {
//     localStorage.removeItem("UIDNotFound");
//   }

//   const initialValues = storedValues || {
//     first_name: "",
//     last_name: "",
//     email: "",
//     phone: "",
//     signup_method: "",
//     agreeAllLegal: false,
//     agreeRules: false,
//     agreeAge: false,
//   };

//   const validateFields = Yup.object().shape({
//     first_name: Yup.string().required("First name is required"),
//     last_name: Yup.string().required("Last name is required"),
//     email: Yup.string().email("Invalid email").required("Email is required"),
//     phone: Yup.string()
//       .matches(/^\d{10}$/, "Phone number must be 10 digits")
//       .required("Phone number is required"),
//     agreeAllLegal: Yup.boolean().oneOf([true], "You must agree to continue"),
//     agreeRules: Yup.boolean().oneOf([true], "You must agree to continue"),
//     agreeAge: Yup.boolean().oneOf([true], "You must agree to continue"),
//   });

//   // Update field value and persist the changes in localStorage
//   const handleFieldChange = (field, value, setFieldValue) => {
//     setFieldValue(field, value);
//     const updatedValues = {
//       ...initialValues,
//       ...storedValues,
//       [field]: value,
//     };
//     localStorage.setItem("UIDNotFound", JSON.stringify(updatedValues));
//   };

//   // Handles numeric-only input for phone and updates Formik/localStorage
//   const handleNumericInput = (e, setFieldValue) => {
//     const numericValue = e.target.value.replace(/\D/g, "").slice(0, 10);
//     setFieldValue("phone", numericValue);
//     const updatedValues = {
//       ...initialValues,
//       ...storedValues,
//       phone: numericValue,
//     };
//     localStorage.setItem("UIDNotFound", JSON.stringify(updatedValues));
//   };

//   // Social sign-up API call
//   const handleSocialSignup = async (values) => {
//     const formattedPhone = values.phone.startsWith("+91")
//       ? values.phone
//       : `+91${values.phone}`;
//     try {
//       const response = await axios.post("app/auth/social-login", {
//         ...values,
//         phone: formattedPhone,
//         signup_method: values.signup_method,
//         device_type: "website",
//         device_token: localStorage.getItem("device_token"),
//       });

//       if (response.data && response.data.data) {
//         const token = response.data.data.token;
//         localStorage.setItem("Web-token", token);

//         Swal.fire({
//           title: response.data.message,
//           allowOutsideClick: false,
//           showConfirmButton: false,
//           timer: 1000,
//         }).then(() => {
//           localStorage.removeItem("UIDNotFound");
//           window.location.reload();
//         });
//       } else {
//         throw new Error("Invalid response format");
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Social Signup Failed",
//         text:
//           (error.response &&
//             error.response.data &&
//             error.response.data.message) ||
//           error.message ||
//           "An error occurred. Please try again.",
//         confirmButtonText: "OK",
//         allowOutsideClick: false,
//       });
//       console.error(error);
//     }
//   };

//   // Social login handlers
//   const handleGoogleSignup = (setFieldValue) => {
//     setFieldValue("signup_method", "google");
//     signInWithGoogle(setFieldValue);
//   };

//   const handleFacebookSignup = (setFieldValue) => {
//     setFieldValue("signup_method", "facebook");
//     signInWithFacebook(setFieldValue);
//   };

//   const handleTwitterSignup = (setFieldValue) => {
//     setFieldValue("signup_method", "twitter");
//     signWithTwitter(setFieldValue);
//   };

//   const legalLinks = {
//     title: "Legal",
//     links: ["Terms & Conditions", "Privacy Policy", "Cookie Policy"],
//     paths: ["/terms", "/privacy", "/cookies"],
//   };

//   return (
//     <div
//       className={`signinpopup_main ${onSocial ? "show" : ""}`}
//       id="signup_popup"
//       style={{ display: onSocial ? "block" : "none" }}
//     >
//       <div className="popup_mianSingindiv mainpopupfrsignupdiv_new">
//         <div className="adminloginsection">
//           <div className="container contfld-loginform">
//             <div className="col-md-12 col12mainloginform">
//               <div className="row rowmaqinloginform">
//                 <div className="col-md-6 offset-md-3 col12loginseconddiv">
//                   <div className="col-md-12 col6formsidediv">
//                     <div className="colformlogin">
//                       <div className="crossbtndiv_signinpopup">
//                         <button
//                           type="button"
//                           className="crossbtn_signinpopupclose singupcrossbtn"
//                           onClick={() => {
//                             closeSocial();
//                             localStorage.removeItem("UIDNotFound");
//                           }}
//                         >
//                           <img
//                             src={`${process.env.PUBLIC_URL}/images/cross_icon.png`}
//                             alt="Close"
//                           />
//                         </button>
//                       </div>
//                       <h2>Social Sign Up</h2>
//                       <Formik
//                         initialValues={initialValues}
//                         validationSchema={validateFields}
//                         onSubmit={handleSocialSignup}
//                         validateOnChange={true}
//                         validateOnBlur={true}
//                       >
//                         {({ errors, touched, isSubmitting, setFieldValue }) => (
//                           <Form className="formstart">
//                             <div className="form-control frmctrldiv">
//                               <Field
//                                 type="text"
//                                 name="first_name"
//                                 placeholder="First Name"
//                                 onChange={(e) =>
//                                   handleFieldChange(
//                                     "first_name",
//                                     e.target.value,
//                                     setFieldValue
//                                   )
//                                 }
//                               />
//                               <ErrorMessage
//                                 name="first_name"
//                                 component="div"
//                                 className="error-message"
//                               />
//                             </div>

//                             <div className="form-control frmctrldiv">
//                               <Field
//                                 type="text"
//                                 name="last_name"
//                                 placeholder="Last Name"
//                                 onChange={(e) =>
//                                   handleFieldChange(
//                                     "last_name",
//                                     e.target.value,
//                                     setFieldValue
//                                   )
//                                 }
//                               />
//                               <ErrorMessage
//                                 name="last_name"
//                                 component="div"
//                                 className="error-message"
//                               />
//                             </div>

//                             <div className="form-control frmctrldiv">
//                               <Field
//                                 type="email"
//                                 name="email"
//                                 placeholder="Email"
//                                 disabled
//                               />
//                               <ErrorMessage
//                                 name="email"
//                                 component="div"
//                                 className="error-message"
//                               />
//                             </div>

//                             <div className="form-control frmctrldiv">
//                               <Field
//                                 type="text"
//                                 name="phone"
//                                 placeholder="Mobile number"
//                                 onChange={(e) =>
//                                   handleNumericInput(e, setFieldValue)
//                                 }
//                               />
//                               <ErrorMessage
//                                 name="phone"
//                                 component="div"
//                                 className="error-message"
//                               />
//                             </div>

//                             <div className="remeberrecoverydiv mb-0">
//                               <div className="rememebrmediv">
//                                 <Field
//                                   type="checkbox"
//                                   name="agreeAllLegal"
//                                   className="checkboxemeber"
//                                 />
//                                 <label
//                                   htmlFor="rememebrbtn-legal"
//                                   className="labelrememebrme"
//                                 >
//                                   I have read &amp; agree with{" "}
//                                   <span>
//                                     {legalLinks.links.map((link, index) => (
//                                       <React.Fragment key={index}>
//                                         <Link
//                                           to={legalLinks.paths[index]}
//                                           state={{ popupOpen: false }}
//                                           // onClick={() => {
//                                           //   closeSocial();
//                                           //   localStorage.removeItem(
//                                           //     "isSocialSignup"
//                                           //   );
//                                           // }}
//                                         >
//                                           {link}
//                                         </Link>
//                                         {index < legalLinks.links.length - 1
//                                           ? ", "
//                                           : ""}
//                                       </React.Fragment>
//                                     ))}
//                                   </span>
//                                 </label>
//                               </div>
//                             </div>
//                             <ErrorMessage
//                               name="agreeAllLegal"
//                               component="div"
//                               className="error-message"
//                             />

//                             <div className="remeberrecoverydiv mv-0">
//                               <div className="rememebrmediv">
//                                 <Field
//                                   type="checkbox"
//                                   name="agreeRules"
//                                   className="checkboxemeber"
//                                 />
//                                 <label className="labelrememebrme">
//                                   I have read & agree with{" "}
//                                   <Link
//                                     to="/rules"
//                                     state={{ popupOpen: false }}
//                                   >
//                                     Rules of Play & FAQ's
//                                   </Link>
//                                 </label>
//                               </div>
//                             </div>
//                             <ErrorMessage
//                               name="agreeRules"
//                               component="div"
//                               className="error-message"
//                             />

//                             <div className="remeberrecoverydiv mb-0">
//                               <div className="rememebrmediv">
//                                 <Field
//                                   type="checkbox"
//                                   name="agreeAge"
//                                   className="checkboxemeber"
//                                 />
//                                 <label className="labelrememebrme">
//                                   I hereby confirm and acknowledge that I am not
//                                   a minor, and that I am at least 18 years old
//                                   as of today’s date.
//                                 </label>
//                               </div>
//                             </div>
//                             <ErrorMessage
//                               name="agreeAge"
//                               component="div"
//                               className="error-message"
//                             />

//                             <div className="form-control loginformctrl">
//                               <button
//                                 type="submit"
//                                 className="loginbtn"
//                                 disabled={isSubmitting}
//                               >
//                                 Sign Up
//                               </button>
//                             </div>

//                             <div className="signupwithsocial_div signup_page_socialdiv">
//                               <div className="signupsociallinks">
//                                 <ul>
//                                   <li>
//                                     <a
//                                       onClick={() =>
//                                         handleGoogleSignup(setFieldValue)
//                                       }
//                                       style={{ cursor: "pointer" }}
//                                     >
//                                       <img
//                                         src={`${process.env.PUBLIC_URL}/images/google_icon.png`}
//                                         alt="Google"
//                                       />
//                                     </a>
//                                   </li>
//                                   <li>
//                                     <a
//                                       onClick={() =>
//                                         handleFacebookSignup(setFieldValue)
//                                       }
//                                       style={{ cursor: "pointer" }}
//                                     >
//                                       <img
//                                         src={`${process.env.PUBLIC_URL}/images/facebook_icon.png`}
//                                         alt="Facebook"
//                                       />
//                                     </a>
//                                   </li>
//                                   <li>
//                                     <a
//                                       onClick={() =>
//                                         handleTwitterSignup(setFieldValue)
//                                       }
//                                       style={{ cursor: "pointer" }}
//                                     >
//                                       <img
//                                         src={`${process.env.PUBLIC_URL}/images/Twitter_x_icon.png`}
//                                         alt="Twitter"
//                                       />
//                                     </a>
//                                   </li>
//                                 </ul>
//                               </div>
//                             </div>
//                           </Form>
//                         )}
//                       </Formik>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SocialSignUP;

import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Swal from "sweetalert2";
import axios from "axios";
import {
  signInWithGoogle,
  signWithTwitter,
  signInWithFacebook,
} from "../FirebaseCofig/FirebaseConfig";
import * as Yup from "yup";

// Default values for the form
const defaultValues = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  signup_method: "",
  agreeAllLegal: false,
  agreeRules: false,
  agreeAge: false,
};

const SocialSignUP = ({ onSocial, closeSocial }) => {
  const location = useLocation();

  // Load stored values from localStorage, agar available ho, aur merge with defaults
  const storedValues = (() => {
    const value = localStorage.getItem("UIDNotFound");
    if (value && value !== "undefined") {
      try {
        const parsed = JSON.parse(value);
        return { ...defaultValues, ...parsed };
      } catch (err) {
        return null;
      }
    }
    return null;
  })();

  // Use merged values, ya agar stored values na ho to default values use karein
  const initialValues = storedValues || defaultValues;

  useEffect(() => {
    if (location?.state?.popupOpen === false) {
      onSocial(false);
    } else if (location?.state?.popupOpen === true) {
      onSocial(true);
    }
  }, [location, onSocial]);

  // Agar storedValues null ho, ensure localStorage is cleared
  if (!storedValues) {
    localStorage.removeItem("UIDNotFound");
  }

  // Yup validation schema
  const validateFields = Yup.object().shape({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    agreeAllLegal: Yup.boolean().oneOf([true], "You must agree to continue"),
    agreeRules: Yup.boolean().oneOf([true], "You must agree to continue"),
    agreeAge: Yup.boolean().oneOf([true], "You must agree to continue"),
  });

  // LocalStorage update helper function
  const updateLocalStorage = (values) => {
    // Merge current values with defaults to ensure missing keys get default values
    const mergedValues = { ...defaultValues, ...values };
    localStorage.setItem("UIDNotFound", JSON.stringify(mergedValues));
  };

  // Field change handler that updates both Formik state and localStorage
  const handleFieldChange = (field, value, setFieldValue, values) => {
    setFieldValue(field, value);
    const updatedValues = { ...values, [field]: value };
    updateLocalStorage(updatedValues);
  };

  // Numeric-only input handler for phone number
  const handleNumericInput = (e, setFieldValue, values) => {
    const numericValue = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFieldValue("phone", numericValue);
    const updatedValues = { ...values, phone: numericValue };
    updateLocalStorage(updatedValues);
  };

  // API call for social signup
  const handleSocialSignup = async (values) => {
    console.log("vas", values);
    const formattedPhone = values.phone.startsWith("+91")
      ? values.phone
      : `+91${values.phone}`;
    try {
      const response = await axios.post("app/auth/social-login", {
        ...values,
        phone: formattedPhone,
        signup_method: values.signup_method,
        device_type: "website",
        device_token: localStorage.getItem("device_token"),
      });

      if (response.data && response.data.data) {
        const token = response.data.data.token;
        localStorage.setItem("Web-token", token);

        Swal.fire({
          title: response.data.message,
          allowOutsideClick: false,
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
          localStorage.removeItem("UIDNotFound");
          window.location.reload();
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Social Signup Failed",
        text:
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          "An error occurred. Please try again.",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
      console.error(error);
    }
  };

  // Social login handlers
  const handleGoogleSignup = (setFieldValue, values) => {
    handleFieldChange("signup_method", "google", setFieldValue, values);
    signInWithGoogle(setFieldValue);
  };

  const handleFacebookSignup = (setFieldValue, values) => {
    handleFieldChange("signup_method", "facebook", setFieldValue, values);
    signInWithFacebook(setFieldValue);
  };

  const handleTwitterSignup = (setFieldValue, values) => {
    handleFieldChange("signup_method", "twitter", setFieldValue, values);
    signWithTwitter(setFieldValue);
  };

  const legalLinks = {
    links: ["Terms & Conditions", "Privacy Policy", "Cookie Policy"],
    paths: ["/terms", "/privacy", "/cookies"],
  };

  return (
    <div
      className={`signinpopup_main ${onSocial ? "show" : ""}`}
      id="signup_popup"
      style={{ display: onSocial ? "block" : "none" }}
    >
      <div className="popup_mianSingindiv mainpopupfrsignupdiv_new">
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
                          className="crossbtn_signinpopupclose singupcrossbtn"
                          onClick={() => {
                            closeSocial();
                            localStorage.removeItem("UIDNotFound");
                          }}
                        >
                          <img
                            src={`${process.env.PUBLIC_URL}/images/cross_icon.png`}
                            alt="Close"
                          />
                        </button>
                      </div>
                      <h2>Social Sign Up</h2>
                      <Formik
                        initialValues={initialValues}
                        validationSchema={validateFields}
                        onSubmit={handleSocialSignup}
                        validateOnMount
                      >
                        {({
                          errors,
                          touched,
                          isSubmitting,
                          setFieldValue,
                          values,
                        }) => (
                          <Form className="formstart">
                            <div className="form-control frmctrldiv">
                              <Field
                                type="text"
                                name="first_name"
                                placeholder="First Name"
                                onChange={(e) =>
                                  handleFieldChange(
                                    "first_name",
                                    e.target.value,
                                    setFieldValue,
                                    values
                                  )
                                }
                              />
                              <ErrorMessage
                                name="first_name"
                                component="div"
                                className="error-message"
                              />
                            </div>

                            <div className="form-control frmctrldiv">
                              <Field
                                type="text"
                                name="last_name"
                                placeholder="Last Name"
                                onChange={(e) =>
                                  handleFieldChange(
                                    "last_name",
                                    e.target.value,
                                    setFieldValue,
                                    values
                                  )
                                }
                              />
                              <ErrorMessage
                                name="last_name"
                                component="div"
                                className="error-message"
                              />
                            </div>

                            <div className="form-control frmctrldiv">
                              <Field
                                type="email"
                                name="email"
                                placeholder="Email"
                                disabled
                              />
                              <ErrorMessage
                                name="email"
                                component="div"
                                className="error-message"
                              />
                            </div>

                            <div className="form-control frmctrldiv">
                              <Field
                                type="text"
                                name="phone"
                                placeholder="Mobile number"
                                onChange={(e) =>
                                  handleNumericInput(e, setFieldValue, values)
                                }
                              />
                              <ErrorMessage
                                name="phone"
                                component="div"
                                className="error-message"
                              />
                            </div>

                            {/* Checkbox for Legal */}
                            <div className="remeberrecoverydiv mb-0">
                              <div className="rememebrmediv">
                                <Field
                                  type="checkbox"
                                  name="agreeAllLegal"
                                  className="checkboxemeber"
                                  onChange={(e) =>
                                    handleFieldChange(
                                      "agreeAllLegal",
                                      e.target.checked,
                                      setFieldValue,
                                      values
                                    )
                                  }
                                />
                                <label
                                  htmlFor="agreeAllLegal"
                                  className="labelrememebrme"
                                >
                                  I have read &amp; agree with{" "}
                                  <span>
                                    {legalLinks.links.map((link, index) => (
                                      <React.Fragment key={index}>
                                        <Link
                                          to={legalLinks.paths[index]}
                                          state={{ popupOpen: false }}
                                        >
                                          {link}
                                        </Link>
                                        {index < legalLinks.links.length - 1
                                          ? ", "
                                          : ""}
                                      </React.Fragment>
                                    ))}
                                  </span>
                                </label>
                              </div>
                            </div>
                            <ErrorMessage
                              name="agreeAllLegal"
                              component="div"
                              className="error-message"
                            />

                            {/* Checkbox for Rules */}
                            <div className="remeberrecoverydiv mv-0">
                              <div className="rememebrmediv">
                                <Field
                                  type="checkbox"
                                  name="agreeRules"
                                  className="checkboxemeber"
                                  onChange={(e) =>
                                    handleFieldChange(
                                      "agreeRules",
                                      e.target.checked,
                                      setFieldValue,
                                      values
                                    )
                                  }
                                />
                                <label className="labelrememebrme">
                                  I have read & agree with{" "}
                                  <Link
                                    to="/rules"
                                    state={{ popupOpen: false }}
                                  >
                                    Rules of Play & FAQ's
                                  </Link>
                                </label>
                              </div>
                            </div>
                            <ErrorMessage
                              name="agreeRules"
                              component="div"
                              className="error-message"
                            />

                            {/* Checkbox for Age */}
                            <div className="remeberrecoverydiv mb-0">
                              <div className="rememebrmediv">
                                <Field
                                  type="checkbox"
                                  name="agreeAge"
                                  className="checkboxemeber"
                                  onChange={(e) =>
                                    handleFieldChange(
                                      "agreeAge",
                                      e.target.checked,
                                      setFieldValue,
                                      values
                                    )
                                  }
                                />
                                <label className="labelrememebrme">
                                  I hereby confirm and acknowledge that I am not
                                  a minor, and that I am at least 18 years old
                                  as of today’s date.
                                </label>
                              </div>
                            </div>
                            <ErrorMessage
                              name="agreeAge"
                              component="div"
                              className="error-message"
                            />

                            <div className="form-control loginformctrl">
                              <button
                                type="submit"
                                className="loginbtn"
                                disabled={isSubmitting}
                              >
                                Sign Up
                              </button>
                            </div>

                            <div className="signupwithsocial_div signup_page_socialdiv">
                              <div className="signupsociallinks">
                                <ul>
                                  <li>
                                    <a
                                      onClick={() =>
                                        handleGoogleSignup(
                                          setFieldValue,
                                          values
                                        )
                                      }
                                      style={{ cursor: "pointer" }}
                                    >
                                      <img
                                        src={`${process.env.PUBLIC_URL}/images/google_icon.png`}
                                        alt="Google"
                                      />
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      onClick={() =>
                                        handleFacebookSignup(
                                          setFieldValue,
                                          values
                                        )
                                      }
                                      style={{ cursor: "pointer" }}
                                    >
                                      <img
                                        src={`${process.env.PUBLIC_URL}/images/facebook_icon.png`}
                                        alt="Facebook"
                                      />
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      onClick={() =>
                                        handleTwitterSignup(
                                          setFieldValue,
                                          values
                                        )
                                      }
                                      style={{ cursor: "pointer" }}
                                    >
                                      <img
                                        src={`${process.env.PUBLIC_URL}/images/Twitter_x_icon.png`}
                                        alt="Twitter"
                                      />
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialSignUP;
