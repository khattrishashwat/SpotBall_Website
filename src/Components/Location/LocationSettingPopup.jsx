import React from "react";

const LocationSettingPopup = ({ onCancles }) => {
  return (
    <div className="access_location_popup" style={{ display: "block" }}>
      <div className="locationsettingpopup">
        <div className="location_settingdiv">
          <h2>Location Setting</h2>
          <ul>
            <li>Open Chrome.</li>
            <li>
              At the top right, select More{" "}
              <span>
                <i className="fa fa-ellipsis-v" aria-hidden="true" />{" "}
                <i className="fa fa-chevron-right" aria-hidden="true" />
              </span>{" "}
              <b>Settings</b>{" "}
              <span>
                <i className="fa fa-chevron-right" aria-hidden="true" />
              </span>{" "}
              Privacy and security.
            </li>
            <li>
              Select <b>Site settings</b>.
            </li>
            <li>
              Under “Permissions,” select <b>Location</b>.
            </li>
          </ul>
          <div className="getpermission_okbtndiv">
            <button
              type="button"
              className="location_info_okaybtn"
              onClick={onCancles}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSettingPopup;
