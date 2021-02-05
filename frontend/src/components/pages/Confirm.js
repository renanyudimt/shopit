import React, { Fragment } from "react";
import { useSelector } from "react-redux"
import { useHistory, Link } from "react-router-dom";
import MetaData from "./../layout/MetaData"
import CheckoutSteps from "../cart/CheckoutSteps"

const Confirm = () => {
  const { user } = useSelector(state => state.userReducer)
  const { products, shippingInfo } = useSelector(state => state.cartReducer)
  const orderPrice = products.reduce((acc, item) => { return acc + Number(item.cartQuantity * item.price) }, 0)
  const taxPrice = Number(0.05 * orderPrice).toFixed(2);
  const shippingPrice = orderPrice > 200 ? 0 : 25;
  const totalPrice = (Number(orderPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2)
  const history = useHistory(); 

  function handleProceedPayment() {
    history.push('/payment', [{
      authorization: true
    }])
  }

  return (
    <Fragment>
      <MetaData title="Confirm Order" />
      <div className="container-fluid container">
        <CheckoutSteps shipping confirmOrder />
        <div className="row d-flex justify-content-between">
          <div className="col-12 col-lg-8 mt-5 order-confirm">
            <h4 className="mb-3">Shipping Info</h4>
            <p><b>Name:</b> { user.name }</p>
            <p><b>Phone:</b> { shippingInfo.phone } </p>
            <p className="mb-4"><b>Address:</b> { shippingInfo.address },{ shippingInfo.city }, {shippingInfo.zipCode}, {shippingInfo.country }</p>
            <hr />
            <h4 className="mt-4">Your Cart Items:</h4>
            <hr />
            {products.map( item => (
              <div key={ item._id } className="cart-item my-1">
                <div className="row">
                  <div className="col-4 col-lg-2">
                    <img
                      src={ item.images[0].url}
                      alt={ item.name }
                      height="45"
                      width="65"
                    />
                  </div>

                  <div className="col-5 col-lg-6">
                    <Link to={`/product/${item._id}`}>{ item.name }</Link>
                  </div>

                  <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                  <p>{item.cartQuantity} x ${ item.price } = <b>${(item.price * item.cartQuantity).toFixed(2)}</b></p>
                  </div>
                </div>
              </div>
              ) 
            )}
          
            <hr />
          </div>

          <div className="col-12 col-lg-3 my-4">
            <div id="order_summary">
              <h4>Order Summary</h4>
              <hr />
              <p>Subtotal: <span className="order-summary-values">${ orderPrice } </span></p>
              <p>Shipping: <span className="order-summary-values">${ shippingPrice }</span></p>
              <p>Tax: <span className="order-summary-values">${ taxPrice }</span></p>
              <hr />
              <p>Total: <span className="order-summary-values">${totalPrice}</span></p>
              <hr />
              <button id="checkout_btn" className="btn btn-primary btn-block" onClick={ handleProceedPayment }>Proceed to Payment</button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Confirm;
