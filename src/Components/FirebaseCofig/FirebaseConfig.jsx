import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  OAuthProvider,
} from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import Swal from "sweetalert2"; // Assuming Swal is already installed
import axios from "axios";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWNOtn_zO3ekheuPOBlw7EsieLjYtEguw",
  authDomain: "spotsball-b7d59.firebaseapp.com",
  projectId: "spotsball-b7d59",
  storageBucket: "spotsball-b7d59.appspot.com",
  messagingSenderId: "867478972439",
  appId: "1:867478972439:web:0e4e7d044dfb71b5021452",
  measurementId: "G-02P8264H1C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();
const appleProvider = new OAuthProvider("apple.com");

// Initialize Firebase Messaging
const messaging = getMessaging(app);

function detectIncognitoMode() {
  return new Promise((resolve) => {
    const fs = window.RequestFileSystem || window.webkitRequestFileSystem;
    if (!fs) {
      resolve(false); // Browser does not support this API
    } else {
      fs(
        window.TEMPORARY,
        100,
        () => resolve(false),
        () => resolve(true)
      );
    }
  });
}

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .register("/firebase-messaging-sw.js", {
//       scope: "/spotsball/web/",
//     })
//     .then((registration) => {
//       console.log("Service Worker registered:", registration);

//       getToken(messaging, {
//         vapidKey:
//           "BC1L5qE6WKJSgEU46nuptM9bCKtljihEjAikiBrpzRIomSiw6Dd9Wq6jmM4CfIHJokkhmqblgU5qbVaqizNlmeo",
//       })
//         .then((currentToken) => {
//           if (currentToken) {
//             console.log("Current token:", currentToken);
//             localStorage.setItem("device_token", currentToken);
//           } else {
//             console.log(
//               "No registration token available. Request permission to generate one."
//             );
//           }
//         })
//         .catch((err) => {
//           console.error("Error getting token:", err);
//         });

//       onMessage(messaging, (payload) => {
//         // console.log("Message received:", payload);
//         Swal.fire({
//           title: "New Message!",
//           text: payload.notification.body,
//           icon: "info",
//           confirmButtonText: "OK",
//         });
//       });
//     })
//     .catch((error) => {
//       console.error("Service Worker registration failed:", error);
//     });
// }
// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .register("/firebase-messaging-sw.js")
//     .then((registration) => {
//       console.log("Service Worker registered:", registration);

//       // Request notification permission
//       Notification.requestPermission().then((permission) => {
//         if (permission === "granted") {
//           console.log("Notification permission granted.");

//           // Retrieve the current token
//           getToken(messaging, {
//             vapidKey:
//               "BC1L5qE6WKJSgEU46nuptM9bCKtljihEjAikiBrpzRIomSiw6Dd9Wq6jmM4CfIHJokkhmqblgU5qbVaqizNlmeo",
//           })
//             .then((currentToken) => {
//               if (currentToken) {
//                 console.log("Current token:", currentToken);
//                 localStorage.setItem("device_token", currentToken);
//               } else {
//                 console.log(
//                   "No registration token available. Request permission to generate one."
//                 );
//               }
//             })
//             .catch((err) => {
//               console.error("Error getting token:", err);
//             });

//           // Handle incoming messages
//           onMessage(messaging, (payload) => {
//             console.log("Message received:", payload);
//             Swal.fire({
//               title: payload.notification?.title || "New Message!",
//               text:
//                 payload.notification?.body || "You have a new notification.",
//               icon: "info",
//               confirmButtonText: "OK",
//             });
//           });
//         } else {
//           console.log("Notification permission denied.");
//         }
//       });
//     })
//     .catch((error) => {
//       console.error("Service Worker registration failed:", error);
//     });
// }

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered:", registration);

      // Pass the registration to getToken:
      getToken(messaging, {
        serviceWorkerRegistration: registration,
        vapidKey:
          "BC1L5qE6WKJSgEU46nuptM9bCKtljihEjAikiBrpzRIomSiw6Dd9Wq6jmM4CfIHJokkhmqblgU5qbVaqizNlmeo",
      })
        .then((currentToken) => {
          if (currentToken) {
            console.log("Current token:", currentToken);
            localStorage.setItem("device_token", currentToken);
          } else {
            // console.log(
            //   "No registration token available. Request permission to generate one."
            // );
          }
        })
        .catch((err) => {
          console.error("Error getting token:", err);
          localStorage.setItem("device_token", "currentToken");

        });

      onMessage(messaging, (payload) => {
        console.log("Message received:", payload);
        Swal.fire({
          title: "New Message!",
          text: payload.notification.body,
          icon: "info",
          confirmButtonText: "OK",
        });
      });
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}
// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .register("/spotsball/web/firebase-messaging-sw.js", {
//       scope: "/spotsball/web/",
//     })
//     .then((registration) => {
//       console.log("Service Worker registered:", registration);

//       // Pass the registration to getToken:
//       getToken(messaging, {
//         serviceWorkerRegistration: registration,
//         vapidKey:
//           "BC1L5qE6WKJSgEU46nuptM9bCKtljihEjAikiBrpzRIomSiw6Dd9Wq6jmM4CfIHJokkhmqblgU5qbVaqizNlmeo",
//       })
//         .then((currentToken) => {
//           if (currentToken) {
//             console.log("Current token:", currentToken);
//             localStorage.setItem("device_token", currentToken);
//           } else {
//             console.log(
//               "No registration token available. Request permission to generate one."
//             );
//           }
//         })
//         .catch((err) => {
//           console.error("Error getting token:", err);
//           localStorage.setItem("device_token", "currentToken");

//           // Check if it's a permission blocked error
//         });

//       onMessage(messaging, (payload) => {
//         console.log("Message received:", payload);
//         Swal.fire({
//           title: "New Message!",
//           text: payload.notification.body,
//           icon: "info",
//           confirmButtonText: "OK",
//         });
//       });
//     })
//     .catch((error) => {
//       console.error("Service Worker registration failed:", error);
//     });
// }
let userDetails;

{
  /*---------------------------------*/
}

export const signInWithGoogle = async (setFieldValue) => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (!user) throw new Error("Google sign-in failed. No user data found.");

    const { uid, displayName, email, photoURL } = user;
    //   console.log("User info:", user);

    const nameParts = displayName ? displayName.split(" ") : [];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Set form field values
    setFieldValue("first_name", firstName);
    setFieldValue("last_name", lastName);
    setFieldValue("email", email || "");
    setFieldValue("uid", uid || "");
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    Swal.fire({
      icon: "error",
      title: "Sign-in Failed",
      text: error.message,
    });
  }
};

