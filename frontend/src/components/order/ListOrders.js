import React, { Fragment, useEffect } from 'react'
import { Link } from "react-router-dom"
import Loader from "./../layout/Loader"
import { MDBDataTable } from "mdbreact"
import MetaData from "./../layout/MetaData"
import { useAlert } from "react-alert"
import { useDispatch, useSelector } from "react-redux"
import { getAllOrders, clearErrors } from "./../../actions/orderActions"

const ListOrders = () => {
  const alert = useAlert();
  const dispatch = useDispatch()
  const { orders, loading, error } = useSelector(state => state.ordersReducer) 

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearErrors())
    }

    dispatch(getAllOrders())
  }, [dispatch, error, alert])

  function setOrders() {
    const data = {
      columns = [
        {
          label: "Order ID",
          field: "id",
          sort: "asc"
        },
        {
          label: "Num of Items",
          field: "", //fazer uma logica que pega o acc de todos os itens
          sort: "asc"
        },
      ]
    }
  }

  return (
    <Fragment>
      <MetaData title="My Orders" />
      <div class="container container-fluid">
        <h1 className="mt-5">My Orders</h1>
        {loading ? (
          <Loader />
        ) : (
          <MDBDataTable 
            data={setOrders()}
            className="px-3"
            bordered
            striped
            hover
          />
        )}
      </div>
    </Fragment>
  )
}

export default ListOrders