import React from 'react'

function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="min-footer">
          <div className="container">
            <div className="row align-items-center justify-content-between mb-4 mb-md-5">
              <div className="col-md-12 col-lg-4 mb-4 mb-lg-0">
                <h5 className="title mb-3 d-block follow">Follow Us </h5>
                <div className="footer-social justify-content-center justify-content-lg-start">
                  <ul>
                    <li>
                      <a href="javascript:void(0)">
                        <i className="fab fa-facebook-f" />
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">
                        <i className="fab fa-instagram" />
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">
                        <i className="fa-brands fa-x-twitter" />
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">
                        <i className="fa-brands fa-threads" />
                      </a>
                    </li>
                    <li className="mr-0">
                      <a href="javascript:void(0)">
                        <i className="fa-brands fa-youtube" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-12 col-lg-4 text-center mb-4 mb-lg-0">
                <a href="javascript:void(0)" className="footer-logo">
                  <img
                    className="logo img-fluid"
                    src="images/logo.png"
                    alt="logo"
                  />
                </a>
              </div>
              <div className="col-md-12 col-lg-4">
                <div className="download-app  align-items-center justify-content-center justify-content-lg-start text-center">
                  <h5 className="title mb-3 d-block download">Download App</h5>
                  <a href="javascript:void(0)">
                    <img
                      className="img-fluid"
                      src="images/android-download.png"
                      alt="androidplay"
                    />
                  </a>
                  <a href="javascript:void(0)">
                    <img
                      className="img-fluid"
                      src="images/appleapp.svg"
                      alt="appleapp"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <div className="row align-items-center copyright">
              <div className="col-12 col-md-6 text-center text-md-start">
                <div className="copyright-menu footer-menu">
                  <ul className="mb-0 justify-content-center justify-content-md-start list-unstyled">
                    <li>
                      <a href="javascript:void(0)">Terms &amp; Conditions</a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">Privacy Policy</a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">Cookie Policy</a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">Rules Of Play &amp; FAQs</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-12 col-md-6 text-center text-md-end mt-2 mt-md-0">
                <p className="mb-0">
                  {" "}
                  © Copyright <span id="copyright"> 2025</span>{" "}
                  <a href="index.html"> SpotsBall Global PVT. LTD. </a> All
                  Rights Reserved
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer
