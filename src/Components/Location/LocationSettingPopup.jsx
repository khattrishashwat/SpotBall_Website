import React from "react";
import { useTranslation } from "react-i18next";

const LocationSettingPopup = ({ onCancles }) => {
  const { t } = useTranslation();

  return (
    <div className="access_location_popup" style={{ display: "block" }}>
      <div className="locationsettingpopup">
        <div className="location_settingdiv">
          <h2>{t("Location Setting")}</h2>
          <p>{t("Follow the instructions based on your operating system:")}</p>
          <h3>{t("For Mac Users:")}</h3>
          <ul>
            <li>
              {t("Click on the Apple menu and select")}{" "}
              <b>{t("System Preferences")}</b>.
            </li>
            <li>
              {t("Go to")} <b>{t("Security & Privacy")}</b>{" "}
              {t("and then select the")} <b>{t("Privacy")}</b> {t("tab.")}
            </li>
            <li>
              {t("In the sidebar, select")} <b>{t("Location Services")}</b>.
            </li>
            <li>
              {
                "Click the lock icon at the bottom left and enter your password to make changes."
              }
            </li>
            <li>
              {t(
                "Find the app (e.g., Chrome) in the list and ensure the checkbox is checked."
              )}
            </li>
          </ul>
          <h3>{t("For Chrome:")}</h3>
          <ul>
            <li>{t("Open Chrome.")}</li>
            <li>
              {t("At the top right, click More")}{" "}
              <span>
                <i className="fa fa-ellipsis-v" aria-hidden="true" />{" "}
                <i className="fa fa-chevron-right" aria-hidden="true" />
              </span>{" "}
              <b>{t("Settings")}</b>{" "}
              <span>
                <i className="fa fa-chevron-right" aria-hidden="true" />
              </span>{" "}
              {t("Privacy and security.")}
            </li>
            <li>
              {t("Select")} <b>{t("Site settings")}</b>.
            </li>
            <li>
              {t("Under “Permissions,” select")} <b>{t("Location")}</b>.
            </li>
          </ul>
          <div className="getpermission_okbtndiv">
            <button
              type="button"
              className="location_info_okaybtn"
              onClick={onCancles}
            >
              {t("OK")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSettingPopup;
