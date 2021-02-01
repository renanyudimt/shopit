import React, { useEffect, useState, Fragment } from "react";
import MetaData from "./../layout/MetaData";
import { useDispatch, useSelector } from "react-redux"
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js"
import axios from "axios"
import { useHistory } from "react-router-dom"
import CheckoutSteps from "./../Cart/CheckoutSteps"
import { useAlert } from "react-alert"

const options = {
  style: {
    base: {
      fontSize: '1rem'
    },
    invalid: {
      color: '#9e2146'
    }
  }
}

const Payment = () => {
  const history = useHistory();
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { user } = useSelector(state => state.userReducer)
  const { cartItems, shippingInfo } = useSelector(state => state.cartReducer)
  const orderInfo = JSON.parse(localStorage.getItem("orderInfo"));

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  }

  useEffect(() => {}, []);

  async function handlerSubmit(e) {
    e.preventDefault();
    document.querySelector("#pay_btn").disabled = true

    let res
    try {
      const config = {
        headers: {
          "Content-Type":"application/json"
        },
        withCredentials: true
      }

      res = await axios.post(`http://localhost:4000/api/v1/payment/process`, paymentData, config)
      const clientSecret = res.data.client_secret 

      if (!stripe || !elements) {
        return;
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email
          }
        }
      })

      if (result.error) {
        alert.error(result.error.message)
        document.querySelector("#pay_btn").disabled = false
      } else {
        if (result.paymentIntent.status === "succeeded") {
          //creting new order
          history.push("/success", [{
            authorization: true
          }])
        } else {
          alert.error("There is some issue while payment processing")
        }
      }

    } catch(error) {
      document.querySelector("#pay_btn").disabled = false
      alert.error(error.response.data.errorMessage)
    }
  }

  return (
    <Fragment>
      <MetaData title="Payment" />
      <div className="container container-fluid">
        <CheckoutSteps shipping confirmOrder payment />
        <div className="row wrapper">
          <div className="col-10 col-lg-5">
            <form className="shadow-lg" onSubmit={handlerSubmit}>
              <h1 className="mb-4">Card Info</h1>
              <div className="form-group">
                <label htmlFor="card_num_field">Card Number</label>
                <CardNumberElement
                  type="text"
                  id="card_num_field"
                  className="form-control"
                  options={options}
                />
              </div>

              <div className="form-group">
                <label htmlFor="card_exp_field">Card Expiry</label>
                <CardExpiryElement
                  type="text"
                  id="card_exp_field"
                  className="form-control"
                  options={options}
                />
              </div>

              <div className="form-group">
                <label htmlFor="card_cvc_field">Card CVC</label>
                <CardCvcElement
                  type="text"
                  id="card_cvc_field"
                  className="form-control"
                  options={options}
                />
              </div>
              <button id="pay_btn" type="submit" className="btn btn-block py-3">
                {`Pay - ${orderInfo && orderInfo.totalPrice}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Payment;
