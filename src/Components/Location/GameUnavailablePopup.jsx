import React from "react";
import { useTranslation } from "react-i18next";

const GameUnavailablePopup = ({ onOk }) => {

    const { t } = useTranslation();

  return (
    <div
      className="geolocationmaindiv gameunavailable_popup"
      style={{ display: "block" }}
    >
      <div className="popupdivfor_grolocation">
        <div className="locationwantsdiv">
          <div className="locationicondiv">
            <img
              src={`${process.env.PUBLIC_URL}/image/unvailable_icon.png`}
              // src="images/unvailable_icon.png"
              alt="Unavailable Icon"
            />
          </div>
          <div className="locationtextwithheading">
            <h2>{t("Game Unavailable in Your Region")}</h2>
            <p>
              {t("Sorry, SpotsBall is not available in your current location due to local regulations.")}
            </p>
          </div>
          <div className="locationactionbtndiv">
            <div className="gameunavila_action">
              <button
                type="button"
                className="okbtn_gameunavail"
                onClick={onOk}
              >
                {t("OK")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameUnavailablePopup;
