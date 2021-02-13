import axios from "axios"
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
  DELETE_REVIEW_FAIL,
  ADMIN_PRODUCTS_REQUEST,
  ADMIN_PRODUCTS_SUCCESS,
  ADMIN_PRODUCTS_FAIL,
  NEW_PRODUCT_REQUEST,
  NEW_PRODUCT_SUCCESS,
  NEW_PRODUCT_FAIL

} from "./../constants/productConstants"

export const getProducts = (currentPage, keyword, price, category, rating) => async (dispatch) => {
  try {

    dispatch({ type: ALL_PRODUCT_REQUEST })
    let url = `http://localhost:4000/api/v1/products?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}&ratings[gte]=${rating}`
    
    if (category) {
      url = url + `&category=${category}`
    }
    
    const { data } = await axios.get(url)
    dispatch({
      type: ALL_PRODUCT_SUCCESS,
      payload: data
    })

  } catch(error) {
    dispatch({
      type: ALL_PRODUCT_FAIL,
      payload: error.response.data.errorMessage
    }) 
  }
}

export const getProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST })
    const { data } = await axios.get(`http://localhost:4000/api/v1/product/${id}`)
    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data.product
    })
  } catch(error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response.data.errorMessage
    })
  }
}

export const newReview = (reviewData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_REVIEW_REQUEST })

    const config = {
      headers: {
        'Content-Type' : "multipart/form-data"
      },
      withCredentials: true
    }

    const { data } = await axios.put(`http://localhost:4000/api/v1/review/`, reviewData, config)
    
    dispatch({
      type: NEW_REVIEW_SUCCESS,
      payload: data.success
    })
  } catch(error) {
    dispatch({
      type: NEW_REVIEW_FAIL,
      payload: error.response.data.errorMessage
    })
  }
}

export const deleteReview = (productId, reviewId) => async (dispatch) => {
  try {
    dispatch({
      type: DELETE_REVIEW_REQUEST
    })

    const config = {
      headers: {
        "Content-Type": "application/json"
      },
      withCredentials: true
    }
    const { data } = await axios.delete(`http://localhost:4000/api/v1/review?productId=${productId}&reviewId=${reviewId}`, config)

    dispatch({
      type: DELETE_REVIEW_SUCCESS,
      payload: data.success
    })
  } catch(error) {
    dispatch({
      type: DELETE_REVIEW_FAIL,
      payload: error.response.data.errorMessage
    })
  }
} 

export const getAdminProducts = () => async (dispatch) => {
  try {

    dispatch({
      type: ADMIN_PRODUCTS_REQUEST
    })

    const config = {
      withCredentials: true
    }

    const { data } = await axios.get("http://localhost:4000/api/v1/admin/products", config)

    dispatch({
      type: ADMIN_PRODUCTS_SUCCESS,
      payload: data.products
    })

  } catch(error) {
    dispatch({
      type: ADMIN_PRODUCTS_FAIL,
      paylaod: error.response.data.errorMessage
    })
  }
}

export const getAdminProductsOutOfStock = () => async (dispatch) => {
  try {

    dispatch({
      type: ADMIN_PRODUCTS_REQUEST
    })

    const config = {
      withCredentials: true
    }

    const { data } = await axios.get("http://localhost:4000/api/v1/admin/products/outofstock", config)

    dispatch({
      type: ADMIN_PRODUCTS_SUCCESS,
      payload: data.products
    })

  } catch(error) {
    dispatch({
      type: ADMIN_PRODUCTS_FAIL,
      paylaod: error.response.data.errorMessage
    })
  }
}

export const newProduct = (productData) => async (dispatch) => {
  try {
    dispatch({
      type: NEW_PRODUCT_REQUEST
    })

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json"
      }
    }

    const { data } = await axios.post("http://localhost:4000/api/v1/admin/product/new", productData, config)
    dispatch({
      type: NEW_PRODUCT_SUCCESS,
      payload: data.success
    })

  } catch(error) {
    console.log(error.response.data)

  dispatch({
      type: NEW_PRODUCT_FAIL,
      payload: error.response.data.errorMessage
    })
  }
}

export const resetNewReview = () => async(dispatch) => {
  dispatch({
    type: NEW_REVIEW_CLEAR
  })
}

export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS
  })
}