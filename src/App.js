import React, {
  useState,
  useRef,
  lazy,
  Suspense,
  useEffect,
  useCallback,
} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";

// Import components
import PageNot from "./Components/PageNot/PageNot";
import TawkScriptLoader from "./TawkScriptLoader";
import Loader from "./Components/Loader/Loader";
import Socialsignup from "./Components/Authentication/Socialsignup";

// Lazy loaded components
const Home = lazy(() => import("./Components/Home/Home"));
const Contact = lazy(() => import("./Components/Pages/Contact Us/Contact"));
const Press = lazy(() => import("./Components/Pages/In The Press/Press"));
const PressDetails = lazy(() =>
  import("./Components/Pages/In The Press/PressDetails")
);
const Profile = lazy(() => import("./Components/My Account/Profile"));
const Checkout = lazy(() => import("./Components/Pages/Play/Checkout"));
const Screen = lazy(() => import("./Components/Pages/Play/Screen"));
const PlayVedio = lazy(() => import("./Components/Pages/HowToPlay/PalyVedio"));
const Delete = lazy(() => import("./Components/Pages/Delete/Delete"));
const SuccessPage = lazy(() => import("./Components/Pages/Play/SuccessPage"));
const Header = lazy(() => import("./Components/Layout/Header/Header"));
const Footer = lazy(() => import("./Components/Layout/Footer/Footer"));
const Tearms = lazy(() => import("./Components/Pages/Legal Terms/Tearms"));
const Privacy = lazy(() => import("./Components/Pages/Legal Terms/Privacy"));
const Rules = lazy(() => import("./Components/Pages/Legal Terms/Rules"));
const Cookies = lazy(() => import("./Components/Pages/Legal Terms/Cookies"));
const Are = lazy(() => import("./Components/Pages/Who we are/Are"));
const Weekly = lazy(() =>
  import("./Components/Pages/Live Weekly Winner/Weekly")
);
const Circle = lazy(() =>
  import("./Components/Pages/The Winners Circle/Circle")
);

const Login = lazy(() => import("./Components/Authentication/Login"));
const Signup = lazy(() => import("./Components/Authentication/Signup"));
const Forget = lazy(() => import("./Components/Authentication/Forget"));
const OTp = lazy(() => import("./Components/Authentication/OTp"));
const CreateNewPassword = lazy(() =>
  import("./Components/Authentication/CreateNewPassword")
);
const Otps = lazy(() => import("./Components/Authentication/Otps"));
const Tht = lazy(() => import("./Components/Pages/Legal Terms/Tht"));

// Axios base URL
axios.defaults.baseURL = "https://www.spotsball.com/spotsball/api/v1/";
// axios.defaults.baseURL = "https://webmobrildemo.com/spotsball/api/v1/";

// **Protected Route Component**
const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("Web-token");
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => setLoading(false);
    window.addEventListener("load", handleLoad);
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return (
    <>
      <Helmet>
        <title>{loading ? "Loading..." : "SpotsBall"}</title>
      </Helmet>
      <Router basename="/spotsball/landing/">
        <TawkScriptLoader />
        <RoutesWithInterceptors />
      </Router> 
    </>
  );
};

// **Component that includes Routes + Axios Interceptor + Logout Hook**
const RoutesWithInterceptors = () => {
  useAxiosInterceptor();
  useInactivityLogout();

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/my_account"
            element={<WithLayout component={Profile} />}
          />
          <Route
            path="/play_screen"
            element={<WithLayout component={Screen} />}
          />
          <Route path="/cart" element={<WithLayout component={Checkout} />} />
        </Route>

        {/* Public Routes */}
        <Route path="/" element={<WithLayout component={Home} />} />
        {/* <Route path="/home" element={<WithLayout component={Homes} />} /> */}
        <Route
          path="/contact_us"
          element={<WithLayout component={Contact} />}
        />
        <Route path="/terms" element={<WithLayout component={Tearms} />} />
        <Route path="/privacy" element={<WithLayout component={Privacy} />} />
        <Route path="/rules" element={<WithLayout component={Rules} />} />
        <Route path="/cookies" element={<WithLayout component={Cookies} />} />
        <Route path="/tht" element={<WithLayout component={Tht} />} />

        <Route path="/playss" element={<WithLayout component={PlayVedio} />} />
        <Route
          path="/in_the_press"
          element={<WithLayout component={Press} />}
        />
        <Route
          path="/press-details/:id/:title"
          element={<WithLayout component={PressDetails} />}
        />
        <Route
          path="/payments"
          element={<WithLayout component={SuccessPage} />}
        />
        <Route path="/who_we_are" element={<WithLayout component={Are} />} />
        <Route
          path="/live_weekly_winner"
          element={<WithLayout component={Weekly} />}
        />
        <Route
          path="/the_winners_circle"
          element={<WithLayout component={Circle} />}
        />
        <Route
          path="/my_account_delete"
          element={<WithLayout component={Delete} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<Forget />} />
        <Route path="/otp" element={<OTp />} />
        <Route path="/otps" element={<Otps />} />
        <Route path="/createpassword" element={<CreateNewPassword />} />
        <Route path="/socialsignup" element={<Socialsignup />} />
        <Route path="*" element={<PageNot />} />
      </Routes>
    </Suspense>
  );
};

// **Axios Interceptor Hook**
const useAxiosInterceptor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAlertShown = useRef(false);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && !isAlertShown.current) {
          isAlertShown.current = true;
          localStorage.removeItem("Web-token");

          Swal.fire({
            icon: "error",
            title: "Something went wrong! Connect to Admin",
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonText: "OK",
          }).then(() => {
            isAlertShown.current = false;
            navigate(0);
          });
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [navigate, location]);
};

// **Inactivity Logout Hook**
const useInactivityLogout = () => {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      localStorage.removeItem("Web-token");
      Swal.fire({
        icon: "warning",
        title: "Session Expired",
        text: "You have been logged out due to inactivity.",
        allowOutsideClick: false,
        confirmButtonText: "OK",
      }).then(() => navigate("/"));
    }, 30 * 60 * 1000); // 30 minutes
    // }, 3 * 60 * 1000); // 3 minutes
  }, [navigate]);

  useEffect(() => {
    resetTimer();
    const events = ["mousemove", "keydown", "click"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [resetTimer]);
};

// **Wrapper to include Header & Footer**
const WithLayout = ({ component: Component }) => (
  <>
    <Header />
    <Component />
    <Footer />
  </>
);

export default App;
