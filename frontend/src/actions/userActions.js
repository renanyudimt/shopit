import axios from "axios"
import { 
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  CLEAR_ERRORS,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL
} from "./../constants/userConstants"

export const userLogin = (email, password) => async (dispatch) => {
  try {
    dispatch({ 
      type: LOGIN_REQUEST
    })

    const config = {
      headers: {
        'Content-Type' : "application/json"
      }
    }

    const payload = {
      email,
      password
    }

    const { data } = await axios.post("http://localhost:4000/api/v1/login", payload, config)

    dispatch({
      type: LOGIN_SUCCESS,
      payload: data.user
    })

  } catch(error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response.data.message
    })
  }
}

export const userSignup = (userData) => async (dispatch) => {
  try {
    console.log(userData)
    dispatch({
      type: SIGNUP_REQUEST
    })

    const config = {
      headers: {
        'Content-Type' : "multipart/form-data"
      }
    }

    const { data } = await axios.post("http://localhost:4000/api/v1/register", userData, config)

    dispatch({
      type: SIGNUP_SUCCESS,
      payload: data.user
    })

  } catch(error) {
    dispatch({
      type: SIGNUP_FAIL,
      payload: error.response.data.errorMessage
    })
  }
}

export const loadUser = () => async (dispatch) => {
  try {
    dispatch({
      type: LOAD_USER_REQUEST
    })

    const { data } = await axios.get("http://localhost:4000/api/v1/user")

    dispatch({
      type: LOAD_USER_SUCCESS,
      payload: data.user
    })

  } catch(error) {
    dispatch({
      type: LOAD_USER_FAIL,
      payload: error.response.data.errorMessage
    })
  }
}

export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS
  })
}