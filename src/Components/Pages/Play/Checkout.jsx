import React,{useState,useEffect} from 'react'
import axios from 'axios';



function Checkout() {
  const [isLoading, setIsLoading] = useState(false);
  const [carts,setCarts]=useState('');


   const fetchData = async () => {
     const token = localStorage.getItem("token");
     try {
       setIsLoading(true);
       const response = await axios.get(`get-all-cart-items`, {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       });

       setCarts(response.data.data);
console.log("carts",response.data.data);

       
     } catch (error) {
       console.error("Error  data:", error);
     } finally {
       setIsLoading(false);
     }
   };

   useEffect(() => {
     fetchData();
   }, []);

  return (
    <>
      <section className="maincont_section myacocunt_sectionforbgimg">
        <div className="container contforinner_mainheading">
          <div className="row rowmainheading_inner">
            <div className="col-md-12 colmainheading_innerpages">
              <div className="pageheading_main page_myaccountdiv">
                <h2 className="myaccounheading">Checkout</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="container contrighttabbingpage">
          <div className="col-md-12">
            <div className="row rowtabbingpage">
              <div className="col-md-5 coltabbingdiv">
                <div className="cartwithcordinatetables">
                  {carts &&
                    carts.map((cart, index) => (
                      <div key={cart._id} className="cartstripe">
                        <div className="checkout_cartdiv">
                          <div className="cart_jackpotdetails cartwindiv_mainformov">
                            <div className="cart_windiv">
                              Win{" "}
                              <span className="winprice_cart">
                                ₹{cart.contest_id.title}
                              </span>
                            </div>
                            <div className="jackpot_ticket_cart">
                              <h3>₹{cart.contest_id.jackpot_price} Jackpot</h3>
                              <h4>{cart.tickets_count} Tickets</h4>
                              <p>Spot &amp; Win</p>
                            </div>
                          </div>
                          <div className="cart_gametotalprice">
                            <h3>
                              ₹
                              {cart.contest_id.ticket_price *
                                cart.tickets_count}
                            </h3>
                            <p className="addgsttext_cart">+ GST (@28%)</p>
                          </div>
                        </div>
                        <div className="crossicon_cartdiv">
                          <button type="button" className="crossbtn_cart">
                            <img
                              src={`${process.env.PUBLIC_URL}/images/cross_cart.png`}
                              alt="Close"
                            />
                          </button>
                        </div>

                        {/* Coordinates Table */}
                        <div className="cordinates_table_cart">
                          <table className="table table-bordered cordtable_new">
                            <thead>
                              <tr>
                                <th>Tickets</th>
                                <th>X- Coordinates</th>
                                <th>Y- Coordinates</th>
                              </tr>
                            </thead>
                            <tbody>
                              {cart.user_coordinates.map((coordinate, idx) => (
                                <tr key={coordinate._id}>
                                  <td>{idx + 1}</td>
                                  <td>{coordinate.x}</td>
                                  <td>{coordinate.y}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="col-md-7 coltabdata_righttext">
                <div className="tabingrighttextdiv checkoutcards_section">
                  <div className="payment_methoddiv cartmaindivforpaym_new">
                    <div className="promotionalinput_cart">
                      <input
                        className="discountinput_cart"
                        type="text"
                        placeholder="Promotion Code (if any)"
                      />
                    </div>
                    <div className="methodsdivnew">
                      <div className="paymentmethodsheaidng">
                        <h4>CARDS</h4>
                      </div>
                      <div className="cardmethod_design">
                        <div className="creditdebit_carddiv">
                          <div className="cardnamewithicon">
                            <img
                              src={`${process.env.PUBLIC_URL}/images/card.png`}
                              //   src="images/card.png"
                            />
                            <p>Pay Via Credit / Debit Cards</p>
                          </div>
                          <div className="arrowicondiv">
                            <img
                              src={`${process.env.PUBLIC_URL}/images/arrow_icon_payment.png`}
                              className="showcardinputonclick_icon"
                            />
                          </div>
                        </div>
                        <div className="cardpay_inputs showhideonclick_arrowicon_carddiv">
                          <div className="cardnumberinput">
                            <input
                              type="text"
                              className="input_cardsnew"
                              placeholder="Card Number"
                            />
                          </div>
                          <div className="validupto_cvv">
                            <div className="cardnumberinput">
                              <input
                                type="text"
                                className="input_cardsnew"
                                placeholder="Valid Upto"
                              />
                            </div>
                            <div className="cardnumberinput">
                              <input
                                type="text"
                                className="input_cardsnew"
                                placeholder="CVV"
                              />
                            </div>
                          </div>
                          <div className="paybtn_card">
                            <button
                              type="button"
                              className="paybtn_debitcard showpaydonepopup_click"
                            >
                              Pay
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="methodsdivnew">
                      <div className="paymentmethodsheaidng">
                        <h4>NETBANKING</h4>
                      </div>
                      <div className="card_netbankingdivmain">
                        <a href="#!">
                          <div className="cardmethod_design forbrdrbtm">
                            <div className="creditdebit_carddiv">
                              <div className="cardnamewithicon">
                                <img src="images/icici_icon.png" />
                                <p>ICICI</p>
                              </div>
                              <div className="arrowicondiv rotate270forotherpayment">
                                <img src="images/arrow_icon_payment.png" />
                              </div>
                            </div>
                          </div>
                        </a>
                        <a href="#!">
                          <div className="cardmethod_design">
                            <div className="creditdebit_carddiv">
                              <div className="cardnamewithicon">
                                <img src="images/axis_icon.png" />
                                <p>Axis Bank</p>
                              </div>
                              <div className="arrowicondiv rotate270forotherpayment">
                                <img src="images/arrow_icon_payment.png" />
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                    <div className="methodsdivnew">
                      <div className="paymentmethodsheaidng">
                        <h4>UPI</h4>
                      </div>
                      <a href="#!">
                        <div className="cardmethod_design mrgnbtmforupistripe">
                          <div className="creditdebit_carddiv">
                            <div className="cardnamewithicon">
                              <img src="images/gpay_icon.png" />
                              <p>GPay</p>
                            </div>
                            <div className="arrowicondiv rotate270forotherpayment">
                              <img src="images/arrow_icon_payment.png" />
                            </div>
                          </div>
                        </div>
                      </a>
                      <a href="#!">
                        <div className="cardmethod_design mrgnbtmforupistripe">
                          <div className="creditdebit_carddiv">
                            <div className="cardnamewithicon">
                              <img src="images/paytm_icon.png" />
                              <p>Paytm</p>
                            </div>
                            <div className="arrowicondiv rotate270forotherpayment">
                              <img src="images/arrow_icon_payment.png" />
                            </div>
                          </div>
                        </div>
                      </a>
                      <a href="#!">
                        <div className="cardmethod_design mrgnbtmforupistripe">
                          <div className="creditdebit_carddiv">
                            <div className="cardnamewithicon">
                              <img src="images/phonepay_icon.png" />
                              <p>PhonePe</p>
                            </div>
                            <div className="arrowicondiv rotate270forotherpayment">
                              <img src="images/arrow_icon_payment.png" />
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Checkout
