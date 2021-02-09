import React, { Fragment, useEffect } from 'react'
import { Link } from "react-router-dom"
import Loader from "../layout/Loader"
import { MDBDataTable } from "mdbreact"
import MetaData from "../layout/MetaData"
import { useAlert } from "react-alert"
import { useDispatch, useSelector } from "react-redux"
import { getAllOrders, clearErrors } from "../../actions/orderActions"

const ListOrders = () => {
  const alert = useAlert();
  const dispatch = useDispatch()
  const { orders, loading, error } = useSelector(state => state.myOrdersReducer) 

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearErrors())
    }
    dispatch(getAllOrders())
  }, [dispatch, error, alert])

  function setOrders() {
    const data = {
      columns: [
        {
          label: "Order ID",
          field: "id",
          sort: "asc"
        },
        {
          label: "Num of Items",
          field: "numOfItems", //fazer uma logica que pega o acc de todos os itens
          sort: "asc"
        },
        {
          label: "Amount",
          field: "amount",
          sort: "asc"
        },
        {
          label: "Status",
          field: "status",
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

    orders.forEach( order => {
      data.rows.push({
        id: order._id,
        numOfItems: order.orderItems.length,
        amount: `$${order.totalPrice}`,
        status: order.orderStatus && String(order.orderStatus).includes("Delivered") ?
          <p style={{color: "green"}}>{order.orderStatus}</p> :
          <p style={{color: "green"}} >{ order.orderStatus }</p>,
        actions: <Link className="btn btn-primary" to={`/order/${order._id}`}><i className="fa fa-eye"></i></Link>
      })
    })

    return data;
  }

  return (
    <Fragment>
      <MetaData title="My Orders" />
      <div className="container container-fluid">
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