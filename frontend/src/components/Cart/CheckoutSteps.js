import React from "react";
import { Link, useHistory } from "react-router-dom";


const CheckoutSteps = ({ shipping, confirmOrder, payment }) => {
  const history = useHistory();
  
  function handleClick (e, route) {
    e.preventDefault()
    history.push(`/${route}`, [{ authorization: true }])

  }

  return (
    <div className="checkout-progress d-flex justify-content-center mt-5">
      {shipping ? (
        <Link to="#" onClick={e =>  handleClick(e, "shipping") } className="float-right">
          <div className="triangle2-active"></div>
          <div className="step active-step">Shipping</div>
          <div className="triangle-active"></div>
        </Link>
      ) : (
        <Link to="#" onClick={e =>  handleClick(e, "shipping") }>
          <div className="triangle2-incomplete"></div>
          <div className="step incomplete">Shipping</div>
          <div className="triangle-incomplete"></div>
        </Link>
      )}

      {confirmOrder ? (
        <Link to="#" onClick={e =>  handleClick(e, "confirm") } className="float-right">
          <div className="triangle2-active"></div>
          <div className="step active-step">Confirm Order</div>
          <div className="triangle-active"></div>
        </Link>
      ) : (
        <Link to="#" onClick={e =>  handleClick(e, "confirm") }>
          <div className="triangle2-incomplete"></div>
          <div className="step incomplete">Confirm Order</div>
          <div className="triangle-incomplete"></div>
        </Link>
      )}

      {payment ? (
        <Link to="#" onClick={e =>  handleClick(e, "payment") } className="float-right">
          <div className="triangle2-active"></div>
          <div className="step active-step">Payment</div>
          <div className="triangle-active"></div>
        </Link>
      ) : (
        <Link to="#" onClick={e =>  handleClick(e, "payment") } disabled>
          <div className="triangle2-incomplete"></div>
          <div className="step incomplete">Payment</div>
          <div className="triangle-incomplete"></div>
        </Link>
      )}
    </div>
  );
};

export default CheckoutSteps;
