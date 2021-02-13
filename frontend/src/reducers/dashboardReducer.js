import {
  DASHBOARD_REQUEST,
  DASHBOARD_SUCCESS,
  DASHBOARD_FAIL,
  CLEAR_ERRORS
} from "./../constants/dashboardConstants"

const initialStateDashboardReducer = { }
export const dashboardReducer = (state = initialStateDashboardReducer, action) => {
  switch(action.type) {
    
    case DASHBOARD_REQUEST:
      return { 
        loading: true
      }

    case DASHBOARD_SUCCESS:
      return {
        loading: false,
        amount: action.payload.amount,
        products: action.payload.products,
        orders: action.payload.orders,
        users: action.payload.users,
        outOfStock: action.payload.outOfStock
      }
    
    case DASHBOARD_FAIL: 
      return {
        loading: false,
        error: action.payload
      }
    
    
    case CLEAR_ERRORS:
      return initialStateDashboardReducer
    default:
      return state
  }
}