/**
 * Handles Google Sign-In and manages the login/signup flow.
 */
// export const LoginWithGoogle = async () => {
//   try {
//     const result = await signInWithPopup(auth, provider);
//     const user = result.user;

//     if (!user) throw new Error("Google sign-in failed. No user data found.");

//     const { uid, displayName, email, photoURL } = user;
//     // console.log("User data:", user);

//     const nameParts = displayName ? displayName.split(" ") : [];
//     const firstName = nameParts[0] || "";
//     const lastName = nameParts.slice(1).join(" ") || "";

//     const userData = {
//       uid,
//       displayName,
//       email,
//       photoURL,
//       signup_method: "google",
//       first_name: firstName,
//       last_name: lastName,
//     };
//     userDetails = { ...userData };
//     //  console.log("Google Sign-In successful. User UID:", uid);

//     // Check if UID exists in the backend
//     const checkUIDResponse = await axios.get(
//       `app/auth/check-uid-exists/${uid}`
//     );

//     if (checkUIDResponse.data.message === "Uid found") {
//       // Perform social login
//       const response = await axios.post("app/auth/social-login", {
//         signup_method: "google",
//         uid,
//         device_type: "website",
//         device_token: localStorage.getItem("device_token"),
//       });

//       //     console.log("Signup response:", response.data);

