import React, { useEffect, useState, Fragment } from "react";
import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { useHistory } from "react-router-dom";
import { FORGOT_PASSWORD_RESET } from "../../constants/userConstants"
import { forgotPassword } from "../../actions/userActions"

const ForgotPasswordPage = () => {
  const { loading, error, isReseted, message } = useSelector(state => state.forgotPasswordReducer);
  const { isAuthenticated } = useSelector(state => state.userReducer)
  const history = useHistory();

  const [email, setEmail] = useState("");
  const alert = useAlert();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      history.push("/")
    }

    if(error) {
      alert.error(error)
      dispatch({
        type: FORGOT_PASSWORD_RESET
      })
    }

    if (isReseted) {
      alert.success(message)
      history.push("/login")
      dispatch({
        type: FORGOT_PASSWORD_RESET
      })
    }

  }, [dispatch, alert, error, isReseted, history, isAuthenticated, message])

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target)
    formData.set("email", email)
    dispatch(forgotPassword(formData))
  }

  return (
    <Fragment>
      <MetaData />
      <div className="container container-fluid">
        {loading ? (
          <Loader />
        ) : (
          <div className="row wrapper">
            <div className="col-10 col-lg-5">
              <form className="shadow-lg" onSubmit={handleSubmit}>
                <h1 className="mb-3">Forgot Password</h1>
                <div className="form-group">
                  <label htmlFor="email_field">Enter Email</label>
                  <input type="email" id="email_field" className="form-control" name="email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <button id="forgot_password_button" type="submit" className="btn btn-block py-3" disabled={loading ? true : false}>Send Email</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default ForgotPasswordPage;
