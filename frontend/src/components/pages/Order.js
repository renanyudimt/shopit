import React, { Fragment, useEffect } from "react";
import MetaData from "../layout/MetaData";
import { useDispatch, useSelector } from "react-redux"
import Loader from "./../layout/Loader"
import { useAlert } from "react-alert"
import { getOrder } from "./../../actions/orderActions"
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"

const Orders = () => {
  const dispatch = useDispatch();
  const { loading, error, order } = useSelector(state => state.getOrderReducer)
  const params = useParams();
  const alert = useAlert();

  useEffect(() => {
    if (error) {
      return alert.error(error)
    }

    dispatch(getOrder(params.id))

  }, [dispatch, error, params.id])

  return (
    <Fragment>
      <MetaData title={"My Orders"} />
      <div className="container container-fluid">

        { loading ? (
          <Loader />
        ) : (
          <div className="row d-flex justify-content-between">
            <div className="col-12 col-lg-8 mt-5 order-details">
              <h1 className="my-5">Order #${order._id}</h1>

              <h4 className="mb-4">Shipping Info</h4>
              <p><b>Name:</b> {order.user.name}</p>
              <p><b>Phone:</b> {order.shippingInfo.phone}</p>
              <p className="mb-4"><b>Address:</b>{order.shippingInfo.address}</p>
              <p><b>Amount:</b> ${order.totalPrice}</p>
              <hr />
              <h4 className="my-4">Payment</h4>
              <p className={ order.paymentInfo.status === "succeeded" ? "greenColor" : "redColor" }><b>{order.paymentInfo.status === "succeeded" ? "PAID" : "FAILED"}</b></p>
              <h4 className="my-4">Order Status:</h4>
              <p className="greenColor"><b>{order.orderStatus}</b></p>
              <h4 className="my-4">Order Items:</h4>
              <hr />
              { order.orderItems.map(item => (
                <div className="cart-item my-1" key={item._id}>
                  <div className="row my-5">
                    <div className="col-4 col-lg-2">
                      <img src={item.image} alt="Laptop" height="45" width="65" />
                    </div>

                    <div className="col-5 col-lg-5">
                      <Link to={`/product/${item._id}`}>{item.name}</Link>
                    </div>

                    <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                      <p>${(item.price).toFixed(2)}</p>
                    </div>

                    <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                      <p>{item.quantity} Piece(s)</p>
                    </div>
                  </div>
                </div>
              ))}
              
              <hr />
            </div>
          </div>
        )}
      
      </div>
    </Fragment>
  );
};

export default Orders;