//       const token = response.data.data.token;
//       localStorage.setItem("Web-token", token);

//       Swal.fire({
//         icon: "success",
//         title: "Login Successful",
//         showConfirmButton: false,
//         timer: 2000,
//       });

//       // window.location.reload(); // Reload or navigate as needed
//     } else(checkUIDResponse.data.message === "Uid Not Found") {
//       throw new Error("UID not found in the system.");
//     }
//   } catch (error) {
//     console.error("Error during Google sign-in or API request:", error);

//     //console.log("User details for UID not found:", userDetails);
//     // localStorage.setItem("UIDNotFound", JSON.stringify(userDetails));

//     // window.location.reload();
//   }
// };
export const LoginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("us", user);

    if (!user) throw new Error("Google sign-in failed. No user data found.");

    const { uid, displayName, email, photoURL } = user;
    console.log("userd", user);

    const nameParts = displayName ? displayName.split(" ") : [];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const userData = {
      uid,
      displayName,
      email,
      photoURL,
      signup_method: "google",
      first_name: firstName,
      last_name: lastName,
    };
    console.log("userdata", userData);

    try {
      // Check if UID exists in the backend
      const checkUIDResponse = await axios.get(
        `app/auth/check-uid-exists/${uid}`
      );

      if (checkUIDResponse.data.message === "Uid found") {
        // Perform social login
        const response = await axios.post("app/auth/social-login", {
          signup_method: "google",
          uid,
          device_type: "website",
          device_token: localStorage.getItem("device_token"),
        });

        const token = response.data.data.token;
        localStorage.setItem("Web-token", token);

        Swal.fire({
          icon: "success",
          title: "Login Successful",
          showConfirmButton: false,
          timer: 2000,
        });

        // Reload or navigate as needed
        // window.location.reload();
      }
    } catch (error) {
      // If UID Not Found error occurs, store user details in localStorage
      if (error.response && error.response.data.message === "Uid Not Found") {
        localStorage.setItem("UIDNotFound", JSON.stringify(userData));
        window.location.reload();
      } else {
        // Handle other API errors
        console.error("API Error:", error);
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text:
            error.response?.data?.message || "An unexpected error occurred.",
        });
      }
    }
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: error.message,
    });
  }
};

{
  /*------FACEBOOK----------*/
}

export const signInWithFacebook = async (setFieldValue) => {
  try {
    facebookProvider.addScope("email");

    const result = await signInWithPopup(auth, facebookProvider);
    const user = result.user;
    console.log("Sign-in successful:", user);

    const { uid, displayName, email } = user;

    const nameParts = displayName ? displayName.split(" ") : [];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Set form field values
    setFieldValue("first_name", firstName);
    setFieldValue("last_name", lastName);
    setFieldValue("email", email || "");
    setFieldValue("uid", uid || "");
  } catch (error) {
    console.error("Error during Facebook sign-in:", error);

    const errorMessages = {
      "auth/account-exists-with-different-credential":
        "This email is already linked to another account. Please sign in with the linked provider.",
      "auth/invalid-credential":
        "Invalid credentials. Check your Facebook API configuration.",
      "auth/popup-closed-by-user":
        "Error while Login perform! Please try again.",
      "auth/cancelled-popup-request": "The popup request was canceled.",
    };

    Swal.fire({
      icon: "error",
      text:
        errorMessages[error.code] ||
        "An unexpected error occurred. Please try again.",
    });
  }
};

// export const LoginWithFacebook = async () => {
//   try {
//     facebookProvider.addScope("email");

//     const result = await signInWithPopup(auth, facebookProvider);
//     const user = result.user;
//     console.log("Facebook login data:", user);

