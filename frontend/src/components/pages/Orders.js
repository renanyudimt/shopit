import React, { Fragment } from "react";
import MetaData from "./../layout/MetaData";

const Orders = () => {
  return (
    <Fragment>
      <MetaData title={"My Orders"} />
      <div class="container container-fluid">
        <div class="row d-flex justify-content-between">
          <div class="col-12 col-lg-8 mt-5 order-details">
            <h1 class="my-5">Order # 4543f34f545</h1>

            <h4 class="mb-4">Shipping Info</h4>
            <p>
              <b>Name:</b> John
            </p>
            <p>
              <b>Phone:</b> 111 111 1111
            </p>
            <p class="mb-4">
              <b>Address:</b>Address of user
            </p>
            <p>
              <b>Amount:</b> $1111
            </p>

            <hr />

            <h4 class="my-4">Payment</h4>
            <p class="greenColor">
              <b>PAID</b>
            </p>

            <h4 class="my-4">Order Status:</h4>
            <p class="greenColor">
              <b>Delivered</b>
            </p>

            <h4 class="my-4">Order Items:</h4>

            <hr />
            <div class="cart-item my-1">
              <div class="row my-5">
                <div class="col-4 col-lg-2">
                  <img src="" alt="Laptop" height="45" width="65" />
                </div>

                <div class="col-5 col-lg-5">
                  <a href="#">Mic</a>
                </div>

                <div class="col-4 col-lg-2 mt-4 mt-lg-0">
                  <p>$33</p>
                </div>

                <div class="col-4 col-lg-3 mt-4 mt-lg-0">
                  <p>2 Piece(s)</p>
                </div>
              </div>
            </div>
            <hr />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Orders;
