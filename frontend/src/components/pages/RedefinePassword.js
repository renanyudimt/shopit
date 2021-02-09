import React, { Fragment, useState, useEffect } from "react";
import MetaData from "./../layout/MetaData";
import Loader from "./../layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import { newPassword } from "./../../actions/userActions"
import { useHistory, useParams } from "react-router-dom"
import { NEW_PASSWORD_RESET } from "./../../constants/userConstants"
import { useAlert } from "react-alert";

const RedefinePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const { loading, error, message, isUpdated } = useSelector(state => state.newPasswordReducer)
  const { isAuthenticated } = useSelector(state => state.userState ? state.userState : false )
  const history = useHistory(); 
  const params = useParams(); 
  const alert = useAlert();

  useEffect(() => {
    if (isAuthenticated) {
      history.push("/")
    }

    if (error) {
      alert.error(error)
      dispatch({
        type: NEW_PASSWORD_RESET
      })
    }

    if (isUpdated) {
      alert.success(message)
      history.push("/login")
      dispatch({
        type: NEW_PASSWORD_RESET
      })
    }
  }, [dispatch, alert, error, isUpdated, history, message])

  function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      return alert.error("Passwords did not match")
    } 

    const formData = new FormData(e.target)
    formData.set("password", password)
    formData.set("confirmPassword", confirmPassword)
    dispatch(newPassword(params.token, formData))
  }


  return (
    <Fragment>
      <MetaData title="New Password" />
      <div className="container-fluid container">
        { loading ? (<Loader />) : (
          <div className="row wrapper">
            <div className="col-10 col-lg-5">
              <form className="shadow-lg" onSubmit={ handleSubmit } >
                <h1 className="mb-3">New Password</h1>

                <div className="form-group">
                  <label htmlFor="password_field">Password</label>
                  <input type="password" id="password_field" name="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
                </div>

                <div className="form-group">
                  <label htmlFor="confirm_password_field">Confirm Password</label>
                  <input type="password" id="confirm_password_field" name="confirmpassword" className="form-control" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </div>

                <button id="new_password_button" type="submit" className="btn btn-block py-3">Set Password</button>
              </form>
            </div>
          </div>
        )}
      
      </div>
    </Fragment>
  );
};

export default RedefinePassword;