//     const { uid, displayName, email, photoURL } = user;

//     const nameParts = displayName ? displayName.split(" ") : [];
//     const firstName = nameParts[0] || "";
//     const lastName = nameParts.slice(1).join(" ") || "";

//     const userDetails = {
//       uid,
//       first_name: firstName,
//       last_name: lastName,
//       email,
//       photoURL,
//       signup_method: "facebook",
//     };

//     // Store user details in local storage before API calls
//     localStorage.setItem("UIDNotFound", JSON.stringify(userDetails));

//     // Check UID in database
//     const checkUIDResponse = await axios.get(
//       `app/auth/check-uid-exists/${uid}`
//     );

//     if (checkUIDResponse.data.message === "Uid found") {
//       // Proceed with social login
//       const response = await axios.post("app/auth/social-login", {
//         signup_method: "facebook",
//         uid,
//         device_type: "website",
//         device_token: localStorage.getItem("device_token"),
//       });

//       const token = response.data.data.token;

//       // Save token and show success message
//       localStorage.setItem("Web-token", token);
//       Swal.fire({
//         icon: "success",
//         title: "Login Successful",
//         showConfirmButton: false,
//         timer: 2000,
//       });

//       setTimeout(() => {
//         window.location.reload();
//       }, 2000);
//     } else {
//       // UID not found, prompt user to sign up
//       Swal.fire({
//         icon: "error",
//         text: "User not found. Please sign up first.",
//       });
//     }
//   } catch (error) {
//     console.error("Facebook Sign-In or API request failed:", error);

//     const errorMessages = {
//       "auth/account-exists-with-different-credential":
//         "This email is already linked to another account. Please sign in with the linked provider.",
//       "auth/invalid-credential":
//         "Invalid credentials. Check your Facebook API configuration.",
//       "auth/popup-closed-by-user":
//         "Error while Login perform! Please try again.",
//       "auth/cancelled-popup-request": "The popup request was canceled.",
//     };

//     Swal.fire({
//       icon: "error",
//       text:
//         errorMessages[error.code] ,
//     });
//   }
// };

// export const LoginWithFacebook = async () => {
//   try {
//     facebookProvider.addScope("email");
//     const result = await signInWithPopup(auth, facebookProvider);
//     const user = result.user;

//     console.log("Facebook login data:", user);

//     const { uid, displayName, email, photoURL } = user;
//     const nameParts = displayName ? displayName.split(" ") : [];
//     const firstName = nameParts[0] || "";
//     const lastName = nameParts.slice(1).join(" ") || "";

//     const userData = {
//       uid,
//       displayName,
//       email,
//       photoURL,
//       signup_method: "facebook",
//       first_name: firstName,
//       last_name: lastName,
//     };

//     userDetails = { ...userData };

//     console.log("User Details to Store:", userDetails);

//     // Check UID in database
//     // Check if UID exists in the backend
//     const checkUIDResponse = await axios.get(
//       `app/auth/check-uid-exists/${uid}`
//     );

//     if (checkUIDResponse.data.message === "Uid found") {
//       // Perform social login
//       const response = await axios.post("app/auth/social-login", {
//         signup_method: "facebook",
//         uid,
//         device_type: "website",
//         device_token: localStorage.getItem("device_token"),
//       });

//       //     console.log("Signup response:", response.data);

//       const token = response.data.data.token;
//       localStorage.setItem("Web-token", token);

//       Swal.fire({
//         icon: "success",
//         title: "Login Successful",
//         showConfirmButton: false,
//         timer: 2000,
//       });

//       // window.location.reload(); // Reload or navigate as needed
//     } else {
//       throw new Error("UID not found in the system.");
//     }
//   } catch (error) {
//     console.error("Error during Google sign-in or API request:", error);

//     //console.log("User details for UID not found:", userDetails);
//     // localStorage.setItem("UIDNotFound", JSON.stringify(userDetails));

