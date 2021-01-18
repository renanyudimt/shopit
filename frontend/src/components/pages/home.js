import React, { Fragment, useEffect } from "react";
import MetaData from "./../layout/MetaData";
import Product from "./../../components/product/Product"
import Loader from "./../../components/layout/Loader"

import { useDispatch, useSelector } from "react-redux"
import { useAlert } from "react-alert"
import { getProducts } from "./../../actions/productActions"


function Home() {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { loading, products, error } = useSelector(state => state.products)


  useEffect(async () => {
    console.log("useEffect")
    if (error) {
      return alert.error(error)
    }

    dispatch(getProducts());

  }, [dispatch, alert, error])

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
                  {products && products.map((product) => (
                    <Product key={product._id} product={product} />
                  ))}
                </div>
              </section>
          </Fragment>
        }
      </div>
    </Fragment>
  );
}

export default Home;