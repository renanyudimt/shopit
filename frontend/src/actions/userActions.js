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
  LOAD_USER_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  CLEAR_LOGOUT,
  UPDATE_PROFILE_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  NEW_PASSWORD_REQUEST,
  NEW_PASSWORD_SUCCESS,
  NEW_PASSWORD_FAIL
} from "./../constants/userConstants"

export const userLogin = (email, password) => async (dispatch) => {
  try {
    dispatch({ 
      type: LOGIN_REQUEST
    })

    const config = {
      headers: {
        'Content-Type' : "application/json"
      },
      withCredentials: true
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
      payload: error.response.data.errorMessage
    })
  }
}

export const userSignup = (userData) => async (dispatch) => {
  try {
    dispatch({
      type: SIGNUP_REQUEST
    })

    const config = {
      headers: {
        'Content-Type' : "multipart/form-data"
      },
      withCredentials: true
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

    const config = {
      withCredentials: true,
    }

    const { data } = await axios.get("http://localhost:4000/api/v1/user", config)

    dispatch({
      type: LOAD_USER_SUCCESS,
      payload: {
        success: data.success,
        user: data.user
      }
    })

  } catch(error) {
    dispatch({
      type: LOAD_USER_FAIL,
      payload: error.response.data.errorMessage
    })
  }
}

export const userLogout = () => async (dispatch) => {
  try {

    const config = {
      withCredentials: true
    }

    await axios.get("http://localhost:4000/api/v1/logout", config)

    dispatch({
      type: LOGOUT_SUCCESS
    })

  } catch(error) {
    dispatch({
      type: LOGOUT_FAIL
    })
  }
}

export const updateUser = (userData) => async (dispatch) => {
  try {
    dispatch({
      type: UPDATE_PROFILE_REQUEST
    })

    const config = {
      headers: {
        'Content-Type' : "application/json"
      },
      withCredentials: true
    }

    const { data } = await axios.put("http://localhost:4000/api/v1/user/update", userData, config)

    dispatch({
      type: UPDATE_PROFILE_SUCCESS,
      payload: data.success
    })

  } catch(error) {
    dispatch({
      type: UPDATE_PROFILE_FAIL,
      payload: error.response.data.errorMessage
    })
  }
}

export const updatePassword = (passwords) => async (dispatch) => {
  console.log(passwords)
  try {
    dispatch({
      type: UPDATE_PASSWORD_REQUEST
    })

    const config = {
      headers: {
        'Content-Type' : "multipart/form-data"
      },
      withCredentials: true
    }

    const { data } = await axios.put("http://localhost:4000/api/v1/password/update", passwords, config)

    dispatch({
      type: UPDATE_PASSWORD_SUCCESS,
      payload: data.success
    })

  } catch(error) {
    dispatch({
      type: UPDATE_PASSWORD_FAIL,
      payload: error.response.data.errorMessage
    })
  }
}

export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({
      type: FORGOT_PASSWORD_REQUEST
    })

    const config = {
      headers: {
        'Content-Type' : "multipart/form-data"
      },
      withCredentials: true
    }

    const { data } = await axios.post("http://localhost:4000/api/v1/password/forgot", email, config)

    dispatch({
      type: FORGOT_PASSWORD_SUCCESS,
      payload : {
        message: data.message,
        success: data.success
      }
    })

  } catch(error) {
    dispatch({
      type: FORGOT_PASSWORD_FAIL,
      payload: error.response.data.errorMessage
    })
  }
}

export const newPassword = (token, passwords) => async(dispatch) => {
  try {
    dispatch({
      type: NEW_PASSWORD_REQUEST
    })

    const config = {
      headers: {
        'Content-Type' : "multipart/form-data"
      }
    }

    const { data } = await axios.put(`http://localhost:4000/api/v1/password/reset/${token}`, passwords, config)

    dispatch({
      type: NEW_PASSWORD_SUCCESS,
      payload: {
        success: data.success,
        message: data.message
      }
    })
    
  } catch(error) {
    dispatch({
      type: NEW_PASSWORD_FAIL,
      payload: error.response.data.errorMessage
    })
  }
}

export const clearLogout = () => async (dispatch) => {
  dispatch({
    type: CLEAR_LOGOUT
  })
}

export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS
  })
}