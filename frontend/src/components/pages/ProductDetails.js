import React, { useEffect, Fragment, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useAlert } from "react-alert"
import Loader from "../layout/Loader"
import MetaData from "../layout/MetaData"
import { Carousel, Modal, Button } from "react-bootstrap"
import ReviewsList from "./../product/ReviewsList"

import { getProduct, clearErrors, resetNewReview, newReview, deleteReview } from "../../actions/productActions"
import { addItemToCart } from "./../../actions/cartActions"

const ProductDetails = ({ match }) => {
  const dispatch = useDispatch();
  const alert = useAlert(); 
  const { product, error, loading } = useSelector(state => state.productDetailsReducer)
  const { user } = useSelector(state => state.userReducer)
  const { error: reviewError, success, loading: reviewLoading, message } = useSelector(state => state.newReviewReducer)
  const [qtd, setQtd] = useState(1);
  const [show, setShow] = useState(false);
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");

  const handleCloseReviewModal = () => setShow(false);
  const handleShowReviewModal = () => setShow(true);

  const handleModalFunctions = () => {
    const stars = document.querySelectorAll(".star");

    stars.forEach((star, index) => {
      star.dataset.value = index + 1;

      ["click", "mouseover", "mouseout"].forEach(function (e) {
        star.addEventListener(e, showRatings);
      });
    });

    function showRatings(e) {
      stars.forEach((star, index) => {
        if (e.type === "click") {
          if (index < this.dataset.value) {
            star.classList.add("orange");
            setRating(this.dataset.value);
          } else {
            star.classList.remove("orange");
          }
        }

        if (e.type === "mouseover") {
          if (index < this.dataset.value) {
            star.classList.add("yellow");
          } else {
            star.classList.remove("yellow");
          }
        }

        if (e.type === "mouseout") {
          star.classList.remove("yellow");
        }
      });
    }
  }

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors())
    }

    if (reviewError) {
      alert.error(reviewError);
      handleCloseReviewModal();
      dispatch(resetNewReview())
    }

    if(success) {
      alert.success(message)
      handleCloseReviewModal();
      dispatch(resetNewReview())
    }

    dispatch(getProduct(match.params.id))

  }, [dispatch, error, reviewError, success, alert, match.params.id])

  function handleMinus() {
    if (qtd > 1) {
      setQtd(qtd - 1)
    }
  }

  function handlePlus() {
    if (qtd < product.stock) {
      setQtd(qtd + 1)
    }
  }

  function handleAddToCart() {
    dispatch(addItemToCart(match.params.id, qtd))
    alert.success("Product added successfully!")
  }

  function handleSubmitReview() {
    const formData = new FormData()
    formData.set("rating", rating)
    formData.set("comment", comment)
    formData.set("productId", match.params.id)
    dispatch(newReview(formData))
  }

  function handleDeleteReview(reviewId) {
    dispatch(deleteReview(match.params.id, reviewId))
  }

  return (
    <Fragment>
      <MetaData title={ product ? product.name : `Buy the best product online` } />
      <div className="container container-fluid">
        {loading ? <Loader />  :
          (<Fragment>
            <div className="container container-fluid"> 
              <div className="row f-flex justify-content-around">
                <div className="col-12 col-lg-5 img-fluid" id="product_image">
                  <Carousel pause="hover">
                    {product.images && product.images.map(image => (
                      <Carousel.Item key={image.public_id}>
                        <img src={ image.url } alt={product.name} className="d-block w-100" />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                </div>
                <div className="col-12 col-lg-5 mt-5">
                  <h3>{ product.name }</h3>
                  <p id="product_id">Product # { product._id }</p>
                  <hr/>
                  <div className="rating-outer">
                    <div className="rating-inner" style={{ width: `${(product.ratings/5) * 100}%` }}></div> 
                  </div>
                  <span id="no_of_reviews">({ product.reviews.length } Reviews)</span>
                  <hr/>
                  <p id="product_price">${ product.price }</p>
                  {product.stock > 0 && (
                    <Fragment>
                      <div className="stockCounter d-inline">
                        <span className="btn btn-danger minus" onClick={handleMinus}>-</span>
                        <input type="number" className="form-control count d-inline" value={qtd} readOnly />
                        <span className="btn btn-primary plus" onClick={handlePlus}>+</span>
                      </div>
                      <button type="button" id="cart_btn" className="btn btn-primary d-inline ml-4" onClick={handleAddToCart}>Add to Cart</button>
                      <hr />
                    </Fragment>
                  )}
                
                  <p>Status: <span id="stock_status" className={product.stock > 0 ? "greenColor" : "redColor"}>{product.stock > 0 ? `${product.stock} in stock`: "Out of stock"}</span></p>
                  <hr/>
                  <h4 className="mt-2">Description:</h4>
                  <p>{ product.description }</p>
                  <hr />
                  <p id="product_seller mb-3">Sold by: <strong>{product.seller}</strong></p>	

                  {user ? (
                    <button type="button" className="btn btn-primary mt-4" onClick={handleShowReviewModal}>Submit Your Review</button>
                  ) : (
                    <div id="review_btn" className="alert alert-danger mt-5" type="alert">Login to post your review</div>
                  )}			


                  <Modal show={show} onHide={handleCloseReviewModal} id="modalReview" onShow={handleModalFunctions}>
                    <Modal.Header closeButton> 
                      <Modal.Title>Submit Review</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <ul className="stars" >
                        <li className="star"><i className="fa fa-star"></i></li>
                        <li className="star"><i className="fa fa-star"></i></li>
                        <li className="star"><i className="fa fa-star"></i></li>
                        <li className="star"><i className="fa fa-star"></i></li>
                        <li className="star"><i className="fa fa-star"></i></li>
                      </ul>
                      <textarea name="review" id="review" className="form-control mt-3" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                      <Button className="btn my-3 float-right review-btn px-4 text-white" onClick={handleSubmitReview} disabled={reviewLoading ? true : false}>Submit</Button>
                    </Modal.Body>
                  </Modal>
                </div>
              </div>
            </div>

          { product.reviews && product.reviews.length > 0 && (
            <ReviewsList reviews={ product.reviews } user={user} handleDeleteReview={handleDeleteReview} />
          )}
          </Fragment>)
        }
      </div>
  </Fragment>
  )
}

export default ProductDetails