//     // window.location.reload();
//   }
// };

export const LoginWithFacebook = async () => {
  try {
    facebookProvider.addScope("email");
    const result = await signInWithPopup(auth, facebookProvider);
    const user = result.user;

    if (!user) throw new Error("Facebook sign-in failed. No user data found.");

    const { uid, displayName, email, photoURL } = user;
    const nameParts = displayName ? displayName.split(" ") : [];
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const userData = {
      uid,
      displayName,
      email,
      photoURL,
      signup_method: "facebook",
      first_name: firstName,
      last_name: lastName,
    };

    console.log("User Details to Store:", userData);

    try {
      // Check UID in database
      const checkUIDResponse = await axios.get(
        `app/auth/check-uid-exists/${uid}`
      );

      if (checkUIDResponse.data.message === "Uid found") {
        // Perform social login
        const response = await axios.post("app/auth/social-login", {
          signup_method: "facebook",
          uid,
          device_type: "website",
          device_token: localStorage.getItem("device_token"),
        });

        const token = response.data.data.token;
        localStorage.setItem("Web-token", token);

        Swal.fire({
          icon: "success",
          title: "Login Successful",
          showConfirmButton: false,
          timer: 2000,
        });

        // Reload or navigate as needed
        // window.location.reload();
      }
    } catch (error) {
      if (error.response && error.response.data.message === "Uid Not Found") {
        // Store user details in localStorage for further processing
        localStorage.setItem("UIDNotFound", JSON.stringify(userData));
        window.location.reload();
      } else {
        console.error("API Error:", error);
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: error.response?.data?.message,
        });
      }
    }
  } catch (error) {
    console.error("Facebook Sign-In Error:", error);
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: error.message,
    });
  }
};

{
  /*------Twitter--------*/
}

export const signWithTwitter = async (setFieldValue) => {
  try {
    // Configure Twitter provider
    twitterProvider.setCustomParameters({ include_email: "true" });

    // Sign in with Twitter
    const result = await signInWithPopup(auth, twitterProvider);
    const user = result.user;

    const userData = {
      uid: user?.uid || "",
      name: user?.displayName || "",
      email: user?.email || "",
    };

    // console.log("Twitter Login Result:", result);
    // console.log("Processed User Data:", userData);

    // Update Formik fields
    setFieldValue("first_name", userData.name);
    setFieldValue("email", userData.email || "");
    setFieldValue("uid", userData.uid);

    if (!userData.email) {
      Swal.fire({
        icon: "warning",
        text: "Twitter did not provide an email address. Please ensure you allow email sharing in your Twitter app settings.",
      });
    }
  } catch (error) {
    console.error("Error signing in with Twitter:", error);

    const errorMessages = {
      "auth/account-exists-with-different-credential":
        "This email is already linked to another account. Please sign in with the linked provider.",
      "auth/invalid-credential":
        "Invalid credentials. Check your Twitter API configuration.",
      "auth/popup-closed-by-user":
        "Error while Login perform! Please try again",
      "auth/cancelled-popup-request": "The popup request was canceled.",
    };

    Swal.fire({
      icon: "error",
      text: errorMessages[error.code],
    });
  }
};

