import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
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

// Initialize Firebase Messaging
const messaging = getMessaging(app);

// Register Service Worker and request permission for notifications
// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .register("/firebase-messaging-sw.js")
//     .then((registration) => {
//       console.log("Service Worker registered:", registration);

//       // Request permission and get token for push notifications
//       getToken(messaging, {
//         vapidKey:
//           "BNkI-Se9LgfgnkAxsoNDTe3uQDR7HBWV6rY-Mhc3A6AioGIl-VnUn49NTAdTZHgBnt6id6KokU02Pku4G0GpYxA",
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

//       // Handle incoming messages
//       onMessage(messaging, (payload) => {
//         console.log("Message received:", payload);
//         // Display a notification using Swal
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

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered:", registration);

      getToken(messaging, {
        vapidKey: "BNkI-Se9LgfgnkAxsoNDTe3uQDR7HBWV6rY-Mhc3A6AioGIl-VnUn49NTAdTZHgBnt6id6KokU02Pku4G0GpYxA"
,
      })
        .then((currentToken) => {
          if (currentToken) {
            console.log("Current token:", currentToken);
            localStorage.setItem("device_token", currentToken);
          } else {
            console.log(
              "No registration token available. Request permission to generate one."
            );
          }
        })
        .catch((err) => {
          console.error("Error getting token:", err);
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

// Google sign-in function
export const signInWithGoogle = async (setFieldValue) => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log("User info:", user);
    const userData = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    };

    const nameParts = userData.displayName
      ? userData.displayName.split(" ")
      : [];

    // Set form values with user data
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
    console.error("Error during Google sign-in:", error);
    return null; // Return null in case of error
  }
};

export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    const user = result.user;

    // Handle user data
    const userData = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL, // Optional, depending on your API
    };

    console.log("User info:", userData);

    // Optionally, you can display a success message
    Swal.fire({
      icon: "success",
      title: "Signed in successfully!",
      text: `Welcome, ${user.displayName}`,
    });

    // You may want to send userData to your signup popup or handle it as needed
  } catch (error) {
    // Handle Errors here.
    Swal.fire({
      icon: "error",
      title: "Sign-in failed",
      text: error.message,
    });
    console.error("Error during Facebook sign-in:", error);
  }
};

export const LoginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log("Google Sign-In successful. User UID:", user.uid);

    const checkUIDResponse = await axios.get(
      `check-uid-exists/${user.uid}`,
      {}
    );

    if (checkUIDResponse.data.message === "Uid found") {
      const response = await axios.post("social-login", {
        signup_method: "google",
        uid: user.uid,
        device_type: "website",
        device_token: localStorage.getItem("device_token"), // Assumes device_token is stored in localStorage
      });

      console.log("Signup response:", response.data);

      const token = response.data.data.token;
      localStorage.setItem("token", token);

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Login Successful 1",
        showConfirmButton: false,
        timer: 2000,
      });

      // Reload or navigate as needed
      window.location.reload();
    } else {
      Swal.fire({
        icon: "error",
        title: "UID Not Found 2",
        text: "User not found. Please sign up.",
      });
    }
  } catch (error) {
    console.error("Google Sign-In or API request failed:", error);

    Swal.fire({
      icon: "error",
      title: "Login Failed 3",
      text: error.response ? error.response.data.message : error.message,
    });
  }
};

export { auth, provider, facebookProvider, messaging, getToken, onMessage };
