import React, { useEffect, Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useAlert } from "react-alert"
import { loadCart, updateCartQuantity, deleteFromCart } from "./../../actions/cartActions"
import Loader from "./../layout/Loader"
import MetaData from "./../layout/MetaData"
import { useHistory, Link } from "react-router-dom"
import { Modal, Button } from "react-bootstrap"

const Cart = () => {
  const dispatch = useDispatch();
  const { loading, cartItems, error, products } = useSelector(state => state.cartReducer)
  const alert = useAlert();
  const history = useHistory();
  const [modalShow, setModalShow] = useState(false)


  useEffect(() => {
    if (error) {
      return alert.error(error)
    }

    dispatch(loadCart(cartItems))

  }, [dispatch, alert, error])

  function changeQuantity(direction, id, quantity, stock) {
    var newQuantity = 0;

    if (direction === "plus") {
      newQuantity = quantity + 1
      if (newQuantity > stock) return
    } else {
      newQuantity = quantity - 1
      if (newQuantity < 1) return
    }

    dispatch(updateCartQuantity(id, newQuantity))
  }

  function handleDelete(id) { 
    dispatch(deleteFromCart(id))
  }

  function proceedCheckout() {
    history.push('/shipping', [{
      authorization: true
    }])
  }

  function handleCheckout() {
    if (products.length > 0) {
      setModalShow(true)
    } else {
      alert.error("Your cart is empty")
    }
  }
  
  return (
    <Fragment>
      <MetaData title={"Cart"} />
      <div className="container container-fluid">
        {loading ? ( <Loader />) : (
          <Fragment>
            <h2 className="mt-5">
              Your Cart: <b>{products.length} items</b>
            </h2>

            <div className="row d-flex justify-content-between">
              <div className="col-12 col-lg-8">
                <hr />
                { products.length > 0 ? (
                  <Fragment>
                    { products.map(product => (
                      <Fragment key={ product._id }>
                        <div className="cart-item">
                          <div className="row">
                            <div className="col-4 col-lg-3">
                              <img
                                src={ product.images[0].url }
                                alt={ product.name }
                                height="90"
                                width="115"
                              />
                            </div>

                            <div className="col-5 col-lg-3">
                              <Link to={`/product/${product._id}`}>{ product.name }</Link>
                            </div>

                            <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                              <p id="card_item_price">${ product.price }</p>
                            </div>

                            <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                              <div className="stockCounter d-inline">
                                <span className="btn btn-danger minus" onClick={() => changeQuantity("minus", product._id, product.cartQuantity, product.stock)}>-</span>
                                <input type="number" className="form-control count d-inline" value={product.cartQuantity} readOnly />
                                <span className="btn btn-primary plus" onClick={() => changeQuantity("plus", product._id, product.cartQuantity, product.stock)}>+</span>
                              </div>
                              <p className="mt-1">Stock: { product.stock }</p>
                            </div>

                            <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                              <i id="delete_cart_item" className="fa fa-trash btn btn-danger" onClick={ () => handleDelete(product._id) }></i>
                            </div>
                          </div>
                        </div>
                        <hr />
                      </Fragment>
                    ))}
                   
                  </Fragment>
                ) : (
                  <h2 className="mt-5">Your cart is empty</h2>
                )}
                
              </div>

              <div className="col-12 col-lg-3 my-4">
                <div id="order_summary">
                  <h4>Order Summary</h4>
                  <hr />
                  <p>
                    Subtotal: <span className="order-summary-values">{products.length > 0 ? products.reduce((acc, item) => { return acc + Number(item.cartQuantity) }, 0) : 0} (Units)</span>
                  </p>
                  <p>
                    Est. total: <span className="order-summary-values">${products.length > 0 ? products.reduce((acc, item) => { return acc + Number(item.cartQuantity * item.price) }, 0) : 0.00}</span>
                  </p>
                  <hr />
                  <button id="checkout_btn" className="btn btn-primary btn-block" onClick={() => { handleCheckout(true) }}>
                    Check out
                  </button>
                </div>
              </div>
            </div>
          </Fragment>
        )}
      </div>

      <Modal
        show={modalShow}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Confirm checkout?
          </Modal.Title>
        </Modal.Header>
     {/*    <Modal.Body>
          <h4>Centered Modal</h4>
          <p>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
            dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
            consectetur ac, vestibulum at eros.
          </p>
        </Modal.Body> */}
        <Modal.Footer>
          <Button onClick={() => proceedCheckout()}>Ok</Button>
          <Button onClick={() => setModalShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default Cart