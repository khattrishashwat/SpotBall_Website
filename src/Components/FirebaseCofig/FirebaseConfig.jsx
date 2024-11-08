import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
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
const twitterprovider = new TwitterAuthProvider();

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
    .register("/firebase-messaging-sw.js", {
      scope: "/spotsball/web/",
    })
    .then((registration) => {
      console.log("Service Worker registered:", registration);

      getToken(messaging, {
        vapidKey:
          "BNkI-Se9LgfgnkAxsoNDTe3uQDR7HBWV6rY-Mhc3A6AioGIl-VnUn49NTAdTZHgBnt6id6KokU02Pku4G0GpYxA",
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

export const signInWithFacebook = async (setFieldValue) => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    const user = result.user;

    const userData = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    };

    console.log("User info:", userData);
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
    console.error("Error during Facebook sign-in:", error);
  }
};

export const signWithTwitter = async (setFieldValue) => {
  try {
    const result = await signInWithPopup(auth, twitterprovider);

    // Extract and log user info
    const user = result.user;
    const userData = {
      uid: user.uid,
      name: user.displayName,
      email: user.email || "", // Twitter sometimes doesn't return email
    };

    console.log("Useds:", user);
    console.log("Uss:", userData);
    // const nameParts = userData.displayName
    //   ? userData.displayName.split(" ")
    //   : [];

    // Set form values with user data
    setFieldValue("first_name", userData.name || "");
    // setFieldValue("last_name", nameParts.slice(1).join(" ") || "");
    setFieldValue("email", userData.email || "");
    setFieldValue("uid", userData.uid || "");
  } catch (error) {
    console.error("Error logging in with Twitter:", error.message);

    // Handle specific error cases
    if (error.code === "auth/invalid-credential") {
      console.error(
        "Invalid credentials. Please ensure your Twitter API keys are correct."
      );
    }
  }
};

//------Login-----

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
    } else if (checkUIDResponse.data.message === "Uid Not Found") {
      Swal.fire({
        icon: "error",
        text: "Go to SignUp, then try social login",
      });

      // Reload the page after error
      window.location.reload();
    }
  } catch (error) {
    console.error("Google Sign-In or API request failed:", error);

    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: error.response ? error.response.data.message : error.message,
    });
  }
};

export const LoginWithTwitter = async () => {
  try {
    // Sign in with Twitter
    const result = await signInWithPopup(auth, twitterprovider);
    const user = result.user;

    console.log("Twitter Sign-In successful. User UID:", user.uid);

    // Check if UID exists in your database
    const checkUIDResponse = await axios.get(
      `check-uid-exists/${user.uid}`,
      {}
    );

    if (checkUIDResponse.data.message === "Uid found") {
      // If UID is found, proceed with social login
      const response = await axios.post("social-login", {
        signup_method: "twitter",
        uid: user.uid,
        device_type: "website",
        device_token: localStorage.getItem("device_token"), // Assumes device_token is stored in localStorage
      });

      console.log("Twitter response:", response.data);

      // Store token in localStorage
      const token = response.data.data.token;
      localStorage.setItem("token", token);

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        showConfirmButton: false,
        timer: 2000,
      });

      // Reload or navigate as needed
      window.location.reload();
    } else if (checkUIDResponse.data.message === "Uid Not Found") {
      Swal.fire({
        icon: "error",
        text: "Go to SignUp, then try social login",
      });

      // Reload the page after error
      window.location.reload();
    }
  } catch (error) {
    console.error("Twitter Sign-In or API request failed:", error);

    // Show error message
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: error.response ? error.response.data.message : error.message,
    });
  }
};

export const LoginWithFacebook = async () => {
  try {
    // Sign in with Facebook
    const result = await signInWithPopup(auth, facebookProvider);
    const user = result.user;

    console.log("Facebook Sign-In successful. User UID:", user.uid);

    // Check if UID exists in your database
    const checkUIDResponse = await axios.get(
      `check-uid-exists/${user.uid}`,
      {}
    );

    if (checkUIDResponse.data.message === "Uid found") {
      // If UID is found, proceed with social login
      const response = await axios.post("social-login", {
        signup_method: "facebook",
        uid: user.uid,
        device_type: "website",
        device_token: localStorage.getItem("device_token"), // Assumes device_token is stored in localStorage
      });

      console.log("FaceBook response:", response.data);

      // Store token in localStorage
      const token = response.data.data.token;
      localStorage.setItem("token", token);

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        showConfirmButton: false,
        timer: 2000,
      });

      // Reload or navigate as needed
      window.location.reload();
    } else if (checkUIDResponse.data.message === "Uid Not Found") {
      Swal.fire({
        icon: "error",
        text: "Go to SignUp, then try social login",
      });

      // Reload the page after error
      window.location.reload();
    }
  } catch (error) {
    console.error("Facebook Sign-In or API request failed:", error);

    // Show error message
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: error.response ? error.response.data.message : error.message,
    });
  }
};

export {
  auth,
  provider,
  facebookProvider,
  twitterprovider,
  messaging,
  getToken,
  onMessage,
};
