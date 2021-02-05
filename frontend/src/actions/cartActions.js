import axios from "axios";
import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CLEAR_CART,
  CART_ITEMS_REQUEST,
  CART_ITEMS_SUCCESS,
  CART_ITEMS_FAIL,
  CART_ITEMS_CLEAR_ERRORS,
  CART_ITEMS_UPDATE_QUANTITY,
  ADD_SHIPPING_INFO

} from "./../constants/cartConstants"

export const addItemToCart = (id, quantity) => async (dispatch, getState) => {
  try { 
    const { data } = await axios.get(`http://localhost:4000/api/v1/product/${id}`)

    dispatch({
      type: ADD_TO_CART,
      payload: {
        product: data.product._id,
        quantity
      }
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cartReducer.cartItems))

  } catch(error) {
    console.log(error)
  }
}

export const loadCart = (cartItems) => async (dispatch) => {

  try { 
    dispatch({
      type: CART_ITEMS_REQUEST
    })

    const config = {
      headers: {
        'Content-Type' : "application/json"
      },
      withCredentials: true
    }

    const body = {
      cartItems
    }

    const { data } = await axios.post(`http://localhost:4000/api/v1/cart`, body, config)

    //Hora de mesclar as 2 arrays, uma com os dados dos produtos vindo do banco e a outra, quantidade que o usuario esta comprando, ate porque, 
    //preciso calcular depois o valor total, contralar quantidade e etc

    let products = data.products.map(item => { 
      return {
        ...item,
        cartQuantity: cartItems.filter(i => i.product === item._id)[0].quantity
      }
    })

    localStorage.setItem("products", JSON.stringify(products))

    dispatch({
      type: CART_ITEMS_SUCCESS,
      payload: products
    })

  } catch(error) {
    dispatch({
      type: CART_ITEMS_FAIL,
      payload: error.response.data.errorMessage
    })
  }
}

export const deleteFromCart = (id) => (dispatch) => {
  dispatch({
    type: REMOVE_FROM_CART,
    payload: id
  })
}
 
export const updateCartQuantity = (id, newQuantity) => (dispatch) => {
  dispatch({
    type: CART_ITEMS_UPDATE_QUANTITY,
    payload: {
      newQuantity,
      id
    }
  })
}

export const saveShippingInfo = (formData) => (dispatch) => {

  const shippingInfo = {
    address: formData.get("address"),
    city: formData.get("city"),
    zipCode: formData.get("zipCode"),
    phone: formData.get("phone"),
    country: formData.get("country")  
  }

  dispatch({
    type: ADD_SHIPPING_INFO,
    payload: shippingInfo
  })

  localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo))
  
}

export const clearCart = () => async (dispatch) => {
  dispatch({
    type: CLEAR_CART
  })
}

export const clearCartErrors = () => async (dispatch) => {
  dispatch({
    type: CART_ITEMS_CLEAR_ERRORS,
  })
}
