import axios from "axios"
import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAIL,
  ALL_ORDERS_REQUEST,
  ALL_ORDERS_SUCCESS,
  ALL_ORDERS_FAIL,
  GET_ORDER_REQUEST,
  GET_ORDER_SUCCESS,
  GET_ORDER_FAIL,
  CLEAR_ERRORS
} from "./../constants/orderConstants"

export const createOrder = (order) => async (dispatch) => {
  try {
    dispatch({
      type: CREATE_ORDER_REQUEST,
    })

    const config = {
      headers: {
        "Content-Type" : "application/json"
      },
      withCredentials: true
    }

    const { data } = await axios.post("http://localhost:4000/api/v1/order/new", order, config)

    dispatch({
      type: CREATE_ORDER_SUCCESS,
      payload: data.order
    })

  } catch(error) {
    dispatch({
      type: CREATE_ORDER_FAIL,
      error: error.response.data.errorMessage
    })
  }
}

export const getAllOrders = () => async (dispatch) => {
  try {
    dispatch({
      type: ALL_ORDERS_REQUEST
    })

    const config = {
      withCredentials: true
    }

    const { data } = await axios.get("http://localhost:4000/orders", config)

    dispatch({
      type: ALL_ORDERS_SUCCESS,
      payload: data
    })

  } catch(error) {
    dispatch({
      type: ALL_ORDERS_FAIL,
      payload: error.response.data.errorMessage
    })
  }
}

export const getOrder = (id) => async (dispatch) => {
  try {
    dispatch({
      type: GET_ORDER_REQUEST
    })

    const config = {
      withCredentials: true
    }

    const { data } = await axios.get(`http://localhost:4000/order/${id}`, id ,config)

    dispatch({
      type: GET_ORDER_SUCCESS,
      payload: data.order
    })

  } catch(error) {
    dispatch({
      type: GET_ORDER_FAIL,
      payload: error.response.data.errorMessage
    })
  }
} 


export const clearErrors = () => (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS
  })
}