// facebook.js
export const loadFacebookSdk = () => {
  return new Promise((resolve) => {
    if (window.FB) {
      resolve(); 
      return;
    }

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "1611822736090667",
        cookie: true,
        xfbml: false,
        version: "v17.0",
      });
      resolve();
    };

    if (!document.getElementById("facebook-jssdk")) {
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      document.body.appendChild(script);
    }
  });
};
