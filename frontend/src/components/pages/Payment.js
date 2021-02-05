import React, { useEffect, Fragment } from "react";
import MetaData from "./../layout/MetaData";
import { useDispatch, useSelector } from "react-redux"
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js"
import axios from "axios"
import { useHistory } from "react-router-dom"
import CheckoutSteps from "../cart/CheckoutSteps"
import { useAlert } from "react-alert"
import { clearErrors, createOrder } from "./../../actions/orderActions"
import { clearCart } from "./../../actions/cartActions"

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
  const { cartItems, products, shippingInfo } = useSelector(state => state.cartReducer)
  const { error, success } = useSelector(state => state.createOrderReducer)

  const orderPrice = products.reduce((acc, item) => { return acc + Number(item.cartQuantity * item.price) }, 0)
  const taxPrice = Number(0.05 * orderPrice).toFixed(2);
  const shippingPrice = orderPrice > 200 ? 0 : 25;
  const totalPrice = (Number(orderPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2)

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearErrors())
    }

    if (success) {
      localStorage.clear();
      dispatch(clearCart())

      history.push("/success", [{
        authorization: true
      }])
    }

  }, [alert, dispatch, error, success]);

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

      const payload = {
        amount: Math.round(totalPrice * 100),
        cartItems
      }

      res = await axios.post(`http://localhost:4000/api/v1/payment/process`, payload, config)
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
        const { message } = result.error
        //console.log(code, type, message)
        alert.error(message)
        document.querySelector("#pay_btn").disabled = false
      } else {
        if (result.paymentIntent.status === "succeeded") {
          const order = {
            shippingInfo,
            user: user._id,
            orderItems: cartItems,
            paymentInfo: {
              id: result.paymentIntent.id,
              status: result.paymentIntent.status
            },
            taxPrice,
            shippingPrice,
            totalPrice,
            orderStatus: "Paid",
            paidAt: Date.now(),
            createdAt: Date.now()
          }

          dispatch(createOrder(order))

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
              { /* ou entao posso usar um <CardElement /> e usar a funcao createPaymentMethod ao invez de confirmPaymentMethod */ }
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
                {`Pay - ${totalPrice}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Payment;
