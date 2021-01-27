import React, { Fragment, useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import Slider from "rc-slider"; 
import 'rc-slider/assets/index.css';

import MetaData from "../layout/MetaData";
import Product from "../product/Product"
import Loader from "../layout/Loader"

import { useDispatch, useSelector } from "react-redux"
import { useAlert } from "react-alert"
import { getProducts } from "../../actions/productActions"

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range)

function Home({ match }) {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([1, 1000])
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(0);

  const alert = useAlert();

  const keyword = match.params.keyword || "";

  const categories = ["Electronics", "Cameras", "Laptops", "Accessories", "Headphones", "Food", "Books", "Clothes/Shoes", "Beauty/Health", "Sports", "Outdoor", "Home"]

  const { loading, products, error, resPerPage, productsCount, filteredProductsCount } = useSelector(state => state.products)

  let count = productsCount

  if (keyword) {
    count = filteredProductsCount
  }

  /**
   * TODO: fazer com que o price seja for JS, usando filter ao inves de requiscao, nao da pra usar assim n
   */

  useEffect(async () => {

    if (error) {
      return alert.error(error);
    }

    dispatch(getProducts(currentPage,keyword, price, category, rating));

  }, [dispatch, alert, error, price, currentPage, keyword, category, rating])

  function handlePaginationChange(pageNumber) {
    console.log(pageNumber)
    setCurrentPage(pageNumber)
  }


  return (
    <Fragment>
      <MetaData title={`Buy the best product online`} />
      <div className="container container-fluid">
        {loading ? 
          <Loader /> 
          : 
          <Fragment>
              <h1 id="products_heading">Latest Products</h1>
              <section id="products" className="container mt-5">
                <div className="row">
                  {keyword ? (
                    <Fragment>
                      <div className="col-6 col-md-3 mt-5 mb-5">
                        <div className="px-5">
                          <Range 
                            marks={{
                              1: `$1`,
                              1000: `$1000`
                            }}
                            min={0}
                            max={1000}
                            defaultValue={[0, 1000]}
                            tipFormatter={value => `$${value}`}
                            tipProps={{
                              placement: "top",
                              visible: true
                            }}
                            value={price}
                            onChange={price => setPrice(price)}
                          />

                          <hr className="my-5" />

                          <div className="mt-5">
                            <h4 className="mb-3">Categories</h4>
                            <ul className="pl-0">
                              {categories.map(item =>  (
                                <li style={{ cursor: "pointer", listStyle: "none"}} key={item} onClick={() => setCategory(item)}>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <hr className="my-3" />
                          
                          <div className="mt-5">
                            <h4 className="mb-3">Ratings</h4>
                            <ul className="pl-0">
                              {[5,4,3,2,1,0].map(star => (
                                <li key={star} style={{ cursor: "pointer", listStyle: "none"}} onClick={() => setRating(star)}>
                                  <div className="rating-outer">
                                    <div className="rating-inner" style={{ width: `${star * 20}%`}}></div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-6 col-md-9">
                        <div className="row">
                          { products && products.map((product) => (
                            <Product key={product._id} product={product} col={4}/>
                          ))}
                        </div>
                      </div>
                    </Fragment>
                  ) : (
                    products && products.map((product) => (
                      <Product key={product._id} product={product} col={3} />
                    ))
                  )}

                </div>
              </section>

              {count > resPerPage && (
                <div className="d-flex justify-content-center mt-5">
                  <Pagination 
                    activePage={currentPage}
                    itemsCountPerPage={resPerPage}
                    totalItemsCount={count}
                    onChange={handlePaginationChange}
                    nextPageText={'Next'}
                    prevPageText={'Prev'}
                    firstPageText={'First'}
                    lastPageText={'Last'}
                    itemClass="page-item"
                    linkClass="page-link"
                  />
                </div>
              )}
          </Fragment>
        }
      </div>
    </Fragment>
  );
}

export default Home;