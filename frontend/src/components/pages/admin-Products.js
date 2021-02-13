import React, { Fragment, useEffect } from 'react'
import { Link, useHistory } from "react-router-dom"
import MetaData from "./../layout/MetaData"
import Loader from "./../layout/Loader"
import { useSelector, useDispatch } from "react-redux"
import { MDBDataTable } from "mdbreact"
import { useAlert } from "react-alert"
import Sidebar from "./../admin/Sidebar"
import { getAdminProducts, clearErrors } from "./../../actions/productActions"

const AdminProducts = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const alert = useAlert();
  const { products, error, loading } = useSelector(state => state.productsReducer)

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearErrors())
    }
    dispatch(getAdminProducts())
  }, [dispatch, error, alert])

  function setProducts() {
    const data = {
      columns: [
        {
          label: "Product ID",
          field: "id",
          sort: "asc"
        },
        {
          label: "Name",
          field: "name",
          sort: "asc"
        },
        {
          label: "Price",
          field: "price",
          sort: "asc"
        },
        {
          label: "Stock",
          field: "stock",
          sort: "asc"
        },
        {
          label: "Actions",
          field: "actions", 
          sort: "asc"
        }
      ],
      rows: [ ]
    }

    products.forEach( product => {
      data.rows.push({
        id: product._id,
        name: product.name,
        price: `$${product.price}`,
        stock: product.stock,
        actions: 
          <Fragment>
            <Link className="btn btn-primary" to={`/product/${product._id}`}><i className="fa fa-pencil"></i></Link>
            <button className="btn btn-danger py-1 px-2 ml-2">
              <i className="fa fa-trash"></i>
            </button>
          </Fragment>
        
      })
    })
    return data;
  }

  return (
    <Fragment>
      <MetaData title={"All Products"}/>
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>
        <div className="col-12 col-md-10">
          <h1 className="mt-5">All Products</h1>
          {loading ? (
          <Loader />
        ) : (
          products && (
          <MDBDataTable 
            data={setProducts()}
            className="px-3"
            bordered
            striped
            hover
          />)
        )}
        </div>
      </div>
    </Fragment>
  )
}


export default AdminProducts