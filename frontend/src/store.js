import { createStore, combineReducers, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import { composeWithDevTools } from "redux-devtools-extension"
import { productsReducer, productDetailsReducer } from "./reducers/productReducer"
import { userReducer, updateUserReducer, forgotPasswordReducer, newPasswordReducer } from "./reducers/userReducer"
import { cartReducer } from "./reducers/cartReducer"
import { createOrderReducer, myOrdersReducer } from "./reducers/orderReducer"

const reducer = combineReducers({
  productsReducer,
  productDetailsReducer,
  userReducer,
  updateUserReducer,
  forgotPasswordReducer,
  newPasswordReducer,
  cartReducer,
  createOrderReducer,
  myOrdersReducer,
})

let initialState = {}

const middleware = [thunk]
const store = createStore(
    reducer, 
    initialState, 
    composeWithDevTools(applyMiddleware(...middleware))
  )

export default store;