// TawkScriptLoader.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const TawkScriptLoader = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if current pathname is either /cart or /play_screen
    if (location.pathname === "/cart" || location.pathname === "/play_screen") {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = "https://embed.tawk.to/67bd8b2063d698190c70d577/1iku6eujj";
      script.charset = "UTF-8";
      script.setAttribute("crossorigin", "*");
      document.body.appendChild(script);

      // Cleanup: remove the script when leaving the page
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [location.pathname]);

  return null;
};

export default TawkScriptLoader;
