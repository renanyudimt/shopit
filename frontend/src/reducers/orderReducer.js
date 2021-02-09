import { 
  CREATE_ORDER_REQUEST, 
  CREATE_ORDER_SUCCESS, 
  CREATE_ORDER_FAIL, 
  ALL_ORDERS_REQUEST,
  ALL_ORDERS_SUCCESS,
  ALL_ORDERS_FAIL,
  CLEAR_ERRORS,
  GET_ORDER_REQUEST,
  GET_ORDER_SUCCESS,
  GET_ORDER_FAIL
} from "./../constants/orderConstants"

const initialStateCreateOrder = {}
export const createOrderReducer = (state = initialStateCreateOrder, action) => {
  switch(action.type) {
    case CREATE_ORDER_REQUEST:
      return { 
        ...state,
        loading: true
      }
    
    case CREATE_ORDER_SUCCESS:
      return {
        ...state,
        success: true,
        loading: false,
        order: action.payload
      }

    case CREATE_ORDER_FAIL:
      return {
        loading: false,
        error: action.payload
      }

    case CLEAR_ERRORS: 
      const { error, ...rest } = state
      return rest
    
    default:
      return state
  }
}

const initialStateMyOrders = { orders: []}
export const myOrdersReducer = (state = initialStateMyOrders, action) => {
  switch(action.type) {
    case ALL_ORDERS_REQUEST:
      return {
        ...state,
        loading: true
      }

    case ALL_ORDERS_SUCCESS:
      return {
        loading: false,
        orders: action.payload
      }

    case ALL_ORDERS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      }

    case CLEAR_ERRORS: 
      const { error, ...rest } = state
      return rest

    default: 
      return state;
  }
}

const initialStateTargetOrder = { order: {}, loading: true }
export const getOrderReducer = (state = initialStateTargetOrder, action) => {
  switch(action.type) {
    case GET_ORDER_REQUEST:
      return {
        loading: true,
        order: {}
      }

    case GET_ORDER_SUCCESS:
      return {
        loading: false,
        order: action.payload
      }

    case GET_ORDER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      }

    default:
      return state;
  }
}