import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));

const checkVersion = async () => {
  try {
    // Fetch the meta.json file
    const response = await fetch("/meta.json");
    const meta = await response.json();

    // Get the stored version from localStorage
    const currentVersion = localStorage.getItem("app_version");

    // If the version has changed, reload the page
    if (currentVersion && currentVersion !== meta.version) {
      localStorage.setItem("app_version", meta.version); // Update stored version
      window.location.reload(true); // Force refresh the page
    } else {
      localStorage.setItem("app_version", meta.version); // Store version if it's the same
    }
  } catch (error) {
    console.error("Version check failed:", error);
  }
};

// Check the version before rendering the app
checkVersion().then(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});

reportWebVitals();
