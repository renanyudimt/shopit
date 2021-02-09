import { 
  ALL_PRODUCT_REQUEST, 
  ALL_PRODUCT_SUCCESS, 
  ALL_PRODUCT_FAIL,
  CLEAR_ERRORS,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  NEW_REVIEW_FAIL,
  NEW_REVIEW_CLEAR,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_FAIL
  
} from "../constants/productConstants"

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
      const { error, ...rest } = state
      return rest;

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
      const { error, ...rest } = state
      return rest;

    default:
      return state
  }
}

const initialStateNewReview = { }
export const newReviewReducer = (state = initialStateNewReview, action) => {
  switch(action.type) {
    case DELETE_REVIEW_REQUEST:
    case NEW_REVIEW_REQUEST:
      return {
        loading: true
      }

    case DELETE_REVIEW_SUCCESS:
      return {
        loading: false,
        success: action.payload,  
        message: "Review deleted successfully"
      }

    case NEW_REVIEW_SUCCESS:
      return {
        loading: false,
        success: action.payload,
        message: "Review posted successfully"
      }

    case DELETE_REVIEW_FAIL:
    case NEW_REVIEW_FAIL:
      return {
        loading: false,
        error: action.payload
      }

    case NEW_REVIEW_CLEAR: 
      return state

    default:
      return state
  }
}