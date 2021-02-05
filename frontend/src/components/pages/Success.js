import React, { Fragment } from "react";
import MetaData from "./../../components/layout/MetaData";
import { Link } from "react-router-dom"

const Success = () => {
  return (
    <Fragment>
      <MetaData title="Payment Success" />
      <div className="container container-fluid">
        <div className="row justify-content-center">
          <div className="col-6 mt-5 text-center">
            <img
              className="my-5 img-fluid d-block mx-auto"
              src="https://freepngimg.com/thumb/success/6-2-success-png-image.png"
              alt="Order Success"
              width="200"
              height="200"
            />
            <h2>Your Order has been placed successfully.</h2>
            <Link className="btn btn-primary" to="/orders">Go to Orders</Link>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Success;
