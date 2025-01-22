import React from "react";

const LocationSettingPopup = ({ onCancles }) => {
  return (
    // <div className="access_location_popup" style={{ display: "block" }}>
    //   <div className="locationsettingpopup">
    //     <div className="location_settingdiv">
    //       <h2>Location Setting</h2>
    //       <ul>
    //         <li>Open Chrome.</li>
    //         <li>
    //           At the top right, select More{" "}
    //           <span>
    //             <i className="fa fa-ellipsis-v" aria-hidden="true" />{" "}
    //             <i className="fa fa-chevron-right" aria-hidden="true" />
    //           </span>{" "}
    //           <b>Settings</b>{" "}
    //           <span>
    //             <i className="fa fa-chevron-right" aria-hidden="true" />
    //           </span>{" "}
    //           Privacy and security.
    //         </li>
    //         <li>
    //           Select <b>Site settings</b>.
    //         </li>
    //         <li>
    //           Under “Permissions,” select <b>Location</b>.
    //         </li>
    //       </ul>
    //       <div className="getpermission_okbtndiv">
    //         <button
    //           type="button"
    //           className="location_info_okaybtn"
    //           onClick={onCancles}
    //         >
    //           OK
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="access_location_popup" style={{ display: "block" }}>
      <div className="locationsettingpopup">
        <div className="location_settingdiv">
          <h2>Location Setting</h2>
          <p>Follow the instructions based on your operating system:</p>
          <h3>For Mac Users:</h3>
          <ul>
            <li>
              Click on the Apple menu and select <b>System Preferences</b>.
            </li>
            <li>
              Go to <b>Security & Privacy</b> and then select the <b>Privacy</b>{" "}
              tab.
            </li>
            <li>
              In the sidebar, select <b>Location Services</b>.
            </li>
            <li>
              Click the lock icon at the bottom left and enter your password to
              make changes.
            </li>
            <li>
              Find the app (e.g., Chrome) in the list and ensure the checkbox is
              checked.
            </li>
          </ul>
          <h3>For Chrome:</h3>
          <ul>
            <li>Open Chrome.</li>
            <li>
              At the top right, click More{" "}
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
