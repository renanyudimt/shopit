import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CART_ITEMS_REQUEST,
  CART_ITEMS_SUCCESS,
  CART_ITEMS_FAIL,
  CART_ITEMS_CLEAR_ERRORS,
  CART_ITEMS_UPDATE_QUANTITY,
  ADD_SHIPPING_INFO

} from "./../constants/cartConstants"

const initialStateCart = {
  cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
  shippingInfo: localStorage.getItem("shippingInfo") ? JSON.parse(localStorage.getItem("shippingInfo")) : {}, 
  products: []
}

export const cartReducer = (state = initialStateCart, action) => {
  switch(action.type) {
    case ADD_TO_CART:
      const item = action.payload
      const itemExist = state.cartItems.find(i => i.product === item.product)

      if (itemExist) { //update
          return {
            ...state,
            cartItems: state.cartItems.map(i => i.product === itemExist.product ? item : i)
          }
      } else { //add 
        return {
          ...state, 
          cartItems: [
            ...state.cartItems, 
            item
          ]
        }   
      }

    case REMOVE_FROM_CART:
      return {
        ...state,
        cartItems: state.cartItems.filter(i => i.product != action.payload),
        products: state.products.filter(i => i._id != action.payload)
      }

    case CART_ITEMS_REQUEST:
      return {
        ...state,
        loading: true
      }

    case CART_ITEMS_SUCCESS:
      return {
        ...state,
        products: action.payload,
        loading: false
      }

    case CART_ITEMS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      }

    case CART_ITEMS_CLEAR_ERRORS:
      const { error, ...rest } = state
      return rest

    case CART_ITEMS_UPDATE_QUANTITY:
      return {
        ...state,
        cartItems: state.cartItems.map(i => {
          if (i.product === action.payload.id) {
            i.quantity = action.payload.newQuantity
          }
          return i;
        }),
        products: state.products.map(i => {
          if (i._id === action.payload.id) {
            i.cartQuantity = action.payload.newQuantity
          }
          return i;
        }),
      }

    case ADD_SHIPPING_INFO:
      return {
        ...state, 
        shippingInfo: action.payload
      }

    default: 
      return state
  }
}