import { 
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  CLEAR_ERRORS,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL
} from "./../constants/userConstants"

const userInitialState = { user: { loading: false, isAuthenticated: false } }

export const userReducer = (state = userInitialState, action) => {
  switch(action.type) {

    case LOAD_USER_REQUEST:
    case SIGNUP_REQUEST:
    case LOGIN_REQUEST:
      return {
        loading: true,
        isAuthenticated: false,
      }

    case LOAD_USER_SUCCESS:
    case SIGNUP_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        loading: false,
        isAuthenticated: true,
        user: action.payload
      }

    case LOAD_USER_FAIL:
      return {
        loading: false,
        isAuthenticated: false
      }

    case SIGNUP_FAIL:
    case LOGIN_FAIL:
      return {
        loading: false,
        isAuthenticated: false,
        error: action.payload,
      }

    case CLEAR_ERRORS: 
      const { error, ...rest } = state
      return rest

    default: 
      return state;
  }
}