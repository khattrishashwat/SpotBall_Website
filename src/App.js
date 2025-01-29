import React, { useState, lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
// import { LanguageProvider } from "./LanguageContext";

import "./App.css";
import axios from "axios";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";

// Import components

import Contact from "./Components/Pages/Contact Us/Contact";
import Press from "./Components/Pages/In The Press/Press";
import Are from "./Components/Pages/Who we are/Are";
import Circle from "./Components/Pages/The Winners Circle/Circle";
import Weekly from "./Components/Pages/Live Weekly Winner/Weekly";
// import Legal from "./Components/Pages/Legal Terms/Legal";
import Cookies from "./Components/Pages/Legal Terms/Cookies";
import Privacy from "./Components/Pages/Legal Terms/Privacy";
import Rules from "./Components/Pages/Legal Terms/Rules";
import Tearms from "./Components/Pages/Legal Terms/Tearms";
import Profile from "./Components/My Account/Profile";
import Checkout from "./Components/Pages/Play/Checkout";
import Screen from "./Components/Pages/Play/Screen";
import PageNot from "./Components/PageNot/PageNot";
import PlayVedio from "./Components/Pages/HowToPlay/PalyVedio";
import Signup from "./Components/Auth/Signup";
import Delete from "./Components/Pages/Delete/Delete";
import PressDetails from "./Components/Pages/In The Press/PressDetails";

// Lazy load components
const Loader = lazy(() => import("./Components/Loader/Loader"));
const Home = lazy(() => import("./Components/Home/Home"));
const Know = lazy(() => import("./Components/Home/Know"));
const Header = lazy(() => import("./Components/Layout/Header/Header"));
const Footer = lazy(() => import("./Components/Layout/Footer/Footer"));

// const protocol = window.location.protocol === "https:" ? "https" : "http";
// axios.defaults.baseURL = `${protocol}//44.195.125.80:10077/spotsball/api/`;

// axios.defaults.baseURL = "http://localhost:10077/api/";
// axios.defaults.baseURL = "http://44.195.125.80:10077/spotsball/api/";
// axios.defaults.baseURL = "https://webmobrildemo.com/spotsball/api/v1/";
axios.defaults.baseURL = "https://www.spotsball.com/spotsball/api/v1/";

const ProtectedRoute = () => {
  // if (!localStorage.getItem("token")) {
  //   return <Navigate to="/" />;
  // }
  // return <Outlet />;

  const isAuthenticated = localStorage.getItem("Web-token");

  if (!isAuthenticated) {
    // Show Swal alert
    Swal.fire({
      title: "Access Denied",
      text: "Please login first to access this page.",
      icon: "warning",
      confirmButtonText: "OK",
    }).then(() => {
      return <Navigate to="/" />;
    });

    return <Navigate to="/" />;
  }

  return <Outlet />;
};

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("Web-token");
      Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: error.response ? error.response.data.message : error.message,
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload();
      });
    }
    return Promise.reject(error);
  }
);

const App = () => {
  const [loader, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleStop = () => setLoading(false);

    // Start loading when a new route is loading
    window.addEventListener("beforeunload", handleStart);
    window.addEventListener("load", handleStop);

    return () => {
      window.removeEventListener("beforeunload", handleStart);
      window.removeEventListener("load", handleStop);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>{loader ? "loader....." : "SpotsBall"}</title>
      </Helmet>
      <Router basename="/spotsball/web">
        {" "}
        {/* <LanguageProvider> */}
        <Suspense fallback={<Loader />}>
          <Header />
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/my_account" element={<Profile />} />
              <Route path="/play_screen" element={<Screen />} />
              <Route path="/cart" element={<Checkout />} />
            </Route>
            <Route path="/" element={<Home />} />
            <Route path="/contact_us" element={<Contact />} />
            <Route path="/playss" element={<PlayVedio />} />
            <Route path="/in_the_press" element={<Press />} />
            <Route
              path="/press-details/:id/:title"
              element={<PressDetails />}
            />
            {/* <Route path="/login" element={<Login />} />
            <Route path="/sign" element={<Signup />} /> */}
            <Route path="/load" element={<Loader />} />
            {/* <Route path="/legal_terms" element={<Legal />} /> */}
            <Route path="/who_we_are" element={<Are />} />
            <Route path="/the_winners_circle" element={<Circle />} />
            <Route path="/live_weekly_winner" element={<Weekly />} />
            <Route path="/terms" element={<Tearms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/knows" element={<Know />} />
            <Route path="/my_account_delete" element={<Delete />} />

            {/* Catch-all for 404 */}
            <Route path="*" element={<PageNot />} />
          </Routes>
          <Footer />
        </Suspense>
        {/* </LanguageProvider> */}
      </Router>
    </>
  );
};

export default App;
