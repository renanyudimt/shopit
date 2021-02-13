import axios from "axios"
import {
  DASHBOARD_REQUEST,
  DASHBOARD_SUCCESS,
  DASHBOARD_FAIL,
  CLEAR_ERRORS
} from "./../constants/dashboardConstants"

export const getDashboardInfo = () => async (dispatch) => {
  try {
    dispatch({
      type: DASHBOARD_REQUEST
    })

    const config = {
      withCredentials: true
    }

    const { data } = await axios.get("http://localhost:4000/api/v1/admin/dashboard", config)

    dispatch({
      type: DASHBOARD_SUCCESS,
      payload: {
        amount: data.amount,
        products: data.products,
        orders: data.orders,
        users: data.users,
        outOfStock: data.outOfStock
      }
    })

  } catch(error) {
    dispatch({
      type: DASHBOARD_FAIL
    })

  }
}