export const LoginWithTwitter = async () => {
  try {
    // Open Twitter login popup
    const result = await signInWithPopup(auth, twitterProvider);
    const user = result.user;
    const credential = TwitterAuthProvider.credentialFromResult(result);
    console.log("credential", credential);
    console.log("user", user);

    const oauthAccessToken = credential?.accessToken;
    const oauthTokenSecret = credential?.secret;

    const userData = {
      uid: user?.uid || "",
      displayName: user?.displayName || "",
      email: user?.email || "",
      photoURL: user?.photoURL || "",
      signup_method: "twitter",
    };
    console.log("userData", userData);
    const nameParts = userData.displayName.split(" ");
    const first_name = nameParts[0] || "";
    const last_name = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    const userDetails = {
      ...userData,
      first_name,
      last_name,
    };

    // console.log("Twitter User Details:", userDetails);

    // Check UID in the database
    const checkUIDResponse = await axios.get(
      `app/auth/check-uid-exists/${user.uid}`
    );

    if (checkUIDResponse.data.message === "Uid found") {
      // Proceed with social login
      const response = await axios.post("app/auth/social-login", {
        signup_method: "twitter",
        uid: user.uid,
        device_type: "website",
        device_token: localStorage.getItem("device_token"),
      });

      //  console.log("Login Response:", response.data);

      // Store token and redirect
      localStorage.setItem("Web-token", response.data.data.token);
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        showConfirmButton: false,
        timer: 2000,
      });
      // window.location.reload();
    } else if (checkUIDResponse.data.message === "Uid Not Found") {
      // Inform user to sign up
      Swal.fire({
        icon: "error",
        text: "Try again Later with  social login",
      });
      // window.location.reload();
    }
  } catch (error) {
    console.error("Twitter Login Error:", error);

    const errorMessages = {
      "auth/account-exists-with-different-credential":
        "This account is linked with another provider. Please use the linked provider to log in.",
      "auth/popup-closed-by-user":
        "You closed the login popup. Please try again.",
      "auth/cancelled-popup-request":
        "Another login request was made. Please try again.",
    };

    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: errorMessages[error.code],
    });

    localStorage.setItem("UIDNotFound", JSON.stringify(userDetails));
    // window.location.reload();
  }
};

{
  /*-----Apple----*/
}

export const signInWithApple = async (setFieldValue) => {
  try {
    const result = await signInWithPopup(auth, appleProvider);
    const user = result.user;

    //("User info from Apple:", user);
    const userData = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    };

    const nameParts = userData.displayName
      ? userData.displayName.split(" ")
      : [];

    setFieldValue("first_name", nameParts[0] || "");
    setFieldValue("last_name", nameParts.slice(1).join(" ") || "");
    setFieldValue("email", userData.email || "");
    setFieldValue("uid", userData.uid || "");
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Sign-in failed",
      text: error.message,
    });
    console.error("Error during Apple sign-in:", error);
  }
};

export const LoginWithApple = async () => {
  try {
    const result = await signInWithPopup(auth, appleProvider);
    const user = result.user;

    // console.log("Apple Sign-In successful. User UID:", user.uid);

    const checkUIDResponse = await axios.get(
      `app/auth/check-uid-exists/${user.uid}`
    );

    if (checkUIDResponse.data.message === "Uid found") {
      const response = await axios.post("app/auth/social-login", {
        signup_method: "apple",
        uid: user.uid,
        device_type: "website",
        device_token: localStorage.getItem("device_token"),
      });

      //    console.log("Apple response:", response.data);

      const token = response.data.data.token;
      localStorage.setItem("token", token);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        showConfirmButton: false,
        timer: 2000,
      });

      window.location.reload();
    } else if (checkUIDResponse.data.message === "Uid Not Found") {
      Swal.fire({
        icon: "error",
        text: "Go to SignUp, then try social login",
      });

      window.location.reload();
    }
  } catch (error) {
    console.error("Apple Sign-In or API request failed:", error);

    const errorMessages = {
      "auth/account-exists-with-different-credential":
        "This account is linked with another provider. Please use the linked provider to log in.",
      "auth/popup-closed-by-user":
        "You closed the login popup. Please try again.",
      "auth/cancelled-popup-request":
        "Another login request was made. Please try again.",
    };

    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: errorMessages[error.code] || error.message,
    });

    localStorage.setItem("UIDNotFound", JSON.stringify(userDetails));
    window.location.reload();
  }
};

export {
  auth,
  provider,
  facebookProvider,
  twitterProvider,
  messaging,
  appleProvider,
  getToken,
  onMessage,
};
