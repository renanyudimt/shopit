import React, { useEffect, Fragment, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useAlert } from "react-alert"
import Loader from "../layout/Loader"
import MetaData from "../layout/MetaData"
import { Carousel } from "react-bootstrap"

import { getProduct, clearErrors } from "../../actions/productActions"
import { addItemToCart } from "./../../actions/cartActions"

const ProductDetails = ({ match }) => {
  const dispatch = useDispatch();
  const alert = useAlert(); 
  const { product, error, loading } = useSelector(state => state.productDetailsReducer)
  const [qtd, setQtd] = useState(1);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors())
    }

    dispatch(getProduct(match.params.id))

  }, [dispatch, error, alert, match.params.id])

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
                  <button id="review_btn" type="button" className="btn btn-primary mt-4" data-toggle="modal" data-target="#ratingModal">Submit Your Review</button>
                  <div className="row mt-2 mb-5">
                    <div className="rating w-50">
                      <div className="modal fade" id="ratingModal" tabIndex="-1" role="dialog" aria-labelledby="ratingModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title" id="ratingModalLabel">Submit Review</h5>
                              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                            <div className="modal-body">
                              <ul className="stars" >
                                <li className="star"><i className="fa fa-star"></i></li>
                                <li className="star"><i className="fa fa-star"></i></li>
                                <li className="star"><i className="fa fa-star"></i></li>
                                <li className="star"><i className="fa fa-star"></i></li>
                                <li className="star"><i className="fa fa-star"></i></li>
                              </ul>
                              <textarea name="review" id="review" className="form-control mt-3"></textarea>
                              <button className="btn my-3 float-right review-btn px-4 text-white" data-dismiss="modal" aria-label="Close">Submit</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Fragment>)
        }
      </div>
  </Fragment>
  )
}

export default ProductDetails