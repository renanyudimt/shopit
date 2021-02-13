import React, { Fragment, useEffect } from 'react'
import { Link, useHistory } from "react-router-dom"
import MetaData from "./../layout/MetaData"
import Loader from "./../layout/Loader"
import { useSelector, useDispatch } from "react-redux"
import { MDBDataTable } from "mdbreact"
import { useAlert } from "react-alert"
import Sidebar from "./../admin/Sidebar"
import { getAdminProductsOutOfStock, clearErrors } from "./../../actions/productActions"

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
    dispatch(getAdminProductsOutOfStock())
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
            <Link className="btn btn-primary" to={`/admin/product/${product._id}`}><i className="fa fa-pencil"></i></Link>
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
          <h1 className="mt-5">All Products Out Of Stock</h1>
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