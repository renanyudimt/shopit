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
  LOAD_USER_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  CLEAR_LOGOUT,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  UPDATE_PROFILE_RESET,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAIL,
  UPDATE_PASSWORD_RESET,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  FORGOT_PASSWORD_RESET,
  NEW_PASSWORD_REQUEST,
  NEW_PASSWORD_SUCCESS,
  NEW_PASSWORD_FAIL,
  NEW_PASSWORD_RESET
} from "./../constants/userConstants";

const userInitialState = { user: {} };
export const userReducer = (state = userInitialState, action) => {
  switch (action.type) {
    case LOAD_USER_REQUEST:
    case SIGNUP_REQUEST:
    case LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case LOAD_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: action.payload.success,
        user: action.payload.user,
      }

    case SIGNUP_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };

    case LOGOUT_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        logout: true,
        user: null,
      };

    case LOAD_USER_FAIL:
      return {
        loading: false,
        isAuthenticated: false,
      };

    case SIGNUP_FAIL:
    case LOGIN_FAIL:
      return {
        loading: false,
        isAuthenticated: false,
        error: action.payload,
      };

    case LOGOUT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case CLEAR_LOGOUT:
      return {
        ...state,
        logout: null,
      };

    case CLEAR_ERRORS:
      const { error, ...rest } = state;
      return rest;

    default:
      return state;
  }
};

const inititalStateUpdateProfile = {};
export const updateUserReducer = (
  state = inititalStateUpdateProfile,
  action
) => {
  switch (action.type) {
    case UPDATE_PASSWORD_REQUEST:
    case UPDATE_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case UPDATE_PASSWORD_SUCCESS:
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };

    case UPDATE_PASSWORD_FAIL:
    case UPDATE_PROFILE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_PASSWORD_RESET:
    case UPDATE_PROFILE_RESET:
      const { error, isUpdated, ...rest } = state;
      return rest;

    default:
      return state;
  }
};

const initialStateForgotPassword = {};
export const forgotPasswordReducer = (
  state = initialStateForgotPassword,
  action
) => {
  switch (action.type) {
    case FORGOT_PASSWORD_REQUEST:
      return {
        loading: true,
      };

    case FORGOT_PASSWORD_SUCCESS:
      return {
        loading: false,
        isReseted: action.payload.success,
        message: action.payload.message,
      };

    case FORGOT_PASSWORD_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    case FORGOT_PASSWORD_RESET:
      return initialStateForgotPassword;

    default:
      return state;
  }
};

const initialStateNewPassword = {};
export const newPasswordReducer = (state = initialStateNewPassword, action) => {
  switch(action.type) {
    case NEW_PASSWORD_REQUEST:
      return {
        loading: true
      }

    case NEW_PASSWORD_SUCCESS:
      return {
        loading: false,
        isUpdated: action.payload.success,
        message: action.payload.message
      }

    case NEW_PASSWORD_FAIL: 
      return {  
        loading: false,
        error: action.payload
      }

    case NEW_PASSWORD_RESET: 
      return initialStateNewPassword

    default:
      return state
  }
}
