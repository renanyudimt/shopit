import { 
  ALL_PRODUCT_REQUEST, 
  ALL_PRODUCT_SUCCESS, 
  ALL_PRODUCT_FAIL,
  CLEAR_ERRORS,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL
} from "./../constants/productConstants"

const initialStateProducts = {
  loading: true,
  products: []
}

export const productsReducer = (state = initialStateProducts, action) => {
  switch(action.type) {
    case ALL_PRODUCT_REQUEST: 
      return {
        loading: true,
        products: []
      }

    case ALL_PRODUCT_SUCCESS:
      return {
        loading: false,
        products: action.payload.products,
        productsCount: action.payload.productsCount,
        resPerPage: action.payload.resPerPage,
        filteredProductsCount: action.payload.filteredProductsCount,
      }

    case ALL_PRODUCT_FAIL:
      return {
        loading: false,
        error: action.payload
      }

    case CLEAR_ERRORS: 
      return {
        ...state,
        error: null
      }

    default:
      return state
  }
}

const initialStateProductDetails = {
  loading: true,
  product: {}
}

export const productDetailsReducer = (state = initialStateProductDetails, action) => {
  switch(action.type) {

    case PRODUCT_DETAILS_REQUEST:
       return {
         ...state,
         loading: true
       };

    case PRODUCT_DETAILS_SUCCESS:
      return {
        loading: false,
        product: action.payload
      };

    case PRODUCT_DETAILS_FAIL:
      return {
        ...state,
        error: action.payload
      };

    case CLEAR_ERRORS: 
      return {
        ...state,
        error: null
      }

    default:
      return state
  }
}