import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Loader from "./../layout/Loader";
import MetaData from "./../layout/MetaData";
import { useAlert } from "react-alert";
import { UPDATE_PASSWORD_RESET } from "./../../constants/userConstants"
import { updatePassword } from "./../../actions/userActions"

const PasswordUpdate = () => {
  const [ oldPassword, setOldPassword ] = useState("");
  const [ newPassword, setNewPassword ] = useState("");
  const history = useHistory(); 
  const { loading, error, isUpdated } = useSelector(state => state.updateUserReducer)
  const dispatch = useDispatch();
  const alert = useAlert();
  
  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch({
        type: UPDATE_PASSWORD_RESET
      })
    }

    if (isUpdated) {
      alert.success("Password updated successfully")
      dispatch({
        type: UPDATE_PASSWORD_RESET
      })
      history.push("/profile")
    }

  }, [dispatch, error, isUpdated, history, alert])

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.set("oldPassword", oldPassword)
    formData.set("newPassword", newPassword)
    dispatch(updatePassword(formData))
  }

  return (
    <Fragment>
      <MetaData tilte="Update Password" />
      <div className="container container-fluid">
        {loading ? (
          <Loader />
        ) : (
          <div className="row wrapper">
            <div className="col-10 col-lg-5">
              <form className="shadow-lg" onSubmit={handleSubmit}>
                <h1 className="mt-2 mb-5">Update Password</h1>
                <div className="form-group">
                  <label htmlFor="old_password_field">Old Password</label>
                  <input type="password" id="old_password_field" name="oldPassword" className="form-control" value={oldPassword} onChange={e => setOldPassword(e.target.value)}/>
                </div>

                <div className="form-group">
                  <label htmlFor="new_password_field">New Password</label>
                  <input type="password" id="new_password_field" name="newPassword" className="form-control" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                </div>

                <button type="submit" className="btn update-btn btn-block mt-4 mb-3" disabled = { loading ? true : false}>Update Password</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default PasswordUpdate;
